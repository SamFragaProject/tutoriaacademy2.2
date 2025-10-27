import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Chip } from '../components/ui/chip';
import { PrimaryButton, SecondaryButton, ProgressBar } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { MOCK_EARLY_ALERTS, MOCK_QUESTION_ANALYTICS, MOCK_TEACHER_KPIS, MOCK_TEACHER_GROUPS, MOCK_HEATMAP_DATA, MOCK_GROUP_REPORTS } from '../constants';
import { AlertTriangle, Clock, Activity, Zap, CheckCircle, TrendingUp, BarChart2, BookCopy, FilePlus, BrainCircuit, Loader2, Check, Send, Files, ClipboardList, AlertCircle, Users, Calendar, BookOpen, FileText, MessageSquare, Award } from 'lucide-react';
import { BarChart as RBarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
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
import { ContentList } from '../components/teacher/ContentList';
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

    const transactions = [
        { title: 'Transferencia Grupo 3A', subtitle: 'Envió de calificaciones • 12:52', amount: -254.00 },
        { title: 'Devolución Alumno 2B', subtitle: 'Trabajo revisado • 12:30', amount: 42.14 },
        { title: 'Corrección Examen', subtitle: 'Ajuste manual • 06:51', amount: 50.00 },
        { title: 'Pago suscripción', subtitle: 'Tarjeta corporativa • 16:12', amount: -14.43 },
        { title: 'NETFLIX.COM', subtitle: 'Suscripción personal • 01:12', amount: -12.99 },
        { title: 'Transferencia 1C', subtitle: 'Envió de calificaciones • 12:52', amount: -254.00 },
    ];

    const balanceData = [
        { name: 'May', in: 2032, out: 3295 },
        { name: 'Jun', in: 1820, out: 3010 },
        { name: 'Jul', in: 2150, out: 2800 },
    ];

    const quickActions = [
        { label: 'Crear Examen', icon: FilePlus, variant: 'primary' as const },
        { label: 'Ver Grupos', icon: Users, variant: 'secondary' as const },
        { label: 'Calificaciones', icon: BarChart2, variant: 'success' as const },
        { label: 'Mensajes', icon: MessageSquare, variant: 'warning' as const },
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
            <div className="flex flex-wrap items-center gap-3 mb-8">
                {quickActions.map((action, i) => (
                    <Chip icon={action.icon} label={action.label} variant={action.variant} />
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
                {/* My Account / Transactions */}
                <div className="ne-col-8 ne-animate-in">
                    <div className="ne-card">
                        <div className="ne-card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="ne-card-title">Mi Cuenta</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="ne-btn-secondary"><Send size={16}/> Enviar</button>
                                <button className="ne-btn-secondary"><Files size={16}/> Adjuntar</button>
                                <button className="ne-btn-primary"><ClipboardList size={16}/> Revisar</button>
                            </div>
                        </div>
                        <div className="ne-card-body">
                            <div className="ne-list">
                                {transactions.map((t, i) => (
                                    <div key={i} className="ne-list-item">
                                        <div className="ne-list-icon">
                                            <CheckCircle size={18} />
                                        </div>
                                        <div className="ne-list-content">
                                            <div className="ne-list-title">{t.title}</div>
                                            <div className="ne-list-subtitle">{t.subtitle}</div>
                                        </div>
                                        <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontWeight: 700, color: t.amount >= 0 ? 'var(--ne-success)' : 'var(--ne-danger)' }}>
                                            {t.amount >= 0 ? `+ ${t.amount.toFixed(2)}` : `- ${Math.abs(t.amount).toFixed(2)}`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column Widgets */}
                <div className="ne-col-4 ne-animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Balance Widget with mini chart */}
                    <div className="ne-card">
                        <div className="ne-card-header">
                            <h3 className="ne-card-title">Balance</h3>
                        </div>
                        <div className="ne-card-body">
                            <div style={{ height: 160 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RBarChart data={balanceData} barCategoryGap={24}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: 12, fill: 'var(--ne-text-secondary)' }} />
                                        <Tooltip cursor={{ fill: 'rgba(111,91,255,0.08)' }} />
                                        <Bar dataKey="in" fill="#B9C3FF" radius={[8,8,8,8]} />
                                        <Bar dataKey="out" fill="#E7D8FF" radius={[8,8,8,8]} />
                                    </RBarChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 13 }}>
                                <span style={{ color: 'var(--ne-text-secondary)' }}>Incoming</span>
                                <span style={{ color: 'var(--ne-text)' }}>$ 2032.20</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                <span style={{ color: 'var(--ne-text-secondary)' }}>Outgoing</span>
                                <span style={{ color: 'var(--ne-text)' }}>$ 3295.03</span>
                            </div>
                        </div>
                    </div>

                    {/* My Cards */}
                    <div className="ne-card">
                        <div className="ne-card-header">
                            <h3 className="ne-card-title">Mi Tarjeta</h3>
                        </div>
                        <div className="ne-card-body">
                            <div style={{
                                borderRadius: 16,
                                padding: 20,
                                color: 'white',
                                background: 'linear-gradient(135deg, #6F5BFF 0%, #8B7BFF 60%)',
                                boxShadow: 'var(--ne-shadow-2)'
                            }}>
                                <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 24 }}>Credit Card</div>
                                <div style={{ fontSize: 18, letterSpacing: 4, fontWeight: 700, marginBottom: 8 }}>2221 0050 4680 2089</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, opacity: 0.9 }}>
                                    <span>{userData?.nombre || 'Usuario'}</span>
                                    <span>05/28</span>
                                </div>
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
    const [selectedGroupId, setSelectedGroupId] = useState<string>(MOCK_TEACHER_GROUPS[0]?.id || '');

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <PageHeader title="Resultados por Materia" subtitle="Mapa de calor y análisis de rendimiento." />

            <Card className="mb-6">
                <label className="block mb-2 text-sm font-bold text-text-primary">
                    Selecciona un Grupo
                </label>
                <select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-text-primary"
                >
                    {MOCK_TEACHER_GROUPS.map((group) => (
                        <option key={group.id} value={group.id}>
                            {group.name} - {group.subject}
                        </option>
                    ))}
                </select>
            </Card>

            {/* Heatmap */}
            <Card className="mb-6">
                <h2 className="text-2xl font-black text-text-primary mb-4">
                    Mapa de Calor - Rendimiento por Subtema
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border border-border px-4 py-2 text-left bg-background-secondary font-bold text-text-primary">
                                    Estudiante
                                </th>
                                {MOCK_HEATMAP_DATA.map((subtopic) => (
                                    <th
                                        key={subtopic.subtopic}
                                        className="border border-border px-4 py-2 text-center bg-background-secondary font-bold text-text-primary"
                                    >
                                        {subtopic.subtopic}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_HEATMAP_DATA[0]?.results.map((student) => (
                                <tr key={student.studentId}>
                                    <td className="border border-border px-4 py-2 font-semibold text-text-primary">
                                        {student.studentName}
                                    </td>
                                    {MOCK_HEATMAP_DATA.map((subtopic) => {
                                        const studentScore = subtopic.results.find(r => r.studentId === student.studentId)?.score || 0;
                                        let bgColor = 'bg-gray-100 dark:bg-gray-800';
                                        if (studentScore >= 90) bgColor = 'bg-green-500';
                                        else if (studentScore >= 75) bgColor = 'bg-blue-500';
                                        else if (studentScore >= 60) bgColor = 'bg-yellow-500';
                                        else bgColor = 'bg-red-500';

                                        return (
                                            <td
                                                key={subtopic.subtopic}
                                                className={`border border-border px-4 py-2 text-center ${bgColor} text-white font-bold`}
                                            >
                                                {studentScore}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    );
};

export const TutorCopilotPage: React.FC = () => {
    const { user, userData } = useAuth();
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
            teacherName: userData?.nombre || user.email || 'Profesor',
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
    const filtros = [
        { label: 'Pendientes', variant: 'primary' as const },
        { label: 'Revisadas', variant: 'secondary' as const },
        { label: 'Atención', variant: 'warning' as const },
        { label: 'Por Grupo', variant: 'default' as const },
    ];

    const pendientes = [
        { title: 'Examen Álgebra - Grupo 2B', subtitle: '15 sin calificar • hace 2h', status: 'Pendiente' },
        { title: 'Tarea Física - Grupo 1A', subtitle: '8 sin calificar • hace 5h', status: 'Pendiente' },
        { title: 'Quiz Historia - Grupo 3C', subtitle: 'Revisión parcial • hace 1d', status: 'En revisión' },
        { title: 'Proyecto Ciencias - 2A', subtitle: 'Completado • hace 3d', status: 'Revisado' },
    ];

    const notas = [
        { name: '5', count: 2 },
        { name: '6', count: 8 },
        { name: '7', count: 14 },
        { name: '8', count: 10 },
        { name: '9', count: 6 },
        { name: '10', count: 3 },
    ];

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ne-text)', letterSpacing: '-0.02em' }}>Calificaciones</h1>
                <p style={{ color: 'var(--ne-text-secondary)' }}>Gestiona pendientes, distribuciones y promedios por grupo</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6">
                {filtros.map((f, i) => (
                    <Chip label={f.label} variant={f.variant} />
                ))}
            </div>

            <div className="ne-grid">
                {/* Pendientes de calificar */}
                <div className="ne-col-8 ne-animate-in">
                    <div className="ne-card">
                        <div className="ne-card-header">
                            <h3 className="ne-card-title">Pendientes de Calificar</h3>
                        </div>
                        <div className="ne-card-body">
                            <div className="ne-list">
                                {pendientes.map((p, i) => (
                                    <div key={i} className="ne-list-item">
                                        <div className="ne-list-icon"/>
                                        <div className="ne-list-content">
                                            <div className="ne-list-title">{p.title}</div>
                                            <div className="ne-list-subtitle">{p.subtitle}</div>
                                        </div>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: p.status === 'Revisado' ? 'var(--ne-success)' : p.status === 'En revisión' ? 'var(--ne-warning)' : 'var(--ne-danger)' }}>
                                            {p.status}
                                        </span>
                                        <button className="ne-btn-secondary" style={{ marginLeft: 12 }}>Calificar</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Widgets derecha */}
                <div className="ne-col-4 ne-animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="ne-card">
                        <div className="ne-card-header">
                            <h3 className="ne-card-title">Distribución de Notas</h3>
                        </div>
                        <div className="ne-card-body">
                            <div style={{ height: 180 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RBarChart data={notas} barCategoryGap={18}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: 12, fill: 'var(--ne-text-secondary)' }} />
                                        <Tooltip cursor={{ fill: 'rgba(111,91,255,0.08)' }} />
                                        <Bar dataKey="count" fill="#B9C3FF" radius={[8,8,8,8]} />
                                    </RBarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="ne-card">
                        <div className="ne-card-header">
                            <h3 className="ne-card-title">Promedio por Grupo</h3>
                        </div>
                        <div className="ne-card-body">
                            <div className="ne-list">
                                {[{g:'1A',p:8.4},{g:'2B',p:8.1},{g:'3C',p:7.6}].map((r)=> (
                                    <div key={r.g} className="ne-list-item">
                                        <div className="ne-list-content">
                                            <div className="ne-list-title">Grupo {r.g}</div>
                                            <div className="ne-list-subtitle">Promedio actual</div>
                                        </div>
                                        <div style={{ fontWeight: 700, color: 'var(--ne-text)' }}>{r.p}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
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

/**
 * Página de Gestión de Contenido (CMS)
 */
export const ContentManagementPage: React.FC = () => {
    return <ContentList />;
};
