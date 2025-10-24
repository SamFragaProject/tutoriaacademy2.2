import { getEventLog } from './metrics';

export type DateRange = 'today' | '7d' | '30d';

export interface DashboardData {
  kpis: {
    dau: number; wau: number; dauWauRatio: number;
    activationRate: number; retentionD1: number; retentionD7: number;
    preCapHits: number; capHits: number;
    activeSubs: number; emailsSent: number;
    paywallViews: number; paywallConversions: number;
    conversionRate: number; churnRate: number;
    gamesPlayed: number;
    avgNBackLevel: number;
  };
  usage: {
    dailyActivity: { name: string; tutor: number; diag: number; sim: number, games: number }[];
    totalTutorQueries: number; totalDiagnosticos: number; totalSimulacros: number;
    scoreDistribution: { name: string; value: number }[];
    activityHeatmap: number[][];
  };
  learning: {
    weakTopics: { name: string; count: number }[];
    avgStreak: number; avgXp: number;
  };
  costs: {
    totalCost: number;
  };
  revenue: {
    mrr: number; newSubs: number; churn: number;
  };
  funnel: { step: string; value: number }[];
}

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const getDaysInRange = (range: DateRange) => {
    if (range === '30d') return 30;
    if (range === '7d') return 7;
    return 1;
};

const filterEventsByDays = (events: any[], days: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return events.filter(e => new Date(e.timestamp) >= cutoff);
};

export const getDashboardData = async (filters: { dateRange: DateRange }): Promise<DashboardData> => {
  await new Promise(res => setTimeout(res, random(300, 600)));
  const days = getDaysInRange(filters.dateRange);
  const allEvents = getEventLog();
  const events = filterEventsByDays(allEvents, days);

  // --- Process Events ---
  const dailyActivityMap: Record<string, { tutor: number; diag: number; sim: number; games: number; users: Set<string> }> = {};
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    dailyActivityMap[key] = { tutor: 0, diag: 0, sim: 0, games: 0, users: new Set() };
  }

  let totalTutorQueries = 0;
  let totalDiagnosticos = 0;
  let totalSimulacros = 0;
  let preCapHits = 0;
  let capHits = 0;
  const weakTopicsCount: Record<string, number> = {};
  
  const gameEvents = events.filter(e => e.name === 'game_session_completed');
  const nBackEvents = gameEvents.filter(e => e.payload.gameId === 'n-track' && e.payload.metrics?.maxN);
  const avgNBackLevel = nBackEvents.length > 0
    ? nBackEvents.reduce((sum, e) => sum + e.payload.metrics.maxN, 0) / nBackEvents.length
    : 0;

  events.forEach(e => {
    const dayKey = e.timestamp.split('T')[0];
    const dayData = dailyActivityMap[dayKey];
    if (!dayData) return;

    dayData.users.add(e.payload?.userId || 'anonymous');

    if (e.name === 'tutor_query') {
      dayData.tutor++;
      totalTutorQueries++;
    } else if (e.name === 'diagnosis_complete') {
      dayData.diag++;
      totalDiagnosticos++;
      e.payload.weakTopics?.forEach((topic: string) => {
        weakTopicsCount[topic] = (weakTopicsCount[topic] || 0) + 1;
      });
    } else if (e.name === 'simulacro_complete') {
      dayData.sim++;
      totalSimulacros++;
    } else if (e.name === 'game_session_completed') {
      dayData.games++;
    } else if (e.name === 'fair_pre_cap') {
      preCapHits++;
    } else if (e.name === 'fair_cap') {
      capHits++;
    }
  });

  const dailyActivity = Object.entries(dailyActivityMap).map(([name, data]) => ({ name: name.slice(5), ...data })).reverse();
  
  // --- KPIs (some are mocked/hardcoded as we don't have full user data) ---
  const activeSubs = 1;
  const dau = dailyActivityMap[today.toISOString().split('T')[0]]?.users.size || 0;
  const wauEvents = filterEventsByDays(allEvents, 7);
  const wauUsers = new Set(wauEvents.map(e => e.payload?.userId || 'anonymous'));
  const wau = wauUsers.size;

  // --- Funnel (mocked based on events) ---
  const funnel = [
      { step: 'Visitas', value: wau + random(5,15) },
      { step: 'Registros', value: wau + random(1,5) },
      { step: 'Diagnóstico', value: totalDiagnosticos },
      { step: 'Suscripción', value: activeSubs },
  ];

  return {
    kpis: {
      dau, wau, dauWauRatio: wau > 0 ? parseFloat(((dau / wau) * 100).toFixed(1)) : 0,
      activationRate: totalDiagnosticos > 0 ? 80 + random(0,10) : 0, // Mock
      retentionD1: 45, retentionD7: 25, // Mock
      preCapHits, capHits,
      activeSubs,
      emailsSent: 0, paywallViews: 0, paywallConversions: 0, conversionRate: 0, churnRate: 0, // Mock subscription KPIs
      gamesPlayed: gameEvents.length,
      avgNBackLevel: parseFloat(avgNBackLevel.toFixed(1)),
    },
    usage: {
      dailyActivity, totalTutorQueries, totalDiagnosticos, totalSimulacros,
      scoreDistribution: [{ name: 'Mediana', value: 72 }, { name: 'P90', value: 91 }], // Mock
      activityHeatmap: Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => random(0, 100))), // Mock
    },
    learning: {
      weakTopics: Object.entries(weakTopicsCount).sort(([,a],[,b]) => b-a).slice(0,3).map(([name, count]) => ({name, count})),
      avgStreak: 5, avgXp: 2500, // Mock
    },
    costs: {
      totalCost: (totalTutorQueries * 0.0002) + (totalDiagnosticos * 0.001), // Simplified mock cost
    },
    revenue: {
      mrr: activeSubs * 599, newSubs: 0, churn: 0, // Mock
    },
    funnel,
  };
};