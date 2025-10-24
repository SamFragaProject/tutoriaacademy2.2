import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { NavLink, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFlowTracking, useStageCompletionListener } from '../hooks/useFlowTracking';
import { Card, StatCard, PrimaryButton, SecondaryButton, ToggleSwitch, ProgressBar, Chip } from '../components/ui';
// FIX: Imported 'Trophy' and aliased 'User' to 'UserIcon' to resolve name collision.
import { Award, TrendingUp, Zap, BookOpen, Send, UserPlus, Bot, User as UserIcon, Trash2, ArrowLeft, ArrowRight, Check, ChevronsRight, HelpCircle, Target, BrainCircuit, Loader2, Calendar, CheckSquare, Star, BarChart, UserCheck, BookCopy, Activity, Smile, AlertTriangle, GraduationCap, Brain, CheckCircle, XCircle, Lock, Leaf, ChevronDown, Book, Atom, ChevronLeft, Clock, RotateCcw, X, Library, Gamepad2, FileText, BotMessageSquare, History, Building, UsersRound, TestTube, ScrollText, Medal, Rocket, Trophy, UserCheck as TeacherIcon, Sun, Moon, MoreHorizontal, MessageSquare as MessageIcon, MapPin, Badge, LineChart as LineChartIcon, Eye, GripVertical, Search, School, Users, Save, Filter } from 'lucide-react';
import { MOCK_ALUMNO_SUBJECTS, MOCK_ASSIGNED_EXAMS, UNIVERSITY_OPTIONS, AREA_TO_DIAGNOSIS_SUBJECT, MOCK_GROUP_RANKING, STATISTICS_DATA, RANKING_DATA, MOCK_EXAM_QUESTIONS, MOCK_SCHOOL_RANKING } from '../constants';
import { useToast } from '../components/Toast';

import { DIAG_QS_MATE, DIAG_QS_LENG } from '../data/diagnostic';
import type { Question } from '../data/diagnostic';
import ProgressMini from '../components/ProgressMini';
import TimerBar from '../components/TimerBar';
import QuestionCard from '../components/QuestionCard';
import ResultCard from '../components/ResultCard';
import * as diagSvc from '../services/diagnostic';
import AreaSelector from '../components/AreaSelector';
import ErrorBanner from '../components/ErrorBanner';
import Loader from '../components/Loader';
import MathMarkdown from '../components/MathMarkdown';

import { getStudentProgress } from '../services/progress';
import { track } from '../services/metrics';


import { MOCK_QS_MATE, MOCK_QS_LENG } from '../data/mockExam';
import type { MockQ } from '../data/mockExam';
import QuestionNav from '../components/QuestionNav';
import ReviewSheet from '../components/ReviewSheet';
import ResultSummary from '../components/ResultSummary';
import * as mockSvc from '../services/mockExam';

import * as gamSvc from '../services/gamification';
import GamAchievements from '../components/GamAchievements';
import GamRankingDemo from '../components/GamRankingDemo';
import type { GamificationState, FairUseState, StudentProfile, Nudge, Subject, DashboardInsights, UserPreferences, PracticeQuestion, PracticeResult, SkillRecord, Syllabus, SubTopic, ChatMessage, AgendaEvent, LearnState, PracticeState, ExitTicketState, Chunk, MainTopic, StudentSuggestion, InteractiveQuestion, ReviewMaterial, Reinforcement, MasteryAnalytics, ExamHistoryEntry, User } from '../types';
import type { Flashcard } from '../src/services/hooks/srs';
import MetaAchievementProgress from '../components/MetaAchievementProgress';
import FlowProgress from '../components/FlowProgress';
import FlowNotificationBanner from '../components/FlowNotificationBanner';

import * as fairUse from './../services/fairUse';
import * as preferences from '../services/preferences';
import type { StudyBlockTiming } from '../services/preferences';


import { COGNITIVE_GAMES } from '../services/cognitiveGames';
import type { CognitiveGame } from '../services/cognitiveGames';
import GameCard from '../components/games/GameCard';
import GymHub from '../components/cognitiveGym/GymHub';
import GymAreaDetail from '../components/cognitiveGym/GymAreaDetail';
import type { GymAreaId, GymActivity } from '../services/cognitiveGym';
import * as cognitiveGym from '../services/cognitiveGym';
import NBackGame from '../components/games/NBackGame';
import FocusSwitchGame from '../components/games/FocusSwitchGame';
import RSVPGame from '../components/games/RSVPGame';
import MemoryMatrixGame from '../components/games/MemoryMatrixGame';
import DigitSpanGame from '../components/games/DigitSpanGame';
import ReactionTimeGame from '../components/games/ReactionTimeGame';
import StroopEffectGame from '../components/games/StroopEffectGame';
import VisualSearchGame from '../components/games/VisualSearchGame';
import GameSummary from '../components/games/GameSummary';
import GameRanking from '../components/games/GameRanking';
import * as gameScores from '../services/gameScores';

import * as studentProfileSvc from '../services/studentProfile';
import * as studyTopicsSvc from '../services/studyTopics';
import { generateNudges } from '../services/nudges';
import PrepaDashboardEnhancements from '../components/dashboard/PrepaDashboardEnhancements';

import { useStudyTimer } from '../contexts/StudyTimerContext';
import Skeleton from '../components/ui/Skeleton';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

import * as dashboardAnalytics from '../services/dashboardAnalytics';
import * as aiAssistant from '../services/tutorCopilot';
import * as masteryAnalytics from '../services/masteryAnalytics';
import * as cognitiveAnalytics from '../services/cognitiveAnalytics';

import * as practiceSvc from '../services/practice';

import { startChat, sendMessage } from '../services/gemini';
import type { Chat } from '@google/genai';

import { ResponsiveContainer, BarChart as RechartsBarChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import * as agendaSvc from '../services/agenda';
import * as srsService from '../services/srs';

import TutorLayout from '../components/tutor/TutorLayout';
import TutorStepper from '../components/tutor/flow/TutorStepper';
import ExitTicket from '../components/tutor/ExitTicket';
import SessionSummary from '../components/tutor/flow/SessionSummary';
import TutorInsightsPanel from '../components/tutor/TutorInsightsPanel';
import * as tutorModes from '../services/tutorModes';
import DiscreteCitations from '../components/tutor/DiscreteCitations';
import SyllabusSidebar from '../components/tutor/SyllabusSidebar';
import { useTheme } from '../hooks/useTheme';
import TutorSession from '../src/components/tutor/TutorSession';
import type { TopicInfo } from '../src/services/tutor/promptTemplates';
import { useSRSQueue, useSRSStats } from '../src/services/hooks/srs';
import FlashcardGrid from '../src/components/library/FlashcardGrid';
import SRSSession from '../src/components/library/SRSSession';


// --- LOCAL TUTOR COMPONENTS (to avoid creating new files) ---

const NewTopicSelector: React.FC<{ onStartSession: (topicInfo: TopicInfo) => void }> = ({ onStartSession }) => {
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [selection, setSelection] = useState<Partial<TopicInfo>>({});

  useEffect(() => {
    studyTopicsSvc.getSyllabus().then(setSyllabus);
  }, []);

  const handleSelect = (level: 'subject' | 'mainTopic' | 'subTopic', value: string) => {
    if (level === 'subject') {
      setSelection({ subject: value as Subject });
    } else if (level === 'mainTopic') {
      setSelection(prev => ({ ...prev, mainTopic: value }));
    } else if (level === 'subTopic') {
      setSelection(prev => ({ ...prev, subTopic: value }));
    }
  };

  const selectedSubject = selection.subject;
  const selectedMainTopic = selection.mainTopic;
  
  const mainTopics = selectedSubject && syllabus ? syllabus[selectedSubject] : [];
  const subTopics = mainTopics?.find(mt => mt.name === selectedMainTopic)?.subTopics || [];

  const isReady = selection.subject && selection.mainTopic && selection.subTopic;

  if (!syllabus) return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="max-w-4xl w-full p-8">
        <h2 className="text-2xl font-bold text-center text-text-primary mb-2">Iniciar Sesión de Tutoría Guiada</h2>
        <p className="text-sm text-center text-text-secondary mb-8">Elige un tema específico para comenzar tu lección paso a paso.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Subjects */}
          <div className="flex flex-col gap-2">
            {(Object.keys(syllabus) as Subject[]).map(subject => (
              <button key={subject} onClick={() => handleSelect('subject', subject)} className={`p-3 rounded-lg text-left font-semibold border-2 ${selectedSubject === subject ? 'border-primary bg-primary/10' : 'border-border bg-surface-2 hover:border-primary/50'}`}>
                {subject}
              </button>
            ))}
          </div>
          {/* Main Topics */}
          <div className="flex flex-col gap-2 bg-surface-2 p-2 rounded-lg border border-border">
            {selectedSubject && mainTopics.map(mainTopic => (
              <button key={mainTopic.name} onClick={() => handleSelect('mainTopic', mainTopic.name)} className={`p-3 rounded-md text-left text-sm ${selectedMainTopic === mainTopic.name ? 'bg-primary text-white' : 'hover:bg-surface-1'}`}>
                {mainTopic.name}
              </button>
            ))}
          </div>
          {/* Sub Topics */}
          <div className="flex flex-col gap-2 bg-surface-2 p-2 rounded-lg border border-border">
            {selectedMainTopic && subTopics.map(subTopic => (
              <button key={subTopic.id} onClick={() => handleSelect('subTopic', subTopic.name)} className={`p-3 rounded-md text-left text-sm ${selection.subTopic === subTopic.name ? 'bg-primary text-white' : 'hover:bg-surface-1'}`}>
                {subTopic.name}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <PrimaryButton onClick={() => onStartSession(selection as TopicInfo)} disabled={!isReady} className="min-w-[200px] justify-center">
            Comenzar Sesión <ArrowRight size={16} className="ml-2"/>
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
};


// --- END OF LOCAL COMPONENTS ---

const PageHeader: React.FC<{ title: string, subtitle?: string }> = ({ title, subtitle }) => (
    <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        {subtitle && <p className="text-text-secondary mt-1">{subtitle}</p>}
    </div>
);

// --- DASHBOARD COMPONENTS ---
const ProgressRing: React.FC<{ progress: number, size?: number }> = ({ progress, size = 120 }) => {
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
                <circle
                    className="text-muted/30"
                    strokeWidth={strokeWidth} stroke="currentColor" fill="transparent"
                    r={radius} cx={size/2} cy={size/2}
                />
                <circle
                    className="text-primary"
                    strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset}
                    strokeLinecap="round" stroke="currentColor" fill="transparent"
                    r={radius} cx={size/2} cy={size/2}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-text-primary text-2xl font-bold">
                {Math.round(progress)}%
            </div>
        </div>
    );
};

const ProgressOverviewCard: React.FC<{ data: DashboardInsights['progressOverview'] }> = ({ data }) => {
    const subjectColors = ['purple', 'blue', 'cyan', 'green', 'orange'] as const;
    
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            <Card className="overflow-hidden group" gradient="from-purple-500/10 to-blue-500/10">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="flex-shrink-0 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse" />
                        <ProgressRing progress={data.totalProgress} size={140} />
                    </div>
                    <div className="flex-grow w-full">
                        <h3 className="text-2xl font-black flex items-center gap-3 mb-6 text-text-primary">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
                                <Target size={24} className="text-white" />
                            </div>
                            Progreso del Plan
                        </h3>
                        <div className="space-y-5">
                            {data.subjects.filter(s => s.progress > 0).map((subject, idx) => (
                                <motion.div 
                                    key={subject.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group/item"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-text-primary text-base">{subject.name}</span>
                                        <span className="text-sm font-black text-primary px-3 py-1 bg-primary/10 rounded-full">
                                            {Math.round(subject.progress)}%
                                        </span>
                                    </div>
                                    <ProgressBar 
                                        progress={subject.progress} 
                                        color={subjectColors[idx % subjectColors.length]}
                                        showLabel={false}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

const KeyInsightsCard: React.FC<{ data: DashboardInsights['keyInsights']; userName: string; }> = ({ data, userName }) => (
    <Card className="p-6">
        <h2 className="text-3xl font-bold">¡Hola de nuevo, {userName.split(' ')[0]}!</h2>
        <p className="text-text-secondary mt-1">“Un viaje de mil millas comienza con un solo paso.”</p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-surface-2 p-3 rounded-lg"><p className="text-xl font-bold">{data.topicsCompleted}</p><p className="text-xs text-text-secondary">Temas Completados</p></div>
            <div className="bg-surface-2 p-3 rounded-lg"><p className="text-xl font-bold">{data.avgTopicScore}%</p><p className="text-xs text-text-secondary">Puntaje Promedio</p></div>
            <div className="bg-surface-2 p-3 rounded-lg"><p className="text-xl font-bold">{data.avgTopicTime}</p><p className="text-xs text-text-secondary">Tiempo por Tema</p></div>
            <div className="bg-surface-2 p-3 rounded-lg"><p className="text-xl font-bold">{data.bestDay}</p><p className="text-xs text-text-secondary">Mejor Día</p></div>
        </div>
        <div className="mt-4 p-4 bg-primary/10 rounded-lg text-center">
            <h4 className="font-semibold text-primary mb-1">Consejo de tu Tutor IA</h4>
            <p className="text-sm text-text-secondary">{data.personalizedTip}</p>
        </div>
    </Card>
);

// FIX: Changed component to use `props.onStart` instead of destructuring to avoid linter error.
const SRSWidget: React.FC<{ onStart: () => void }> = (props) => {
    const { user } = useAuth();
    const { data: stats, isLoading } = useSRSStats(user!.id);

    if (isLoading || !stats) {
        return <Card><Skeleton className="h-24 w-full" /></Card>;
    }

    const maxReviews = Math.max(...stats.weekReviews, 1);

    return (
        <Card className="flex flex-col">
            <h3 className="text-md font-semibold text-text-primary mb-3 flex items-center gap-2">
                <History size={18} className="text-accent-a" /> Racha de Repaso
            </h3>
            <div className="flex justify-around items-center text-center my-2">
                <div>
                    <p className="text-3xl font-bold">{stats.streak}</p>
                    <p className="text-xs text-text-secondary">Días de Racha</p>
                </div>
                 <div>
                    <p className="text-3xl font-bold text-info">{stats.totalDue}</p>
                    <p className="text-xs text-text-secondary">Tarjetas Hoy</p>
                </div>
            </div>
            <div className="flex justify-between items-end h-8 gap-1 mt-2" aria-label="Actividad de repaso semanal">
                {stats.weekReviews.map((count, i) => (
                    <div key={i} className="flex-1 bg-surface-2 rounded-t-sm" style={{ height: `${Math.max((count / maxReviews) * 100, 10)}%` }} title={`Día ${i+1}: ${count} repasos`}/>
                ))}
            </div>
             {stats.totalDue > 0 && (
                <PrimaryButton onClick={props.onStart} className="w-full mt-4">
                    Comenzar Repaso
                </PrimaryButton>
            )}
        </Card>
    );
};


// --- MAIN DASHBOARD PAGE ---
export const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [insights, setInsights] = useState<DashboardInsights | null>(null);
    const [loading, setLoading] = useState(true);
    const [showSRSSession, setShowSRSSession] = useState(false);

    useEffect(() => {
        const fetchInsights = async () => {
            if (user) {
                setLoading(true);
                const data = await dashboardAnalytics.getDashboardInsights(user.id);
                setInsights(data);
                setLoading(false);
            }
        };
        fetchInsights();
    }, [user]);

    if (loading || !user) {
        return (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6"><Skeleton className="h-20 w-3/4"/><div className="flex gap-4 mt-4"><Skeleton className="h-16 flex-1"/><Skeleton className="h-16 flex-1"/><Skeleton className="h-16 flex-1"/></div></Card>
                    <Card className="p-6 flex gap-6"><Skeleton className="w-32 h-32 rounded-full"/><div className="flex-1 space-y-4"><Skeleton className="h-6 w-1/2"/><Skeleton className="h-8 w-full"/><Skeleton className="h-8 w-full"/></div></Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Card><Skeleton className="h-24 w-full" /></Card>
                    <Card className="p-4"><Skeleton className="h-6 w-2/3 mb-4"/><Skeleton className="h-10 w-full mb-2"/><Skeleton className="h-10 w-full"/></Card>
                </div>
            </div>
        );
    }
    
    if (!insights) return <ErrorBanner message="No se pudieron cargar los datos del dashboard."/>;

    // Determinar si mostrar mejoras para preparatoria
    const isPreparatoria = user?.gradeLevel === 'preparatoria';

    return (
        <>
        {showSRSSession && <SRSSession onExit={() => setShowSRSSession(false)} />}
        <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
            {/* Notificaciones inteligentes */}
            <FlowNotificationBanner maxVisible={2} className="mb-6" />
            
            {/* Mejoras específicas para preparatoria */}
            {isPreparatoria && (
                <motion.div 
                    variants={{hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}
                    className="mb-6"
                >
                    <PrepaDashboardEnhancements userId={user.id} examDate={user.examDate} />
                </motion.div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div variants={{hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}} className="lg:col-span-2 space-y-6">
                    <KeyInsightsCard data={insights.keyInsights} userName={user.name} />
                    <FlowProgress />
                    <ProgressOverviewCard data={insights.progressOverview} />
                </motion.div>
                 <motion.div variants={{hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}} className="lg:col-span-1 space-y-6">
                    <SRSWidget onStart={() => setShowSRSSession(true)} />
                    <Card>
                        <h3 className="text-md font-semibold text-text-primary mb-3 flex items-center gap-2">
                            <Star size={18} className="text-accent-b" /> Misión Diaria
                        </h3>
                        {insights.dailyMission ? (
                            <div className="space-y-2">
                            {insights.dailyMission.tasks.map(task => (
                                <div key={task.id} className="flex items-center gap-3 p-2 bg-surface-2 rounded-lg">
                                    <task.icon size={18} className="text-primary"/>
                                    <p className="text-sm text-text-primary flex-grow">{task.description}</p>
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${task.isCompleted ? 'bg-success' : 'border-2 border-border'}`}>
                                        {task.isCompleted && <Check size={12} className="text-white"/>}
                                    </div>
                                </div>
                            ))}
                            </div>
                        ) : <p className="text-sm text-text-secondary">No hay misión hoy.</p>}
                    </Card>
                </motion.div>
            </div>
        </motion.div>
        </>
    );
};


export const SubjectsPage: React.FC = () => {
    const navigate = useNavigate();
    const [syllabus, setSyllabus] = useState<Syllabus | null>(null);

    useEffect(() => {
        studyTopicsSvc.getSyllabus().then(data => {
            setTimeout(() => setSyllabus(data), 500); // Simulate loading
        });
    }, []);

    const getSubjectProgress = (subject: Subject): number => {
        if (!syllabus) return 0;
        const mainTopics = syllabus[subject];
        if (!mainTopics || mainTopics.length === 0) return 0;
        const allSubTopics = mainTopics.flatMap(mt => mt.subTopics);
        if (allSubTopics.length === 0) return 0;
        const completed = allSubTopics.filter(st => st.status === 'completed').length;
        return (completed / allSubTopics.length) * 100;
    };

    if (!syllabus) {
        return (
             <div>
                <PageHeader title="Mis Materias" subtitle="Selecciona una materia para ver tu plan de estudio detallado." />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="p-6 space-y-4">
                            <Skeleton className="h-7 w-3/4 rounded-button" />
                            <Skeleton className="h-5 w-1/2 rounded-button" />
                            <Skeleton className="h-6 w-full rounded-button" />
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader title="Mis Materias" subtitle="Selecciona una materia para ver tu plan de estudio detallado." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Object.keys(syllabus) as Subject[]).filter(s => syllabus[s].length > 0).map(subject => (
                    <motion.div key={subject} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                        <Card className="p-6 cursor-pointer" onClick={() => navigate(`/app/materias/${subject}`)}>
                            <h2 className="text-xl font-bold">{subject}</h2>
                            <p className="text-text-secondary text-sm mt-2 h-10">
                                {syllabus[subject].length} bloques principales.
                            </p>
                            <div className="mt-4">
                                <div className="flex justify-between text-xs text-text-secondary mb-1">
                                    <span>Progreso</span>
                                    <span>{getSubjectProgress(subject).toFixed(0)}%</span>
                                </div>
                                <ProgressBar progress={getSubjectProgress(subject)} />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export const SyllabusPage: React.FC = () => {
    const { subjectName } = useParams<{ subjectName: Subject }>();
    const navigate = useNavigate();
    const [mainTopics, setMainTopics] = useState<MainTopic[]>([]);

    useEffect(() => {
        if (subjectName) {
            studyTopicsSvc.getTopicsForSubject(subjectName).then(setMainTopics);
        }
    }, [subjectName]);
    
    const handleStartTopic = (mainTopic: MainTopic) => {
        track('tutor_session_start_from_syllabus', { mainTopic: mainTopic.name });
        navigate('/app/chat', { state: { startWithTopic: { subject: subjectName, mainTopic: mainTopic.name } } });
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <SecondaryButton onClick={() => navigate('/app/materias')} className="p-2 h-10 w-10 !rounded-full"><ChevronLeft /></SecondaryButton>
                <div>
                    <h1 className="text-3xl font-bold">{subjectName}</h1>
                    <p className="text-text-secondary">Tu ruta de aprendizaje para esta materia.</p>
                </div>
            </div>

            <div className="space-y-8">
                {mainTopics.map((mainTopic, index) => {
                    const completed = mainTopic.subTopics.filter(st => st.status === 'completed').length;
                    const total = mainTopic.subTopics.length;
                    const progress = total > 0 ? (completed / total) * 100 : 0;
                    const isAvailable = mainTopic.subTopics.some(st => st.status === 'available');

                    return (
                        <Card key={mainTopic.name}>
                             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl font-bold text-primary bg-primary/10 w-12 h-12 flex items-center justify-center rounded-lg">{index + 1}</div>
                                        <div>
                                            <h2 className="text-xl font-bold">{mainTopic.name}</h2>
                                             <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
                                                <span>{completed}/{total} temas</span>
                                                <span className="w-1 h-1 bg-muted rounded-full"></span>
                                                <span>Progreso: {progress.toFixed(0)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <PrimaryButton onClick={() => handleStartTopic(mainTopic)} disabled={!isAvailable} className="w-full md:w-auto">
                                    {isAvailable ? 'Comenzar Bloque' : 'Bloque completado'}
                                    <ArrowRight size={16} className="ml-2"/>
                                </PrimaryButton>
                            </div>
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {mainTopic.subTopics.map(subTopic => {
                                    const statusClasses = {
                                        completed: 'bg-green-500/10 text-green-400 border-green-500/20',
                                        available: 'bg-primary/10 text-primary border-primary/20',
                                        locked: 'bg-surface-2/50 text-text-secondary border-border'
                                    };
                                    const Icon = {
                                        completed: CheckCircle,
                                        available: Book,
                                        locked: Lock
                                    }[subTopic.status];
                                    return (
                                        <div key={subTopic.id} className={`flex items-center gap-3 p-3 rounded-lg border text-sm ${statusClasses[subTopic.status]}`}>
                                            <Icon size={16} />
                                            <span className="font-medium">{subTopic.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export const LibraryPage: React.FC = () => {
    const { user } = useAuth();
    const { data: allCards = [], isLoading } = useSRSQueue(user!.id); // Using SRS queue as source of all cards for now
    
    const [subjectFilter, setSubjectFilter] = useState<string>('all');
    const [searchFilter, setSearchFilter] = useState('');
    const [showSRSSession, setShowSRSSession] = useState(false);

    const subjects = useMemo(() => ['all', ...Array.from(new Set(allCards.map(c => c.subjectId)))], [allCards]);

    const filteredCards = useMemo(() => {
        return allCards.filter(card => {
            const subjectMatch = subjectFilter === 'all' || card.subjectId === subjectFilter;
            const searchMatch = searchFilter === '' || card.front.toLowerCase().includes(searchFilter.toLowerCase()) || card.back.toLowerCase().includes(searchFilter.toLowerCase());
            return subjectMatch && searchMatch;
        });
    }, [allCards, subjectFilter, searchFilter]);

    return (
        <>
        {showSRSSession && <SRSSession subjectId={subjectFilter !== 'all' ? subjectFilter : undefined} onExit={() => setShowSRSSession(false)} />}
        <div className="h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <PageHeader title="Biblioteca de Flashcards" subtitle="Todos tus materiales de repaso en un solo lugar." />
                <PrimaryButton onClick={() => setShowSRSSession(true)} className="w-full md:w-auto">
                    <History size={16} className="mr-2"/> Iniciar Sesión de Repaso
                </PrimaryButton>
            </div>

            <Card className="flex-grow flex flex-col p-4">
                 <div className="flex flex-col md:flex-row gap-2 mb-4 p-2 bg-surface-2 border border-border rounded-lg">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary"/>
                        <input type="text" placeholder="Buscar en tarjetas..." value={searchFilter} onChange={e => setSearchFilter(e.target.value)} className="w-full bg-transparent pl-9 pr-3 py-1.5 focus:outline-none"/>
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-text-secondary ml-2"/>
                        <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} className="bg-transparent text-sm font-semibold p-1.5 rounded-md focus:outline-none">
                            {subjects.map(s => <option key={s} value={s}>{s === 'all' ? 'Todas las Materias' : s}</option>)}
                        </select>
                    </div>
                 </div>
                 <div className="flex-grow overflow-y-auto pr-2 -mr-2 no-scrollbar">
                    {isLoading ? <Loader2 className="animate-spin mx-auto mt-10"/> : <FlashcardGrid cards={filteredCards} />}
                 </div>
            </Card>
        </div>
        </>
    );
};

// FIX: Changed component to use `props.onStart` instead of destructuring to avoid linter error.
const TodaysReviewsCard: React.FC<{ onStart: () => void }> = (props) => {
    const { user } = useAuth();
    const { data: dueCards, isLoading } = useSRSQueue(user!.id);

    if (isLoading) return <Card><Skeleton className="h-20 w-full" /></Card>;
    if (!dueCards || dueCards.length === 0) return null;

    return (
        <Card className="mb-6 bg-gradient-to-r from-primary/20 to-surface-1 border-primary/50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-surface-1 rounded-full text-primary">
                        <History size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Repasos Diarios</h3>
                        <p className="text-sm text-text-secondary">Tienes {dueCards.length} tarjeta(s) para repasar y fortalecer tu memoria.</p>
                    </div>
                </div>
                <PrimaryButton onClick={props.onStart} className="w-full sm:w-auto">
                    Iniciar Sesión de Repaso
                </PrimaryButton>
            </div>
        </Card>
    );
};


const CalendarView: React.FC<{ events: AgendaEvent[], onEventClick: (event: AgendaEvent) => void }> = ({ events, onEventClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const ICONS: Record<AgendaEvent['icon'], React.ElementType> = {
        practice: BookCopy,
        review: History,
        simulacro: FileText,
        game: Gamepad2,
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    const calendarDays = Array.from({ length: firstDayOfMonth }, () => null).concat(
        Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );

    const eventsByDate = events.reduce((acc, event) => {
        const date = new Date(event.dateISO).getDate();
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
        return acc;
    }, {} as Record<number, AgendaEvent[]>);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + offset);
            return newDate;
        });
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <SecondaryButton onClick={() => changeMonth(-1)} className="p-2 h-10 w-10 !rounded-full"><ChevronLeft/></SecondaryButton>
                <h2 className="text-xl font-bold">
                    {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                </h2>
                <SecondaryButton onClick={() => changeMonth(1)} className="p-2 h-10 w-10 !rounded-full"><ArrowRight/></SecondaryButton>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-text-secondary mb-2">
                {weekDays.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => (
                    <div key={index} className={`relative pt-[100%] rounded-lg transition-colors ${day ? 'bg-surface-2' : 'bg-transparent'}`}>
                        {day && (
                            <div className="absolute inset-0 p-2 flex flex-col overflow-hidden">
                                <span className="font-semibold text-text-primary">{day}</span>
                                <div className="flex-grow overflow-y-auto no-scrollbar mt-1 space-y-1">
                                {eventsByDate[day]?.map(event => {
                                    const Icon = ICONS[event.icon];
                                    return (
                                        <div key={event.id} onClick={() => onEventClick(event)}
                                            className={`p-1 rounded text-left text-xs cursor-pointer ${event.completed ? 'bg-green-500/20 text-green-300' : 'bg-primary/20 text-primary'}`}>
                                           <Icon size={12} className="inline mr-1"/> {event.subTopic}
                                        </div>
                                    )
                                })}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};

export const AgendaPage: React.FC = () => {
    const [events, setEvents] = useState<AgendaEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'calendar'>('list');
    const [showSRSSession, setShowSRSSession] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadAgenda = async () => {
            setLoading(true);
            await srsService.updateAgendaWithDueReviews('user-123'); // Check for due reviews
            // Simulate fetch
            setTimeout(async () => {
                const agendaEvents = await agendaSvc.getAgenda();
                setEvents(agendaEvents);
                setLoading(false);
            }, 700);
        };
        loadAgenda();
    }, []);

    const handleToggleComplete = async (eventId: string) => {
        const event = events.find(e => e.id === eventId);
        if (event) {
            await agendaSvc.updateAgendaEvent(eventId, { completed: !event.completed });
            const updatedEvents = await agendaSvc.getAgenda();
            setEvents(updatedEvents);
        }
    };
    
    const handleStartEvent = async (event: AgendaEvent) => {
        track('agenda_event_start', { type: event.type, subTopic: event.subTopic });
        if(event.type === 'practice' || event.type === 'review') {
// FIX: Await the promise from findMainTopicForSubTopic before accessing its properties.
            const mainTopicInfo = await studyTopicsSvc.findMainTopicForSubTopic(event.subTopic);
            if (mainTopicInfo) {
                navigate('/app/chat', { state: { startWithTopic: { subject: event.subject, mainTopic: mainTopicInfo.mainTopic } } });
            }
        }
        if(event.type === 'simulacro') navigate('/app/simulacro');
        if(event.type === 'game') navigate('/app/juegos');
    }

    const groupedEvents = events.reduce((acc, event) => {
        const date = new Date(event.dateISO).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(event);
        return acc;
    }, {} as Record<string, AgendaEvent[]>);

    const ICONS: Record<AgendaEvent['icon'], React.ElementType> = {
        practice: BookCopy,
        review: History,
        simulacro: FileText,
        game: Gamepad2,
    };
    
    const ListView = () => (
         <div className="space-y-8">
            {Object.entries(groupedEvents).map(([date, dayEvents]) => (
                <div key={date}>
                    <h2 className="text-lg font-semibold capitalize mb-3">{date}</h2>
                    <div className="space-y-3">
                        {/* FIX: Add type assertion to dayEvents to resolve 'map' does not exist on 'unknown' error. */}
                        {(dayEvents as AgendaEvent[]).map(event => {
                            const Icon = ICONS[event.icon];
                            return (
                                <motion.div 
                                    key={event.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`p-4 rounded-lg flex items-center gap-4 transition-colors ${event.completed ? 'bg-surface-1/50' : 'bg-surface-1'}`}
                                >
                                    <button onClick={() => handleToggleComplete(event.id)} className="flex-shrink-0">
                                        {event.completed 
                                            ? <CheckSquare size={24} className="text-green-400"/>
                                            : <div className="w-6 h-6 rounded-md border-2 border-border"/>
                                        }
                                    </button>
                                    <div className="flex-grow">
                                        <p className={`font-semibold ${event.completed ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                                            {event.subTopic}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
                                            <Icon size={14} />
                                            <span className="capitalize">{event.type}</span>
                                            {event.strategy && <>•<span className="text-primary">{event.strategy}</span></>}
                                        </div>
                                    </div>
                                    {!event.completed && (
                                        <PrimaryButton onClick={() => handleStartEvent(event)} className="text-sm px-4 py-1.5">
                                            Comenzar
                                        </PrimaryButton>
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <>
        {showSRSSession && <SRSSession onExit={() => setShowSRSSession(false)} />}
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold">Mi Agenda</h1>
                    <p className="text-text-secondary mt-1">Tu plan de estudio diario para mantener el ritmo.</p>
                </div>
                 <div className="flex gap-1 p-1 bg-surface-2 rounded-button border border-border self-start">
                    <button onClick={() => setView('list')} className={`px-4 py-1.5 text-sm font-semibold rounded-button ${view === 'list' ? 'bg-primary text-white' : 'text-text-secondary'}`}>Lista</button>
                    <button onClick={() => setView('calendar')} className={`px-4 py-1.5 text-sm font-semibold rounded-button ${view === 'calendar' ? 'bg-primary text-white' : 'text-text-secondary'}`}>Calendario</button>
                </div>
            </div>
             {loading ? (
                <div className="space-y-3">
                    <Skeleton className="h-6 w-1/3 mb-3 rounded-button" />
                    {Array.from({ length: 3 }).map((_, i) => (
                         <Card key={i} className="p-4 flex items-center gap-4">
                            <Skeleton className="h-6 w-6 rounded-md" />
                            <div className="flex-grow space-y-2">
                                <Skeleton className="h-5 w-1/2 rounded-button" />
                                <Skeleton className="h-4 w-1/4 rounded-button" />
                            </div>
                            <Skeleton className="h-8 w-24 rounded-button" />
                        </Card>
                    ))}
                </div>
            ) : (
                <>
                <TodaysReviewsCard onStart={() => setShowSRSSession(true)} />
                {Object.keys(groupedEvents).length === 0 ? (
                 <Card className="text-center py-12">
                    <Calendar size={48} className="mx-auto text-muted mb-4"/>
                    <h3 className="text-xl font-bold">Tu agenda está despejada</h3>
                    <p className="text-text-secondary mt-2 mb-6">No tienes tareas programadas. ¡Es un buen momento para explorar un nuevo tema!</p>
                    <PrimaryButton onClick={() => navigate('/app/materias')}>
                        Explorar mis materias
                    </PrimaryButton>
                </Card>
                ) : (
                    view === 'list' 
                        ? <ListView /> 
                        : <CalendarView events={events} onEventClick={handleStartEvent} />
                )}
                </>
            )}
        </div>
        </>
    );
};

export const StatisticsPage: React.FC = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState<MasteryAnalytics | null>(null);
    const [history, setHistory] = useState<ExamHistoryEntry[]>([]);
    
    useEffect(() => {
        if (user) {
            setTimeout(async () => { // Simulate fetch
                setAnalytics(await masteryAnalytics.getAnalytics(user.id));
                setHistory(await masteryAnalytics.getExamHistory());
            }, 900);
        }
    }, [user]);

    if (!user) return null;
    
    if (!analytics) {
         return (
            <div>
                <PageHeader title="Mi Progreso" subtitle="Analiza tu dominio y evolución a lo largo del tiempo." />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card className="space-y-4">
                            <Skeleton className="h-6 w-1/2 rounded-button" />
                            <Skeleton className="h-72 w-full rounded-card" />
                        </Card>
                    </div>
                    <div>
                        <Card className="space-y-4">
                            <Skeleton className="h-6 w-3/4 rounded-button" />
                            <Skeleton className="h-10 w-full rounded-button" />
                            <Skeleton className="h-10 w-full rounded-button" />
                            <Skeleton className="h-10 w-full rounded-button" />
                        </Card>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                     <Card className="space-y-3"><Skeleton className="h-6 w-1/3 rounded-button"/><Skeleton className="h-8 w-full rounded-button"/><Skeleton className="h-8 w-full rounded-button"/></Card>
                     <Card className="space-y-3"><Skeleton className="h-6 w-1/3 rounded-button"/><Skeleton className="h-8 w-full rounded-button"/><Skeleton className="h-8 w-full rounded-button"/></Card>
                </div>
                <Card className="mt-6 space-y-3">
                    <Skeleton className="h-6 w-1/4 rounded-button"/>
                    <Skeleton className="h-10 w-full rounded-button"/>
                    <Skeleton className="h-10 w-full rounded-button"/>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <PageHeader title="Mi Progreso" subtitle="Analiza tu dominio y evolución a lo largo del tiempo." />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                     <Card>
                        <h3 className="font-semibold mb-4">Dominio General (Mastery Score)</h3>
                        <div className="h-72">
                             <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analytics.masteryOverTime} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                    <XAxis dataKey="date" stroke="var(--color-text-secondary)" tickFormatter={(d) => new Date(d).toLocaleDateString('es-ES', {day:'2-digit', month:'short'})} />
                                    <YAxis stroke="var(--color-text-secondary)" />
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--border)'}} />
                                    <Line type="monotone" dataKey="masteryScore" name="Dominio" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
                 <div>
                    <Card>
                        <h3 className="font-semibold mb-4">Dominio por Materia</h3>
                        <div className="space-y-4">
                            {analytics.masteryBySubject.map(s => (
                                <div key={s.subject}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium">{s.subject}</span>
                                        <span className="text-text-secondary">{s.mastery}%</span>
                                    </div>
                                    <ProgressBar progress={s.mastery} />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                 <Card>
                    <h3 className="font-semibold mb-4 flex items-center gap-2"><Star className="text-accent-b" /> Fortalezas</h3>
                    <ul className="space-y-2">
                        {analytics.strengths.map(s => (
                            <li key={s.name} className="flex justify-between p-2 bg-surface-2 rounded-md text-sm">
                                <span className="text-text-primary capitalize">{s.name}</span>
                                <span className="font-bold text-green-400">{s.mastery.toFixed(0)}%</span>
                            </li>
                        ))}
                    </ul>
                </Card>
                 <Card>
                    <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="text-info" /> Oportunidades</h3>
                     <ul className="space-y-2">
                        {analytics.opportunities.map(o => (
                            <li key={o.name} className="flex justify-between p-2 bg-surface-2 rounded-md text-sm">
                                <span className="text-text-primary capitalize">{o.name}</span>
                                <span className="font-bold text-yellow-400">{o.mastery.toFixed(0)}%</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>

             <Card className="mt-6">
                <h3 className="font-semibold mb-4">Historial de Evaluaciones</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-text-secondary uppercase">
                            <tr><th className="p-2">Fecha</th><th className="p-2">Nombre</th><th className="p-2">Materia</th><th className="p-2 text-right">Puntaje</th></tr>
                        </thead>
                        <tbody>
                            {history.map(h => (
                                <tr key={h.id} className="border-b border-border">
                                    <td className="p-2">{h.date}</td>
                                    <td className="p-2 font-medium">{h.name}</td>
                                    <td className="p-2"><Chip>{h.subject}</Chip></td>
                                    <td className="p-2 text-right font-bold">{h.score}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export const TutorPage: React.FC = () => {
    const [sessionTopic, setSessionTopic] = useState<TopicInfo | null>(null);

    const handleStartSession = (topicInfo: TopicInfo) => {
        track('tutor_session_start_guided', topicInfo);
        setSessionTopic(topicInfo);
    };

    const handleEndSession = () => {
        track('tutor_session_end_guided', { topic: sessionTopic });
        setSessionTopic(null);
    }

    return (
        <div className="h-full">
            <AnimatePresence mode="wait">
                {!sessionTopic ? (
                    <motion.div key="selector" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <NewTopicSelector onStartSession={handleStartSession} />
                    </motion.div>
                ) : (
                    <motion.div key="session" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                        <TutorSession topicInfo={sessionTopic} onEndSession={handleEndSession} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const GamesPage: React.FC = () => {
    const { user } = useAuth();
    const [view, setView] = useState<'hub' | 'area' | 'game'>('hub');
    const [selectedArea, setSelectedArea] = useState<GymAreaId | null>(null);
    const [activeActivity, setActiveActivity] = useState<GymActivity | null>(null);
    const [activeGame, setActiveGame] = useState<CognitiveGame | null>(null);
    const [gameResult, setGameResult] = useState<any>(null);
    const [rankingKey, setRankingKey] = useState(Date.now());

    // Inicializar perfil del gimnasio si es primera vez
    useEffect(() => {
        if (user) {
            cognitiveGym.getGymProfile(user.id);
        }
    }, [user]);

    const handleSelectArea = (areaId: GymAreaId) => {
        setSelectedArea(areaId);
        setView('area');
    };

    const handleBackToHub = () => {
        setSelectedArea(null);
        setView('hub');
    };

    const handleStartActivity = (activity: GymActivity) => {
        setActiveActivity(activity);
        
        // Mapear actividad del gimnasio a juego legacy si existe
        const legacyGameMap: Record<string, CognitiveGame['id']> = {
            'n-track': 'n-track',
            'focus-switch': 'focus-switch',
            'rsvp-gist': 'rsvp-gist',
            'memory-matrix': 'memory-matrix'
        };

        const legacyGameId = legacyGameMap[activity.id];
        if (legacyGameId) {
            const game = COGNITIVE_GAMES.find(g => g.id === legacyGameId);
            if (game) {
                setActiveGame(game);
                setView('game');
                track('gym_activity_start', { activityId: activity.id, areaId: activity.areaId });
            }
        } else {
            // Actividad no implementada aún
            alert(`La actividad "${activity.name}" estará disponible pronto! 🚀`);
        }
    };

    const handleGameEnd = (result: any) => {
        gamSvc.addXP(result.xpEarned);
        if (result.achievementsUnlocked?.length > 0) {
            result.achievementsUnlocked.forEach((achId: any) => gamSvc.award(achId));
        }

        // Completar actividad en el gimnasio
        if (user && activeActivity) {
            const gymResult = cognitiveGym.completeActivity(
                user.id,
                activeActivity.id,
                result.rawMetrics.score || result.xpEarned,
                activeActivity.duration
            );

            // Mostrar notificaciones de nivel/logros si hay
            if (gymResult.leveledUp) {
                alert(`🎉 ¡Subiste de nivel! Ahora eres nivel ${cognitiveGym.getGymProfile(user.id).stats.level}`);
            }
            if (gymResult.areaLeveledUp && selectedArea) {
                const area = cognitiveGym.getAreaWithProgress(user.id, selectedArea);
                alert(`🎯 ¡Subiste de nivel en ${area.name}! Ahora eres nivel ${area.level}`);
            }
            if (gymResult.newAchievements.length > 0) {
                alert(`🏆 ¡Desbloqueaste ${gymResult.newAchievements.length} nuevo(s) logro(s)!`);
            }
        }

        setGameResult(result);
        if (user) {
            gameScores.addScore(result.gameId, user.name, result.rawMetrics.score || result.xpEarned, result.rawMetrics);
        }
        setRankingKey(Date.now());
    };

    const handlePlayAgain = () => {
        if (activeActivity) {
            handleStartActivity(activeActivity);
        }
    };

    const handleExit = () => {
        setActiveGame(null);
        setActiveActivity(null);
        setGameResult(null);
        setView(selectedArea ? 'area' : 'hub');
    };

    const renderGame = () => {
        if (!activeGame) return null;
        const gradeLevel = user?.gradeLevel || 'preparatoria';
        switch (activeGame.id) {
            case 'n-track':
                return <NBackGame onGameEnd={handleGameEnd} gradeLevel={gradeLevel} />;
            case 'focus-switch':
                return <FocusSwitchGame onGameEnd={handleGameEnd} gradeLevel={gradeLevel} />;
            case 'rsvp-gist':
                return <RSVPGame onGameEnd={handleGameEnd} gradeLevel={gradeLevel} />;
            case 'memory-matrix':
                return <MemoryMatrixGame onGameEnd={handleGameEnd} gradeLevel={gradeLevel} />;
            case 'digit-span':
                return <DigitSpanGame onGameEnd={handleGameEnd} gradeLevel={gradeLevel} />;
            case 'reaction-time':
                return <ReactionTimeGame onGameEnd={handleGameEnd} gradeLevel={gradeLevel} />;
            case 'stroop-effect':
                return <StroopEffectGame onGameEnd={handleGameEnd} gradeLevel={gradeLevel} />;
            case 'visual-search':
                return <VisualSearchGame onGameEnd={handleGameEnd} gradeLevel={gradeLevel} />;
            default:
                return null;
        }
    };

    // Vista de juego activo
    if (view === 'game' && activeGame && !gameResult) {
        return renderGame();
    }
    
    // Vista de resultado
    if (gameResult) {
        return <GameSummary result={gameResult} onPlayAgain={handlePlayAgain} onExit={handleExit} />;
    }

    // Vista de área específica
    if (view === 'area' && selectedArea && user) {
        return (
            <GymAreaDetail 
                userId={user.id}
                areaId={selectedArea}
                onBack={handleBackToHub}
                onStartActivity={handleStartActivity}
            />
        );
    }

    // Vista del hub principal
    if (view === 'hub' && user) {
        const gradeLevel = user?.gradeLevel || 'preparatoria';
        return <GymHub userId={user.id} onSelectArea={handleSelectArea} gradeLevel={gradeLevel} />;
    }

    // Fallback
    return (
        <div>
            <PageHeader title="Gimnasio Cognitivo" subtitle="Ejercicios diseñados para potenciar tus habilidades de aprendizaje." />
            <Card className="p-12 text-center">
                <Brain className="w-16 h-16 mx-auto text-purple-500 mb-4 animate-pulse" />
                <p className="text-text-secondary">Cargando gimnasio...</p>
            </Card>
        </div>
    );
};
// FIX: Added placeholder components for pages that were imported in App.tsx but not exported.
export const OnboardingPage: React.FC = () => (
    <div>
        <PageHeader title="Bienvenida" subtitle="Completa los siguientes pasos para configurar tu cuenta." />
        <Card>
            <p>Contenido de Onboarding...</p>
        </Card>
    </div>
);

export const DiagnosisPage: React.FC = () => (
    <div>
        <PageHeader title="Diagnóstico" subtitle="Completa esta prueba para generar tu plan de estudio." />
        <Card>
            <p>Contenido de Diagnóstico...</p>
        </Card>
    </div>
);

export const GeneratingPlanPage: React.FC = () => (
    <div>
        <PageHeader title="Generando tu Plan" subtitle="Estamos creando tu ruta de aprendizaje personalizada..." />
        <Card>
            <p>Animación de carga...</p>
        </Card>
    </div>
);

export const PracticesPage: React.FC = () => (
    <div>
        <PageHeader title="Prácticas" subtitle="Ejercicios para reforzar tus conocimientos." />
        <Card>
            <p>Contenido de Prácticas...</p>
        </Card>
    </div>
);

export const SimulacroPage: React.FC = () => (
    <div>
        <PageHeader title="Simulacro de Examen" subtitle="Mide tu progreso con un examen completo." />
        <Card>
            <p>Contenido de Simulacro...</p>
        </Card>
    </div>
);

export const RankingPage: React.FC = () => {
    const { user } = useAuth();
    const [rankingType, setRankingType] = useState<'student' | 'group' | 'school'>('student');
    const tabs = [
        { id: 'student', label: 'General (Alumno)', icon: UserIcon },
        { id: 'group', label: 'Mi Grupo', icon: Users },
        { id: 'school', label: 'Inter-Escolar', icon: School },
    ];

    const renderRankingList = () => {
        switch (rankingType) {
            case 'student':
                return (
                    <ul className="space-y-2">
                        {RANKING_DATA.map((item, index) => (
                            <li key={item.name} className={`flex items-center gap-4 p-3 rounded-lg ${item.isCurrentUser ? 'bg-primary/20 border border-primary/50' : ''}`}>
                                <span className={`w-8 text-center font-bold text-lg ${item.isCurrentUser ? 'text-primary' : 'text-text-secondary'}`}>{item.rank}</span>
                                <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center font-bold">{item.name.charAt(0)}</div>
                                <span className="flex-grow font-medium truncate">{item.name}</span>
                                <span className="font-semibold text-sm text-primary">{item.xp.toLocaleString()} XP</span>
                            </li>
                        ))}
                    </ul>
                );
            case 'group':
                 return (
                    <ul className="space-y-2">
                        {MOCK_GROUP_RANKING.map((item, index) => (
                            <li key={item.id} className={`flex items-center gap-4 p-3 rounded-lg ${item.id === user?.groupId ? 'bg-primary/20 border border-primary/50' : ''}`}>
                                <span className={`w-8 text-center font-bold text-lg ${item.id === user?.groupId ? 'text-primary' : 'text-text-secondary'}`}>{index + 1}</span>
                                <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center font-bold">{item.name.charAt(0)}</div>
                                <div>
                                    <p className="font-medium truncate">{item.name}</p>
                                    <p className="text-xs text-text-secondary">{item.teacher}</p>
                                </div>
                                <span className="ml-auto font-semibold text-sm text-primary">{item.masteryScore.toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                );
            case 'school':
                 return (
                    <ul className="space-y-2">
                        {MOCK_SCHOOL_RANKING.map((item, index) => (
                            <li key={item.id} className={`flex items-center gap-4 p-3 rounded-lg ${item.id === user?.schoolId ? 'bg-primary/20 border border-primary/50' : ''}`}>
                                <span className={`w-8 text-center font-bold text-lg ${item.id === user?.schoolId ? 'text-primary' : 'text-text-secondary'}`}>{index + 1}</span>
                                 <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center font-bold">{item.name.charAt(0)}</div>
                                <span className="flex-grow font-medium truncate">{item.name}</span>
                                <span className="font-semibold text-sm text-primary">{item.masteryScore.toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <PageHeader title="Liga Escolar" subtitle="Compite y mide tu progreso en diferentes niveles." />
            <div className="flex gap-2 p-1 bg-surface-2 rounded-button border border-border self-start mb-6">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setRankingType(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-button transition-colors ${rankingType === tab.id ? 'bg-primary text-white' : 'text-text-secondary'}`}>
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>
            <Card>
                {renderRankingList()}
            </Card>
        </div>
    );
};


export const ConfigurationPage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { addToast } = useToast();
    const [prefs, setPrefs] = useState<Partial<UserPreferences & User>>({
        tokenSavingMode: user?.tokenSavingMode || false,
        career: user?.career || 'unam_area2',
        studyBlockTiming: '50/10'
    });

    useEffect(() => {
        const loadedPrefs = preferences.getPreferences();
        if(user) {
            setPrefs({
                tokenSavingMode: user.tokenSavingMode,
                career: user.career,
                studyBlockTiming: loadedPrefs.studyBlockTiming
            });
        }
    }, [user]);

    const handleSave = () => {
        if (!user) return;
        
        // Update user-specific settings
        updateUser({ 
            tokenSavingMode: prefs.tokenSavingMode,
            career: prefs.career
        });

        // Update general preferences
        preferences.savePreferences({
            studyBlockTiming: prefs.studyBlockTiming as StudyBlockTiming
        });

        addToast(
            <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400"/>
                <span>Configuración guardada con éxito.</span>
            </div>
        );
    };

    const allCareers = UNIVERSITY_OPTIONS.flatMap(uni => 
        uni.areas.map(area => ({ id: area.id, name: `${uni.name} - ${area.name}`}))
    );
    
    return (
        <div>
            <PageHeader title="Configuración" subtitle="Ajusta tu perfil y preferencias de estudio." />
            <div className="max-w-3xl mx-auto space-y-8">
                <Card>
                    <h3 className="text-xl font-bold mb-4">Perfil del Estudiante</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-text-secondary">Nombre</label>
                            <input type="text" value={user?.name || ''} disabled className="mt-1 block w-full bg-surface-2 border-border rounded-input opacity-70 cursor-not-allowed"/>
                        </div>
                         <div>
                            <label className="text-sm font-medium text-text-secondary">Email</label>
                            <input type="email" value={user?.email || ''} disabled className="mt-1 block w-full bg-surface-2 border-border rounded-input opacity-70 cursor-not-allowed"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-secondary">Objetivo Académico</label>
                             <select value={prefs.career} onChange={e => setPrefs({...prefs, career: e.target.value})} className="mt-1 block w-full bg-surface-1 border-border rounded-input shadow-sm focus:ring-primary focus:border-primary">
                                {allCareers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                </Card>

                 <Card>
                    <h3 className="text-xl font-bold mb-4">Preferencias de Estudio</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <ToggleSwitch 
                                label="Modo Ahorro de Tokens (respuestas más cortas del tutor)" 
                                checked={prefs.tokenSavingMode || false} 
                                onChange={() => setPrefs({...prefs, tokenSavingMode: !prefs.tokenSavingMode})}
                            />
                        </div>
                         <div>
                            <label className="text-sm font-medium text-text-secondary">Bloques de Estudio (Pomodoro)</label>
                            <div className="flex gap-2 p-1 bg-surface-2 rounded-button border border-border mt-2 w-min">
                                <button onClick={() => setPrefs({...prefs, studyBlockTiming: '50/10'})} className={`px-4 py-1.5 text-sm font-semibold rounded-button ${prefs.studyBlockTiming === '50/10' ? 'bg-primary text-white' : 'text-text-secondary'}`}>50/10</button>
                                <button onClick={() => setPrefs({...prefs, studyBlockTiming: '25/5'})} className={`px-4 py-1.5 text-sm font-semibold rounded-button ${prefs.studyBlockTiming === '25/5' ? 'bg-primary text-white' : 'text-text-secondary'}`}>25/5</button>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="text-right">
                    <PrimaryButton onClick={handleSave} className="flex items-center gap-2">
                        <Save size={16}/> Guardar Cambios
                    </PrimaryButton>
                </div>
            </div>
        </div>
    )
};

export const ExamPage: React.FC = () => {
    const { examId } = useParams<{ examId: string }>();
    const navigate = useNavigate();
    const { addToast } = useToast();
    
    const examData = examId ? MOCK_EXAM_QUESTIONS[examId] : null;

    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (examData) {
            setAnswers(new Array(examData.questions.length).fill(null));
        }
    }, [examData]);

    if (!examData) {
        return <PageHeader title="Examen no encontrado" subtitle="El ID del examen no es válido." />;
    }

    const handleSelectOption = (optionIndex: number) => {
        setAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[currentQ] = optionIndex;
            return newAnswers;
        });
    };

    const handleSubmit = () => {
        const correctAnswers = examData.questions.reduce((count, q, i) => {
            return answers[i] === q.correctIndex ? count + 1 : count;
        }, 0);
        const finalScore = (correctAnswers / examData.questions.length) * 100;
        setScore(finalScore);
        setIsFinished(true);
        addToast(
            <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400"/>
                <span>Examen enviado. Calificación: {finalScore.toFixed(0)}%</span>
            </div>
        );
        // In a real app, send results to backend
    };

    if (isFinished) {
        return (
            <div className="text-center">
                <PageHeader title={`Resultados de: ${examData.title}`} />
                <Card className="max-w-md mx-auto p-8">
                    <p className="text-text-secondary">Calificación Final</p>
                    <p className={`text-7xl font-bold my-4 ${score >= 70 ? 'text-success' : 'text-accent-b'}`}>
                        {score.toFixed(0)}%
                    </p>
                    <PrimaryButton onClick={() => navigate('/app/dashboard')} className="w-full mt-6">
                        Volver al Dashboard
                    </PrimaryButton>
                </Card>
            </div>
        );
    }
    
    const question = examData.questions[currentQ];

    return (
        <div>
            <PageHeader title={examData.title} subtitle={`Pregunta ${currentQ + 1} de ${examData.questions.length}`} />
            
            <ProgressBar progress={((currentQ + 1) / examData.questions.length) * 100} className="mb-6"/>

            <Card className="p-8">
                 <div className="prose prose-invert text-text-primary max-w-none text-lg mb-8">
                    <MathMarkdown content={question.text} />
                </div>
                 <div className="space-y-3">
                    {question.options.map((opt, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleSelectOption(i)}
                            className={`w-full text-left p-4 border-2 rounded-lg transition-colors flex items-center gap-4 ${answers[currentQ] === i ? 'border-primary bg-primary/10' : 'border-border bg-surface-2 hover:border-primary/50'}`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${answers[currentQ] === i ? 'border-primary bg-primary text-white' : 'border-border'}`}>
                                {answers[currentQ] === i && <Check size={14}/>}
                            </div>
                            <span>{opt}</span>
                        </button>
                    ))}
                </div>
            </Card>

            <div className="flex justify-between mt-6">
                <SecondaryButton onClick={() => setCurrentQ(q => q - 1)} disabled={currentQ === 0}>
                    Anterior
                </SecondaryButton>
                {currentQ < examData.questions.length - 1 ? (
                    <PrimaryButton onClick={() => setCurrentQ(q => q + 1)} disabled={answers[currentQ] === null}>
                        Siguiente
                    </PrimaryButton>
                ) : (
                    <PrimaryButton onClick={handleSubmit} disabled={answers.some(a => a === null)} className="bg-success hover:bg-green-600">
                        Finalizar Examen
                    </PrimaryButton>
                )}
            </div>
        </div>
    );
};