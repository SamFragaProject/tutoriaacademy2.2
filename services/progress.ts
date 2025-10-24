

interface ProgressData {
  completed: number;
  total: number;
  streak: number;
  lastActivityISO?: string;
}

interface Shortcut {
  label: string;
  href: string;
}

// Helper to safely parse JSON from localStorage
const getLocalItem = (key: string): any | null => {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error(`Error parsing localStorage item "${key}":`, e);
    return null;
  }
};

export async function getStudentProgress(userId: string): Promise<ProgressData> {
  // Simulate API delay
  await new Promise(res => setTimeout(res, 250));

  // Intentar cargar progreso específico del usuario
  const userProgress = getLocalItem(`progress:${userId}`);
  if (userProgress) {
    return userProgress;
  }

  // Fallback al método anterior
  const diagnostic = getLocalItem('diagnostic:last');
  const mock = getLocalItem('mock:last');
  // In a real app, 'total' would come from a user's study plan
  const totalTasks = 20; // Mock total tasks in a plan

  let completedTasks = 0;
  if (diagnostic) completedTasks++;
  if (mock) completedTasks++;
  
  // A real app would have a more robust streak calculation
  const streak = diagnostic || mock ? 1 : 0; 
  
  return {
    completed: completedTasks,
    total: totalTasks,
    streak: streak,
    lastActivityISO: diagnostic?.at || mock?.at,
  };
}

export async function getShortcuts(userId: string): Promise<Shortcut[]> {
  await new Promise(res => setTimeout(res, 50));
  const diagnostic = getLocalItem('diagnostic:last');
  
  const shortcuts: Shortcut[] = [
    { label: 'Tutor IA', href: '/app/tutor' },
    { label: 'Simulacro', href: '/app/simulacro' },
  ];

  if (diagnostic) {
    shortcuts.unshift({ label: 'Continuar Plan', href: '/app/practicas' });
  } else {
     shortcuts.unshift({ label: 'Hacer Diagnóstico', href: '/app/diagnostico' });
  }

  return shortcuts;
}