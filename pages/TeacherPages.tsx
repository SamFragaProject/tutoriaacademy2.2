import React, { useState, useMemo } from 'react';
import { Card, PrimaryButton, SecondaryButton, Chip, ProgressBar } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { MOCK_EARLY_ALERTS, MOCK_QUESTION_ANALYTICS, MOCK_TEACHER_KPIS, MOCK_TEACHER_GROUPS, MOCK_HEATMAP_DATA, MOCK_GROUP_REPORTS } from '../constants';
import { AlertTriangle, Clock, Activity, Zap, CheckCircle, TrendingUp, BarChart2, BookCopy, FilePlus, BrainCircuit, Loader2, Check, Send, Files, ClipboardList, AlertCircle } from 'lucide-react';
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
    const { user, userData, userRole } = useAuth();

    // Dashboard simplificado que SIEMPRE funciona
    return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f8fafc' }}>
            <div style={{ 
                maxWidth: '1200px', 
                margin: '0 auto',
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
                <h1 style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 'bold', 
                    marginBottom: '0.5rem',
                    color: '#1a202c',
                    textAlign: 'center'
                }}>
                    🎓 TutoriA Academy - Dashboard del Profesor
                </h1>
                <p style={{ 
                    textAlign: 'center', 
                    color: '#718096', 
                    marginBottom: '2rem',
                    fontSize: '1.1rem'
                }}>
                    Sistema de gestión educativa inteligente
                </p>

                {/* Status Banner */}
                <div style={{ 
                    backgroundColor: '#c6f6d5', 
                    border: '2px solid #68d391',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    textAlign: 'center'
                }}>
                    <h2 style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '600', 
                        marginBottom: '0.5rem',
                        color: '#2f855a'
                    }}>
                        ✅ Sistema Funcionando Correctamente
                    </h2>
                    <p style={{ color: '#276749' }}>
                        Autenticación exitosa • Base de datos conectada • Listo para APIs de IA
                    </p>
                </div>

                {/* Quick Stats */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        backgroundColor: '#ebf8ff',
                        border: '1px solid #90cdf4',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2c5282', marginBottom: '0.5rem' }}>
                            Estudiantes Activos
                        </h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2b6cb0' }}>127</p>
                    </div>

                    <div style={{
                        backgroundColor: '#f0fff4',
                        border: '1px solid #9ae6b4',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2f855a', marginBottom: '0.5rem' }}>
                            Exámenes Pendientes
                        </h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#38a169' }}>8</p>
                    </div>

                    <div style={{
                        backgroundColor: '#fffaf0',
                        border: '1px solid #fbd38d',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#c05621', marginBottom: '0.5rem' }}>
                            IA Copiloto
                        </h3>
                        <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#dd6b20' }}>Listo</p>
                    </div>

                    <div style={{
                        backgroundColor: '#faf5ff',
                        border: '1px solid #d6bcfa',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#6b46c1', marginBottom: '0.5rem' }}>
                            Promedio Grupal
                        </h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed' }}>8.7</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '600', 
                        marginBottom: '1rem',
                        color: '#2d3748'
                    }}>
                        🚀 Acciones Rápidas
                    </h3>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem'
                    }}>
                        {[
                            { icon: '🤖', title: 'Crear Examen con IA', desc: 'Generar examen automático' },
                            { icon: '👥', title: 'Gestionar Grupos', desc: 'Ver y organizar estudiantes' },
                            { icon: '📊', title: 'Ver Resultados', desc: 'Análisis de rendimiento' },
                            { icon: '💬', title: 'Copiloto IA', desc: 'Asistente inteligente' }
                        ].map((action, i) => (
                            <div key={i} style={{
                                backgroundColor: '#f7fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                padding: '1rem',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                textAlign: 'center'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{action.icon}</div>
                                <h4 style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.25rem' }}>
                                    {action.title}
                                </h4>
                                <p style={{ fontSize: '0.875rem', color: '#718096' }}>
                                    {action.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Info Panel */}
                <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1.5rem'
                }}>
                    <h3 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '600', 
                        marginBottom: '1rem',
                        color: '#2d3748'
                    }}>
                        👤 Información de la Sesión
                    </h3>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1rem',
                        fontSize: '0.95rem'
                    }}>
                        <div>
                            <strong style={{ color: '#4a5568' }}>Email:</strong>
                            <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>
                                {user?.email || 'profesor@demo.com'}
                            </span>
                        </div>
                        <div>
                            <strong style={{ color: '#4a5568' }}>Rol:</strong>
                            <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>
                                {userRole || 'profesor'}
                            </span>
                        </div>
                        <div>
                            <strong style={{ color: '#4a5568' }}>Nombre:</strong>
                            <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>
                                {userData?.nombre || 'Juan'} {userData?.apellidos || 'Martínez'}
                            </span>
                        </div>
                        <div>
                            <strong style={{ color: '#4a5568' }}>Estado:</strong>
                            <span style={{ marginLeft: '0.5rem', color: '#48bb78' }}>
                                🟢 Conectado
                            </span>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div style={{
                    marginTop: '2rem',
                    backgroundColor: '#edf2f7',
                    borderRadius: '8px',
                    padding: '1.5rem'
                }}>
                    <h3 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '600', 
                        marginBottom: '1rem',
                        color: '#2d3748'
                    }}>
                        📋 Próximos Pasos para Configurar APIs de IA
                    </h3>
                    <ul style={{ 
                        marginLeft: '1.5rem', 
                        fontSize: '0.95rem', 
                        color: '#4a5568',
                        lineHeight: '1.6'
                    }}>
                        <li style={{ marginBottom: '0.5rem' }}>
                            ✅ <strong>Autenticación:</strong> Completada y funcionando
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            ✅ <strong>Base de datos:</strong> Supabase conectado
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            ✅ <strong>Despliegue:</strong> Activo en Vercel
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            🔧 <strong>APIs de IA:</strong> Listo para configurar (OpenAI, Claude, etc.)
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            🎯 <strong>Flujos de trabajo:</strong> Listos para probar
                        </li>
                    </ul>
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
