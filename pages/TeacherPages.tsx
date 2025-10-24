import React, { useState, useMemo, useEffect } from 'react';
import { Card, PrimaryButton, SecondaryButton, Chip, ProgressBar } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { MOCK_EARLY_ALERTS, MOCK_QUESTION_ANALYTICS, MOCK_TEACHER_KPIS, MOCK_TEACHER_GROUPS, MOCK_HEATMAP_DATA, MOCK_GROUP_REPORTS } from '../constants';
import { AlertTriangle, Clock, Activity, Zap, CheckCircle, TrendingUp, BarChart2, BookCopy, FilePlus, BrainCircuit, Loader2, Check, Send, Files, ClipboardList, AlertCircle, Users, Calendar, BookOpen, FileText, MessageSquare, Award } from 'lucide-react';
import { useToast } from '../components/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import type { SubtopicResult, TutorCopilotReport, StudentFocusReport } from '../types';
import * as tutorCopilot from '../services/tutorCopilot';
import MathMarkdown from '../components/MathMarkdown';
import { NavLink } from 'react-router-dom';
import ItemVirtualList from '../src/components/items/ItemVirtualList';
import ItemEditor from '../src/components/items/ItemEditor';
import ExamBlueprintEditor from '../src/components/exams/ExamBlueprintEditor';
import { useItems } from '../src/services/hooks/items';
import { useTopics, useExamBlueprints } from '../src/services/hooks/exams';
import type { Item, ExamBlueprint } from '../src/schemas/item';
import { ScreeningDashboard } from '../components/teacher/ScreeningDashboard';
import { GradingInterface } from '../components/teacher/GradingInterface';
import { EnhancedTeacherDashboard } from '../components/teacher/EnhancedTeacherDashboard';
import { EnhancedExamCreator } from '../components/teacher/EnhancedExamCreator';
import { ExamCreatorSimple } from '../components/teacher/ExamCreatorSimple';
import { EnhancedExamCreatorTest } from '../components/teacher/EnhancedExamCreatorTest';
import { TaskManager } from '../components/teacher/TaskManager';
import { CommunicationHub } from '../components/teacher/CommunicationHub';
import { SimpleTeacherDashboard } from './SimpleTeacherDashboard';
import '../styles/neo-glass.css';


const PageHeader: React.FC<{ title: string, subtitle: string }> = ({ title, subtitle }) => (
    <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">{title}</h1>
        <p className="text-text-secondary mt-1">{subtitle}</p>
    </div>
);

const KpiCard: React.FC<{ icon: React.ElementType; title: string; description: string; }> = ({ icon: Icon, title, description }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.3 }}
    >
        <Card className="p-6 border-2 hover:border-primary/50 transition-all bg-gradient-to-br from-purple-500/5 to-blue-500/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-4">
                <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg"
                >
                    <Icon size={24} className="text-white" />
                </motion.div>
                <div>
                    <p className="font-bold text-lg text-text-primary">{title}</p>
                    <p className="text-sm text-text-secondary">{description}</p>
                </div>
            </div>
        </Card>
    </motion.div>
);

const KpiProgressCard: React.FC<{ title: string; value: number; description: string }> = ({ title, value, description }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.3 }}
    >
        <Card className="p-6 border-2 hover:border-green-500/50 transition-all bg-gradient-to-br from-green-500/5 to-emerald-500/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
                <h3 className="font-bold text-lg text-text-primary mb-1">{title}</h3>
                <p className="text-sm text-text-secondary mb-3">{description}</p>
                <div className="flex items-center gap-3">
                    <ProgressBar progress={value} color="green" className="flex-grow" animated showLabel={false}/>
                    <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.3 }}
                        className="font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600"
                    >
                        {value.toFixed(0)}%
                    </motion.span>
                </div>
            </div>
        </Card>
    </motion.div>
);

export const TeacherDashboardPage: React.FC = () => {
    const { userData } = useAuth();
    
    useEffect(() => {
        document.body.classList.add('neo-enterprise');
        return () => document.body.classList.remove('neo-enterprise');
    }, []);

    const stats = [
        { label: 'Total Estudiantes', value: '156', change: '+12%', icon: Users, positive: true },
        { label: 'Grupos Activos', value: '8', change: '+2', icon: Users, positive: true },
        { label: 'Exámenes Pendientes', value: '4', change: 'Esta semana', icon: FileText, positive: false },
        { label: 'Promedio General', value: '8.4', change: '+0.3', icon: Award, positive: true },
    ];

    const recentActivities = [
        { title: 'Examen de Matemáticas 3A', subtitle: 'Calificaciones pendientes • Hace 2 horas', icon: FileText },
        { title: 'Grupo 2B - Tarea entregada', subtitle: '24 de 28 alumnos • Hace 5 horas', icon: CheckCircle },
        { title: 'Reunión con Padres', subtitle: 'Mañana 10:00 AM • Sala 3', icon: Calendar },
        { title: 'Nueva práctica asignada', subtitle: 'Grupo 1A • Álgebra Básica', icon: BookOpen },
    ];

    const quickActions = [
        { label: 'Crear Examen', icon: FilePlus, color: 'primary' },
        { label: 'Ver Grupos', icon: Users, color: 'secondary' },
        { label: 'Calificaciones', icon: BarChart2, color: 'success' },
        { label: 'Mensajes', icon: MessageSquare, color: 'warning' },
    ];

    return (
        <div>
            {/* Welcome Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--ne-text)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                    Bienvenido, {userData?.nombre || 'Profesor'} 👋
                </h1>
                <p style={{ fontSize: '15px', color: 'var(--ne-text-secondary)' }}>
                    Aquí está un resumen de tu actividad docente
                </p>
            </div>

            {/* Quick Actions Chips */}
            <div className="ne-chips ne-animate-in" style={{ marginBottom: '32px' }}>
                {quickActions.map((action, i) => (
                    <button key={i} className="ne-chip" style={{cursor:'pointer',border:'none'}}>
                        <div className="ne-chip-icon">
                            <action.icon size={20} />
                        </div>
                        <div className="ne-chip-content">
                            <div className="ne-chip-title">{action.label}</div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Stats Grid */}
            <div className="ne-grid" style={{ marginBottom: '32px' }}>
                {stats.map((stat, i) => (
                    <div key={i} className="ne-col-3 ne-animate-in">
                        <div className="ne-card">
                            <div className="ne-card-body">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '13px', color: 'var(--ne-text-secondary)', fontWeight: 500 }}>
                                        {stat.label}
                                    </span>
                                    <stat.icon size={20} style={{ color: 'var(--ne-primary)' }} />
                                </div>
                                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--ne-text)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                                    {stat.value}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: stat.positive ? 'var(--ne-success)' : 'var(--ne-text-secondary)' }}>
                                    {stat.positive && <TrendingUp size={14} />}
                                    {stat.change}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="ne-grid">
                {/* Recent Activity */}
                <div className="ne-col-8 ne-animate-in">
                    <div className="ne-card">
                        <div className="ne-card-header">
                            <h3 className="ne-card-title">Actividad Reciente</h3>
                            <button className="ne-btn-ghost ne-btn-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                                </svg>
                            </button>
                        </div>
                        <div className="ne-card-body">
                            <div className="ne-list">
                                {recentActivities.map((activity, i) => (
                                    <div key={i} className="ne-list-item">
                                        <div className="ne-list-icon">
                                            <activity.icon size={20} />
                                        </div>
                                        <div className="ne-list-content">
                                            <div className="ne-list-title">{activity.title}</div>
                                            <div className="ne-list-subtitle">{activity.subtitle}</div>
                                        </div>
                                        <button className="ne-btn-ghost ne-btn-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M9 18l6-6-6-6"/>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Info Sidebar */}
                <div className="ne-col-4 ne-animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Calendar Widget */}
                    <div className="ne-card">
                        <div className="ne-card-header">
                            <h3 className="ne-card-title">Esta Semana</h3>
                        </div>
                        <div className="ne-card-body">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '13px', color: 'var(--ne-text-secondary)', marginBottom: '4px' }}>Clases programadas</div>
                                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ne-text)' }}>18</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', color: 'var(--ne-text-secondary)', marginBottom: '4px' }}>Horas de clase</div>
                                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ne-text)' }}>24</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', color: 'var(--ne-text-secondary)', marginBottom: '4px' }}>Reuniones</div>
                                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ne-text)' }}>3</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="ne-card">
                        <div className="ne-card-header">
                            <h3 className="ne-card-title">Accesos Rápidos</h3>
                        </div>
                        <div className="ne-card-body">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <NavLink to="/docente/grupos" className="ne-btn-secondary" style={{ textDecoration: 'none', width: '100%' }}>
                                    <Users size={18} />
                                    Mis Grupos
                                </NavLink>
                                <NavLink to="/docente/examenes" className="ne-btn-secondary" style={{ textDecoration: 'none', width: '100%' }}>
                                    <FileText size={18} />
                                    Exámenes
                                </NavLink>
                                <NavLink to="/docente/calificaciones" className="ne-btn-secondary" style={{ textDecoration: 'none', width: '100%' }}>
                                    <BarChart2 size={18} />
                                    Calificaciones
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const GroupsPage: React.FC = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <PageHeader title="Mis Grupos" subtitle="Gestiona tus grupos y alumnos." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_TEACHER_GROUPS.map((group, index) => (
                <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                >
                    <Card className="border-2 hover:border-primary/50 transition-all bg-gradient-to-br from-purple-500/5 to-blue-500/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
                                    <BookCopy className="w-6 h-6 text-white" />
                                </div>
                                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                                    <span className="text-xs font-bold text-green-600 dark:text-green-400">
                                        {group.studentCount} alumnos
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-text-primary mb-1">{group.name}</h3>
                            <p className="text-text-secondary font-semibold">{group.subject}</p>
                            <div className="mt-4 pt-4 border-t border-border">
                                <SecondaryButton className="w-full">
                                    Ver Detalles
                                </SecondaryButton>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    </motion.div>
);

export const QuestionBankPage: React.FC = () => {
    const [selectedSubject, setSelectedSubject] = useState('Matemáticas');
    const { data: items = [], isLoading } = useItems(selectedSubject);
    const [selectedItem, setSelectedItem] = useState<Partial<Item> | null>(null);

    const handleSelectItem = (item: Item) => {
        setSelectedItem(item);
    };

    const handleAddNew = () => {
        setSelectedItem({}); // Empty object signifies a new item
    };

    const handleCancel = () => {
        setSelectedItem(null);
    };

    const handleSaved = (item: Item) => {
        // The list will refetch automatically via query invalidation
        setSelectedItem(item); // Keep the editor open with the saved item
    };

    return (
        <div className="h-[calc(100vh-150px)] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <PageHeader title="Banco de Preguntas" subtitle="Crea, edita y gestiona los ítems para tus evaluaciones." />
                <div className="flex gap-2">
                    <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="bg-surface-1 border-border rounded-input px-3 py-2 text-sm">
                        <option>Matemáticas</option>
                        <option>Lengua</option>
                        <option>Historia</option>
                    </select>
                    <PrimaryButton onClick={handleAddNew}>Nuevo Ítem</PrimaryButton>
                </div>
            </div>

            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-hidden">
                <Card className="md:col-span-1 h-full flex flex-col">
                    {isLoading ? <Loader2 className="animate-spin m-auto"/> : (
                        <ItemVirtualList 
                            items={items} 
                            onSelect={handleSelectItem}
                            selectedItemId={selectedItem?.id || null}
                        />
                    )}
                </Card>
                <div className="md:col-span-2 h-full overflow-hidden">
                    <AnimatePresence>
                        {selectedItem ? (
                             <motion.div key={selectedItem.id || 'new'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                                <ItemEditor 
                                    subjectId={selectedSubject}
                                    initialItem={selectedItem}
                                    onCancel={handleCancel}
                                    onSaved={handleSaved}
                                />
                            </motion.div>
                        ) : (
                            <Card className="h-full flex items-center justify-center text-center text-text-secondary">
                                <div>
                                    <ClipboardList size={40} className="mx-auto mb-2"/>
                                    <p>Selecciona un ítem para editarlo o crea uno nuevo.</p>
                                </div>
                            </Card>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

/**
 * Página de Gestión de Exámenes - Sistema Completo Activado
 * Componente completo EnhancedExamCreator - 5 pasos
 */
export const TeacherExamsPage: React.FC = () => {
    return <EnhancedExamCreator />;
    
    /* CÓDIGO ORIGINAL (restaurar después):
    try {
        return <EnhancedExamCreator />;
    } catch (error) {
        console.error('Error loading EnhancedExamCreator:', error);
        return (
            <div className="p-8">
                <PageHeader 
                    title="Gestión de Exámenes" 
                    subtitle="Sistema de creación de exámenes mejorado" 
                />
                <Card className="p-6">
                    <div className="text-center">
                        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-text-primary mb-2">
                            Error al cargar el creador de exámenes
                        </h3>
                        <p className="text-text-secondary mb-4">
                            Hubo un problema al cargar el sistema. Por favor, recarga la página.
                        </p>
                        <PrimaryButton onClick={() => window.location.reload()}>
                            Recargar Página
                        </PrimaryButton>
                    </div>
                </Card>
            </div>
        );
    }
    */
};

const Heatmap: React.FC<{ data: SubtopicResult[] }> = ({ data }) => {
    if (!data.length || !data[0].results) return null;
    const students = data[0].results.map(r => r.studentName);

    const getCellColor = (score: number) => {
        if (score >= 90) return 'bg-info/40';
        if (score >= 70) return 'bg-green-500/30';
        if (score >= 50) return 'bg-yellow-500/30';
        return 'bg-red-500/30';
    };

    return (
        <div className="overflow-x-auto no-scrollbar">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="sticky left-0 bg-background p-2 text-left text-sm font-semibold text-text-secondary border-b border-r border-border z-10">Alumno</th>
                        {data.map(item => (
                            <th key={item.subtopic} className="p-2 text-center text-sm font-semibold text-text-secondary border-b border-border min-w-[120px]">
                                {item.subtopic}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {students.map((studentName, studentIndex) => (
                        <tr key={studentName} className="hover:bg-surface-2/30">
                            <td className="sticky left-0 bg-background p-2 text-sm text-text-primary font-medium border-r border-border whitespace-nowrap z-10">{studentName}</td>
                            {data.map(item => {
                                const result = item.results[studentIndex];
                                if (!result) return <td key={`${item.subtopic}-${studentName}`}></td>;
                                return (
                                    <td key={`${item.subtopic}-${studentName}`} className={`p-2 border-t border-border text-center transition-colors ${getCellColor(result.score)}`}>
                                        <span className="font-bold text-text-primary">{result.score}%</span>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export const TeacherResultsPage: React.FC = () => {
    const { addToast } = useToast();
    const [selectedSubtopic, setSelectedSubtopic] = useState<SubtopicResult | null>(MOCK_HEATMAP_DATA[3]);

    const handleCreateReinforcement = (subtopic: string) => {
        addToast(
            <div className="flex items-center gap-2 bg-surface-1 p-3 rounded-lg border border-border">
                <Zap size={18} className="text-green-400" />
                <span className="font-semibold text-text-primary">Refuerzo para "{subtopic}" asignado.</span>
            </div>
        );
    };

    return (
        <div>
            <PageHeader title="Resultados y Analíticas" subtitle="Analiza el rendimiento de tus alumnos por subtema." />
            <Card>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-bold text-text-primary">Heatmap de Rendimiento</h2>
                    <select className="bg-surface-1 border border-border rounded-input px-3 py-1.5 text-sm w-full sm:w-auto">
                        {MOCK_TEACHER_GROUPS.map(g => <option key={g.id}>{g.name} ({g.subject})</option>)}
                    </select>
                </div>
                <Heatmap data={MOCK_HEATMAP_DATA} />
            </Card>
            
            <Card className="mt-6">
                 <h2 className="text-xl font-bold text-text-primary mb-4">Refuerzo 1-Clic</h2>
                 <p className="text-text-secondary text-sm mb-4">Selecciona un subtema con bajo rendimiento para asignar automáticamente un mini-quiz de refuerzo.</p>
                 <div className="flex flex-col sm:flex-row items-center gap-4">
                     <select 
                        onChange={(e) => setSelectedSubtopic(MOCK_HEATMAP_DATA.find(d => d.subtopic === e.target.value) || null)} 
                        value={selectedSubtopic?.subtopic || ''}
                        className="bg-surface-1 border border-border rounded-input px-3 py-2 text-sm w-full sm:w-auto flex-grow"
                     >
                        {MOCK_HEATMAP_DATA.map(d => <option key={d.subtopic} value={d.subtopic}>{d.subtopic}</option>)}
                     </select>
                     <PrimaryButton 
                        onClick={() => selectedSubtopic && handleCreateReinforcement(selectedSubtopic.subtopic)}
                        disabled={!selectedSubtopic || !MOCK_HEATMAP_DATA.some(d => d.subtopic === selectedSubtopic.subtopic)}
                        className="w-full sm:w-auto"
                     >
                        <Zap size={16} className="mr-2"/> Asignar Refuerzo
                    </PrimaryButton>
                 </div>
            </Card>
        </div>
    );
};

export const TutorCopilotPage: React.FC = () => {
    const { user } = useAuth();
    const [report, setReport] = useState<TutorCopilotReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(MOCK_TEACHER_GROUPS[0]?.id || '');
    const { addToast } = useToast();

    const generateReport = async () => {
        setIsLoading(true);
        setReport(null);
        const generatedReport = await tutorCopilot.generateTutorReport();
        setReport(generatedReport);
        setIsLoading(false);
    };
    
    const handleCopyRubric = () => {
        if (report?.rubricDraft) {
            navigator.clipboard.writeText(report.rubricDraft);
            addToast(
                <div className="flex items-center gap-2">
                    <Check size={16} /> Rúbrica copiada al portapapeles.
                </div>
            );
        }
    };
    
     const handleCreateReinforcement = (student: StudentFocusReport) => {
        if (!user) return;
        tutorCopilot.assignReinforcement({
            teacherName: user.name,
            studentId: student.studentId,
            subject: student.subject,
            mainTopic: student.mainTopic,
        });
        addToast(
            <div className="flex items-center gap-2">
                <Send size={16} /> Refuerzo para {student.studentName} asignado.
            </div>
        );
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <PageHeader title="Copiloto IA" subtitle="Obtén insights y herramientas generadas por IA para potenciar a tu grupo." />
            
            <Card className="mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-grow w-full">
                        <label className="text-sm font-medium text-text-secondary">Selecciona un Grupo</label>
                        <select 
                            value={selectedGroup} 
                            onChange={e => setSelectedGroup(e.target.value)}
                            className="mt-1 block w-full bg-surface-1 border-border rounded-input shadow-sm focus:ring-primary focus:border-primary"
                        >
                            {MOCK_TEACHER_GROUPS.map(g => <option key={g.id} value={g.id}>{g.name} ({g.subject})</option>)}
                        </select>
                    </div>
                    <PrimaryButton onClick={generateReport} disabled={isLoading || !selectedGroup} className="w-full sm:w-auto self-end">
                        {isLoading ? <Loader2 className="animate-spin mr-2"/> : <BrainCircuit className="mr-2" size={18}/>}
                        {isLoading ? 'Analizando...' : 'Generar Reporte de Grupo'}
                    </PrimaryButton>
                </div>
            </Card>

            <AnimatePresence>
                {isLoading && (
                    <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-10">
                        <Loader2 className="animate-spin text-primary mx-auto" size={48} />
                        <p className="mt-4 text-text-secondary">La IA está analizando los datos del grupo...</p>
                    </motion.div>
                )}

                {report && !isLoading && (
                    <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <h2 className="text-xl font-bold text-text-primary mb-4">Alumnos que Requieren Atención</h2>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                {report.studentFocus.map((student, index) => (
                                    <div key={index} className="p-4 bg-surface-2 rounded-lg border border-border">
                                        <h3 className="font-bold text-text-primary">{student.studentName}</h3>
                                        <p className="text-sm text-yellow-300 my-1">{student.performance}</p>
                                        <p className="text-xs text-text-secondary italic">Patrón detectado: {student.errorPattern}</p>
                                        <div className="mt-3 border-t border-border pt-2">
                                            <h4 className="text-xs font-semibold text-text-secondary mb-1">Sugerencias:</h4>
                                            <ul className="list-disc list-inside text-sm text-text-primary space-y-1">
                                                {student.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                                            </ul>
                                        </div>
                                        <div className="text-right mt-3">
                                            <SecondaryButton onClick={() => handleCreateReinforcement(student)} className="text-xs px-3 py-1.5">
                                                <Send size={14} className="mr-2" /> Crear Refuerzo
                                            </SecondaryButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <Card>
                             <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-text-primary">Sugerencia de Rúbrica</h2>
                                <PrimaryButton onClick={handleCopyRubric} className="text-xs px-3 py-1.5">Copiar</PrimaryButton>
                            </div>
                             <div className="p-4 bg-surface-2 rounded-lg border border-border max-h-[600px] overflow-y-auto">
                                <div className="prose prose-sm prose-invert max-w-none">
                                    <MathMarkdown content={report.rubricDraft} />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

/**
 * Página de Screening - Dashboard de detección de dificultades
 */
export const ScreeningPage: React.FC = () => {
    const { user } = useAuth();
    
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <PageHeader 
                title="Detección de Dificultades de Aprendizaje" 
                subtitle="Monitorea alertas de dislexia, discalculia y disgrafía en tus grupos" 
            />
            <ScreeningDashboard teacherId={user?.id || ''} />
        </motion.div>
    );
};

/**
 * Página de Calificaciones - Sistema completo de calificación
 */
export const GradingPage: React.FC = () => {
    return <GradingInterface />;
};

/**
 * Página de Creador de Exámenes con IA (Mejorado)
 */
export const AIExamCreatorPage: React.FC = () => {
    return <EnhancedExamCreator />;
};

/**
 * Página de Gestión de Tareas
 */
export const TaskManagerPage: React.FC = () => {
    return <TaskManager />;
};

/**
 * Página de Centro de Comunicación
 */
export const CommunicationHubPage: React.FC = () => {
    return <CommunicationHub />;
};
