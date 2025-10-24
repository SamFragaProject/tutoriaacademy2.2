import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, PrimaryButton, SecondaryButton, Chip } from '../components/ui';
// FIX: Import BrainCircuit from lucide-react.
import { Users, FileText, Search, Upload, BarChart, Key, Mail, Send, Save, RefreshCw, AlertCircle, SlidersHorizontal, CheckCircle, Activity, Zap, ShieldAlert, BarChart3, LineChart as LineChartIcon, FileQuestion, BookCopy, Filter, ChevronsRight, UsersRound, BatteryMedium, BarChart2, Brain, X, BrainCircuit, PlusCircle, Loader2, LayoutGrid } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import * as metricsSvc from '../services/adminMetrics';
// FIX: Correctly import Document and Subject types from the types file.
import type { DashboardData, DateRange } from '../services/adminMetrics';
import type { Document as DocType, Subject, TutorCopilotReport, User } from '../types';
import * as adminUsersSvc from '../services/adminUsers';
import Loader from '../components/Loader';
import ErrorBanner from '../components/ErrorBanner';
import MetricsCard from '../components/admin/MetricsCard';
import ChartCard from '../components/admin/ChartCard';
import FilterBar from '../components/admin/FilterBar';
import Heatmap from '../components/admin/Heatmap';
import ControlPanelCard from '../components/admin/ControlPanelCard';
import * as emailSvc from '../services/adminEmail';
import type { EmailTemplate, TemplateId } from '../services/adminEmail';
import { EmailPreview, VariableReference } from '../components/admin/EmailComponents';
import { getConfig } from '../services/adminConfig';
import { useAuth } from '../hooks/useAuth';
import * as tutorSvc from '../services/tutors';
import type { TutorConfig, TutorId } from '../types';
import FunnelChart from '../components/admin/FunnelChart';
import * as docSvc from '../services/documents';
// --- BLOCK 8 IMPORTS ---
import * as tutorCopilot from '../services/tutorCopilot';
import MathMarkdown from '../components/MathMarkdown';
import UserManagement from '../components/admin/UserManagement';
import BulkImportUsers from '../components/admin/BulkImportUsers';

const AdminPageHeader: React.FC<{ title: string, subtitle: string }> = ({ title, subtitle }) => (
    <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        <p className="text-text-secondary mt-1">{subtitle}</p>
    </div>
);

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- NEW ADMIN HOME PAGE ---
export const AdminHomePage: React.FC = () => {
    // Mock data for the main dashboard overview.
    const kpis = useMemo(() => {
        const activeUsers = random(120, 150);
        const activeSchools = random(3, 5);
        const mrr = activeSchools * 15000;
        const cost = activeUsers * 1.50 + random(0, 50);
        return {
            dau: activeUsers,
            activeSchools,
            mrr,
            cost
        };
    }, []);

    return (
        <div>
            <AdminPageHeader title="Panel de Administrador" subtitle="Visión general del rendimiento y la actividad de la plataforma." />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricsCard title="Usuarios Activos Hoy (DAU)" value={kpis.dau} change="+12% vs ayer" />
                <MetricsCard title="Escuelas Activas" value={kpis.activeSchools} change="+1 esta semana" />
                <MetricsCard title="MRR Estimado (MXN)" value={`$${kpis.mrr.toLocaleString('es-MX')}`} />
                <MetricsCard title="Costo Estimado (Mes)" value={`$${kpis.cost.toLocaleString('es-MX')}`} change="Rentable" changeType="positive" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Paneles de Gestión</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ControlPanelCard 
                    icon={Users} 
                    title="Gestionar Usuarios" 
                    description="Busca, visualiza y administra las cuentas de todos los usuarios de la plataforma." 
                    link="/admin/usuarios" 
                    color="cyan" 
                />
                <ControlPanelCard 
                    icon={FileText} 
                    title="Gestionar Documentos" 
                    description="Sube y procesa las guías de estudio que alimentan la base de conocimiento de la IA." 
                    link="/admin/documentos" 
                    color="purple" 
                />
                <ControlPanelCard 
                    icon={SlidersHorizontal} 
                    title="Ajustar Tutores IA" 
                    description="Configura el comportamiento y tono de los diferentes tutores de IA." 
                    link="/admin/tutores" 
                    color="accent" 
                />
                <ControlPanelCard 
                    icon={BarChart3} 
                    title="Ver Métricas Detalladas" 
                    description="Analiza a fondo el uso de la plataforma, la retención y los costos operativos." 
                    link="/admin/metricas" 
                    color="cyan" 
                />
                 <ControlPanelCard 
                    icon={Mail} 
                    title="Editar Emails" 
                    description="Personaliza las plantillas de correo para bienvenida, reportes y más." 
                    link="/admin/emails" 
                    color="purple" 
                />
                  <ControlPanelCard 
                    icon={Key} 
                    title="Configurar APIs" 
                    description="Administra las claves de servicios externos como Gemini y Stripe." 
                    link="/admin/apis" 
                    color="accent" 
                />
            </div>
        </div>
    );
};


export const UsersPage: React.FC = () => {
    const [showBulkImport, setShowBulkImport] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleImportSuccess = () => {
        setRefreshKey(prev => prev + 1); // Force refresh of UserManagement
    };

    return (
        <div>
            <AdminPageHeader title="Gestión de Usuarios" subtitle="Busca, visualiza y gestiona los usuarios de la plataforma." />
            <UserManagement key={refreshKey} onBulkImport={() => setShowBulkImport(true)} />
            
            {showBulkImport && (
                <BulkImportUsers
                    onClose={() => setShowBulkImport(false)}
                    onSuccess={handleImportSuccess}
                />
            )}
        </div>
    );
};

const ProcessingModal: React.FC<{ doc: DocType | null, onClose: () => void }> = ({ doc, onClose }) => {
    const [step, setStep] = useState(0);
    const steps = [
        "Extrayendo texto del documento...", "Estructurando conceptos clave...", "Creando red semántica...", "Indexando en base de conocimiento...", "¡Base de conocimiento actualizada!"
    ];

    useEffect(() => {
        if (!doc) return;
        const interval = setInterval(() => {
            setStep(s => {
                if (s < steps.length - 1) return s + 1;
                clearInterval(interval);
                setTimeout(onClose, 1000);
                return s;
            });
        }, 800);
        return () => clearInterval(interval);
    }, [doc, onClose]);

    if (!doc) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <h3 className="text-xl font-bold text-text-primary mb-2">Procesando Conocimiento</h3>
                <p className="text-sm text-text-secondary mb-6">La IA está aprendiendo de <span className="font-semibold text-primary">{doc.title}</span>...</p>
                <ul className="space-y-3">
                    {steps.map((s, i) => (
                        <li key={i} className={`flex items-center gap-3 text-sm ${i > step ? 'text-muted opacity-60' : 'text-text-primary'}`}>
                            {i < step ? <CheckCircle size={18} className="text-green-400"/> : i === step ? <Loader2 size={18} className="animate-spin text-primary"/> : <div className="w-[18px] h-[18px] border-2 border-border rounded-full"/>}
                            <span>{s}</span>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

export const DocumentsPage: React.FC = () => {
    const [documents, setDocuments] = useState<DocType[]>([]);
    const [processingDoc, setProcessingDoc] = useState<DocType | null>(null);

    useEffect(() => {
        setDocuments(docSvc.getAllDocuments());
    }, []);

    const handleProcess = async (doc: DocType) => {
        setProcessingDoc(doc);
        // Optimistically update UI to 'procesando'
        setDocuments(docs => docs.map(d => d.id === doc.id ? { ...d, status: 'procesando' } : d));
        
        await docSvc.processDocument(doc.id);
        
        // Refresh from source of truth after processing is complete
        setDocuments(docSvc.getAllDocuments());
    };

    const statusMap = {
        en_cola: { text: 'En Cola', color: 'bg-yellow-500/20 text-yellow-300' },
        procesando: { text: 'Procesando', color: 'bg-blue-500/20 text-blue-300 animate-pulse' },
        indexado: { text: 'Indexado', color: 'bg-green-500/20 text-green-300' },
    };

    return (
        <div>
            {processingDoc && <ProcessingModal doc={processingDoc} onClose={() => setProcessingDoc(null)} />}
            <AdminPageHeader title="Gestión de Documentos" subtitle="Sube y procesa las guías de estudio para la base de conocimiento de la IA." />
            <Card>
                <div className="flex justify-end mb-4">
                    <PrimaryButton disabled>
                        <Upload className="inline mr-2 h-4 w-4" /> Subir Guía (Próximamente)
                    </PrimaryButton>
                </div>
                 <table className="w-full text-sm text-left text-text-secondary">
                    <thead className="text-xs text-text-primary uppercase bg-surface-2">
                        <tr>
                            <th className="px-6 py-3">Nombre del Archivo</th>
                            <th className="px-6 py-3">Materia</th>
                            <th className="px-6 py-3">Estado</th>
                            <th className="px-6 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map(doc => {
                            const status = statusMap[doc.status];
                            const canProcess = doc.status === 'en_cola';
                            return (
                                <tr key={doc.id} className="border-b border-border">
                                    <td className="px-6 py-4 text-text-primary">{doc.title}</td>
                                    <td className="px-6 py-4">{doc.subject}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                                            {status.text}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <SecondaryButton onClick={() => handleProcess(doc)} disabled={!canProcess} className="text-xs py-1 px-3">
                                            Procesar
                                        </SecondaryButton>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export const ApisPage: React.FC = () => (
    <div>
        <AdminPageHeader title="APIs y Claves" subtitle="Configura las claves de servicios externos." />
        <Card>
            <div className="space-y-6">
                <div>
                    <label className="text-lg font-semibold text-text-primary">Google Gemini API</label>
                    <p className="text-sm text-text-secondary mb-2">Clave para el modelo de lenguaje principal (Tutor, resúmenes, etc.)</p>
                    <input type="password" defaultValue="••••••••••••••••••••" className="w-full bg-surface-2 border-border rounded-input focus:ring-primary focus:border-primary" />
                </div>
                 <div>
                    <label className="text-lg font-semibold text-text-primary">Stripe API</label>
                    <p className="text-sm text-text-secondary mb-2">Clave para el procesamiento de pagos y suscripciones.</p>
                    <input type="password" defaultValue="••••••••••••••••••••" className="w-full bg-surface-2 border-border rounded-input focus:ring-primary focus:border-primary" />
                </div>
                 <div>
                    <label className="text-lg font-semibold text-text-primary">Servicio de Correo (e.g., SendGrid)</label>
                    <p className="text-sm text-text-secondary mb-2">Clave para el envío de correos transaccionales.</p>
                    <input type="password" defaultValue="••••••••••••••••••••" className="w-full bg-surface-2 border-border rounded-input focus:ring-primary focus:border-primary" />
                </div>
                 <div className="text-right">
                    <PrimaryButton>Guardar Cambios</PrimaryButton>
                </div>
            </div>
        </Card>
    </div>
);

export const MetricsPage: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<{ dateRange: DateRange }>({ dateRange: '7d' });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const dashboardData = await metricsSvc.getDashboardData(filters);
                setData(dashboardData);
            } catch (err) {
                setError('No se pudieron cargar las métricas. Intenta de nuevo más tarde.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [filters]);

    const handleFilterChange = (newFilters: { dateRange: DateRange }) => {
        setFilters(newFilters);
    };

    const costPerStudent = data && data.kpis.activeSubs > 0 ? (data.costs.totalCost / data.kpis.activeSubs) : 0;
    const isProfitable = costPerStudent > 0 && costPerStudent < 599;

    return (
        <div>
            <AdminPageHeader title="Métricas Detalladas" subtitle="Visión general del rendimiento, uso y costos de la plataforma." />
            <FilterBar onChange={handleFilterChange} />
            
            {loading ? <div className="mt-8"><Loader /></div> : null}
            {error ? <div className="mt-8"><ErrorBanner message={error} /></div> : null}

            {data && !loading && !error && (
                <div className="mt-8 space-y-12">
                    {/* KPIs Section */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><LineChartIcon size={20} className="text-primary"/>Métricas de Negocio y Crecimiento</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricsCard title="DAU / WAU" value={`${data.kpis.dau}/${data.kpis.wau}`} change={`${data.kpis.dauWauRatio}% ratio`} />
                            <MetricsCard title="Retención D1/D7" value={`${data.kpis.retentionD1}% / ${data.kpis.retentionD7}%`} />
                            <MetricsCard title="Suscriptores Activos" value={data.kpis.activeSubs.toLocaleString()} />
                            <MetricsCard title="MRR (Demo)" value={`$${data.revenue.mrr.toLocaleString()}`} change={`+${data.revenue.newSubs} subs`} />
                        </div>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Brain size={20} className="text-accent-a"/>Métricas Cognitivas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricsCard title="Sesiones de Juego" value={data.kpis.gamesPlayed.toLocaleString()} />
                            <MetricsCard title="Nivel N-Back Promedio" value={data.kpis.avgNBackLevel.toLocaleString()} />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Filter size={20} className="text-accent-b"/>Embudo de Conversión</h2>
                        <FunnelChart data={data.funnel}/>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><BarChart3 size={20} className="text-primary"/>Uso de la Plataforma</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <ChartCard title="Actividad por Módulo" className="lg:col-span-2">
                                <ResponsiveContainer width="100%" height={300}>
                                    <RechartsBarChart data={data.usage.dailyActivity}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                        <XAxis dataKey="name" stroke="var(--text-secondary)" />
                                        <YAxis stroke="var(--text-secondary)" />
                                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--border)' }} />
                                        <Legend />
                                        <Bar dataKey="tutor" name="Tutor" stackId="a" fill="var(--color-primary)" />
                                        <Bar dataKey="diag" name="Diagnóstico" stackId="a" fill="var(--color-accent-a)" />
                                        <Bar dataKey="sim" name="Simulacro" stackId="a" fill="var(--color-accent-b)" />
                                        <Bar dataKey="games" name="Juegos" stackId="a" fill="#46e0b5" />
                                    </RechartsBarChart>
                                </ResponsiveContainer>
                            </ChartCard>
                             <div className="space-y-4">
                               <MetricsCard title="Consultas al Tutor" value={data.usage.totalTutorQueries.toLocaleString()} />
                               <MetricsCard title="Simulacros Completados" value={data.usage.totalSimulacros.toLocaleString()} />
                               <MetricsCard title="Diagnósticos Completados" value={data.usage.totalDiagnosticos.toLocaleString()} />
                            </div>
                        </div>
                         <div className="mt-6">
                           <ChartCard title="Heatmap de Actividad (Hora vs. Día)">
                               <Heatmap data={data.usage.activityHeatmap} />
                           </ChartCard>
                        </div>
                    </section>
                    
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                             <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><FileQuestion size={20} className="text-green-400"/>Métricas de Aprendizaje</h2>
                             <div className="space-y-6">
                                <Card>
                                    <h3 className="text-lg font-semibold mb-2">Top Temas Débiles (Global)</h3>
                                    <ul className="space-y-2">
                                        {data.learning.weakTopics.map((topic, i) => (
                                            <li key={i} className="text-text-secondary flex justify-between p-2 bg-surface-2 rounded-md"><span>{i+1}. {topic.name}</span> <span className="font-semibold">{topic.count} apariciones</span></li>
                                        ))}
                                    </ul>
                                </Card>
                                <div className="grid grid-cols-2 gap-4">
                                    <MetricsCard title="Racha Media" value={`${data.learning.avgStreak.toFixed(1)} días`} />
                                    <MetricsCard title="XP Media" value={data.learning.avgXp.toLocaleString()} />
                                </div>
                            </div>
                        </div>
                         <div>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><BookCopy size={20} className="text-accent-b"/>Contenido y Salud del Sistema</h2>
                             <div className="space-y-6">
                                <Card>
                                    <h3 className="text-lg font-semibold mb-2">Estado del Contenido (RAG)</h3>
                                     <ul className="space-y-2">
                                        <li className="text-text-secondary flex justify-between p-2 bg-surface-2 rounded-md"><span>Documentos Indexados</span> <span className="font-semibold">2 / 3</span></li>
                                        <li className="text-text-secondary flex justify-between p-2 bg-surface-2 rounded-md"><span>Cobertura de Temas</span> <span className="font-semibold">85% (Estimado)</span></li>
                                         <li className="text-text-secondary flex justify-between p-2 bg-red-500/10 rounded-md text-red-300"><span>Hueco Detectado</span> <span className="font-semibold">Trigonometría</span></li>
                                    </ul>
                                </Card>
                                 <div className="grid grid-cols-2 gap-4">
                                    <MetricsCard title="Costo Total Est." value={`$${data.costs.totalCost.toFixed(2)}`} />
                                    <MetricsCard title="Costo / Alumno" value={`$${costPerStudent.toFixed(2)}`} change={isProfitable ? 'Rentable' : 'Pérdida'} changeType={isProfitable ? 'positive' : 'negative'} />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export const EmailsPage: React.FC = () => {
    const { user } = useAuth();
    const [templates, setTemplates] = useState<Record<TemplateId, EmailTemplate> | null>(null);
    const [activeId, setActiveId] = useState<TemplateId>('welcome');
    const [mockData, setMockData] = useState<Record<string, any> | null>(null);
    const [smtpConfigured, setSmtpConfigured] = useState(false);
    const [testRecipient, setTestRecipient] = useState(user?.email || '');
    const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [sendError, setSendError] = useState('');
    
    useEffect(() => {
        setTemplates(emailSvc.getTemplates());
        const config = getConfig();
        setSmtpConfigured(!!config.email.smtpHost && !!config.email.smtpUser);
    }, []);

    useEffect(() => {
        const fetchMockData = async () => {
            const data = await emailSvc.getMockDataForTemplate(activeId);
            setMockData(data);
        };
        fetchMockData();
    }, [activeId]);
    
    const activeTemplate = templates ? templates[activeId] : null;

    const compiledBody = useMemo(() => {
        if (!activeTemplate || !mockData) return '';
        return emailSvc.compileTemplate(activeTemplate, mockData);
    }, [activeTemplate, mockData]);
    
    const compiledSubject = useMemo(() => {
         if (!activeTemplate || !mockData) return '';
         return activeTemplate.subject.replace('{{nombre}}', mockData.nombre);
    }, [activeTemplate, mockData]);

    const handleTemplateChange = (id: TemplateId, field: 'subject' | 'preheader' | 'body', value: string) => {
        if (!templates) return;
        const updatedTemplates = {
            ...templates,
            [id]: { ...templates[id], [field]: value },
        };
        setTemplates(updatedTemplates);
    };

    const handleSave = () => {
        if (templates) {
            emailSvc.saveTemplates(templates);
            // In a real app, show a success toast.
        }
    };
    
    const handleRestore = () => {
        if (window.confirm('¿Restaurar todas las plantillas a sus valores por defecto? Perderás los cambios no guardados.')) {
            const restored = emailSvc.restoreDefaultTemplates();
            setTemplates(restored);
        }
    };

    const handleSendTest = async () => {
        if (!activeTemplate || !testRecipient) return;
        setSendStatus('sending');
        setSendError('');
        
        const result = await emailSvc.sendTestEmail({ subject: compiledSubject, body: compiledBody }, testRecipient);
        
        emailSvc.logSentEmail({
            templateId: activeId,
            recipient: testRecipient.replace(/.(?=.{4})/g, '*'), // Mask email
            status: result.success ? 'ok' : 'error',
            error: result.error,
        });
        
        if(result.success) {
            setSendStatus('success');
            setTimeout(() => setSendStatus('idle'), 3000);
        } else {
            setSendStatus('error');
            setSendError(result.error || 'Error desconocido');
        }
    };

    if (!templates || !activeTemplate) return <Loader />;

    return (
        <div>
            <AdminPageHeader title="Plantillas de Email" subtitle="Edita, previsualiza y prueba los correos automáticos." />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Editor Column */}
                <div className="space-y-6">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                             <div className="flex gap-2 p-1 bg-surface-2 rounded-button border border-border">
                                {/* FIX: Explicitly type 't' to resolve property access error on 'unknown'. */}
                                {Object.values(templates).map((t: EmailTemplate) => (
                                    <button key={t.id} onClick={() => setActiveId(t.id)} className={`px-4 py-1.5 text-sm font-semibold rounded-button transition-colors ${activeId === t.id ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface-1'}`}>
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <SecondaryButton onClick={handleRestore}><RefreshCw size={16}/></SecondaryButton>
                                <PrimaryButton onClick={handleSave}><Save size={16} className="mr-2"/> Guardar</PrimaryButton>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-text-secondary">Asunto</label>
                                <input type="text" value={activeTemplate.subject} onChange={e => handleTemplateChange(activeId, 'subject', e.target.value)} className="mt-1 block w-full bg-surface-1 border-border rounded-input shadow-sm focus:ring-primary focus:border-primary"/>
                            </div>
                             <div>
                                <label className="text-sm font-medium text-text-secondary">Preheader (texto de vista previa)</label>
                                <input type="text" value={activeTemplate.preheader} onChange={e => handleTemplateChange(activeId, 'preheader', e.target.value)} className="mt-1 block w-full bg-surface-1 border-border rounded-input shadow-sm focus:ring-primary focus:border-primary"/>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-text-secondary">Cuerpo (HTML)</label>
                                <textarea value={activeTemplate.body} onChange={e => handleTemplateChange(activeId, 'body', e.target.value)} rows={12} className="mt-1 block w-full bg-surface-1 border-border rounded-input shadow-sm focus:ring-primary focus:border-primary font-mono text-xs"></textarea>
                            </div>
                            <VariableReference templateId={activeId} />
                        </div>
                    </Card>
                </div>
                
                {/* Preview & Actions Column */}
                <div className="space-y-6">
                    <Card className="h-[500px] flex flex-col">
                         <h3 className="text-lg font-bold mb-4">Vista Previa</h3>
                         <div className="flex-grow">
                             <EmailPreview subject={compiledSubject} preheader={activeTemplate.preheader} bodyHtml={compiledBody} />
                         </div>
                    </Card>
                    <Card>
                         <h3 className="text-lg font-bold mb-4">Probar Envío</h3>
                         {!smtpConfigured && (
                             <div className="flex items-start gap-3 p-3 text-sm text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded-md mb-4">
                                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                                <div>La configuración de Email (SMTP) no está completa. El envío de pruebas está desactivado. Ve a <NavLink to="/admin/apis" className="font-bold underline">APIs y Claves</NavLink> para configurarlo.</div>
                            </div>
                         )}
                         <div className="flex flex-col sm:flex-row gap-2">
                             <input type="email" value={testRecipient} onChange={e => setTestRecipient(e.target.value)} placeholder="Email de destino" className="flex-grow bg-surface-1 border-border rounded-input shadow-sm focus:ring-primary focus:border-primary" disabled={!smtpConfigured}/>
                             <PrimaryButton onClick={handleSendTest} disabled={!smtpConfigured || sendStatus === 'sending' || !testRecipient} className="flex justify-center">
                                 {sendStatus === 'sending' ? 'Enviando...' : <><Send size={16} className="mr-2"/> Enviar Prueba</>}
                             </PrimaryButton>
                         </div>
                         {sendStatus === 'success' && <p className="text-sm text-green-400 mt-2">¡Email de prueba enviado con éxito!</p>}
                         {sendStatus === 'error' && <p className="text-sm text-red-400 mt-2">Error: {sendError}</p>}
                    </Card>
                </div>
            </div>
        </div>
    );
};

const RubricModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const rubricText = `**Rúbrica para Evaluación de 'Acto Administrativo'**

**1. Comprensión Conceptual (40%)**
- **Nivel 4 (Experto):** Define con precisión el acto administrativo, distingue sus elementos (sujeto, objeto, etc.) y explica su importancia en el derecho administrativo con ejemplos originales.
- **Nivel 3 (Avanzado):** Define correctamente el acto administrativo y la mayoría de sus elementos.
- **Nivel 2 (Intermedio):** Define el acto administrativo con algunas imprecisiones y confunde algunos elementos.
- **Nivel 1 (Básico):** La definición es vaga o incorrecta.

**2. Aplicación Práctica (40%)**
- **Nivel 4 (Experto):** Analiza un caso práctico, identifica correctamente el acto administrativo, evalúa su validez y propone consecuencias jurídicas.
... (y así sucesivamente)

**3. Claridad en la Argumentación (20%)**
...`;
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold">Borrador de Rúbrica Generado</h3>
                 <button onClick={onClose} className="p-1"><X size={20}/></button>
            </div>
            <textarea readOnly value={rubricText} rows={15} className="w-full bg-surface-2 border-border rounded-input text-sm font-mono p-2"/>
            <div className="text-right mt-4">
                <PrimaryButton onClick={onClose}>Copiar y Cerrar</PrimaryButton>
            </div>
        </Card>
      </div>
    );
};


const TutorConfigCard: React.FC<{ config: TutorConfig, onUpdate: (id: TutorId, newConfig: TutorConfig) => void, onGenerateRubric: () => void }> = ({ config, onUpdate, onGenerateRubric }) => {
    const handleSliderChange = (tech: keyof TutorConfig['techniques'], value: string) => {
        onUpdate(config.id, {
            ...config,
            techniques: {
                ...config.techniques,
                [tech]: parseInt(value, 10),
            },
        });
    };
    
    return (
        <Card>
            <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold mb-4">{config.name}</h3>
                <Chip color={config.subject === 'Matemáticas' ? 'default' : 'beta'}>{config.subject}</Chip>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="text-sm text-text-secondary">Tono del Tutor</label>
                    <input type="text" value={config.tone} onChange={e => onUpdate(config.id, {...config, tone: e.target.value})} className="mt-1 block w-full bg-surface-1 border-border rounded-input"/>
                </div>
                <div>
                    <label className="text-sm text-text-secondary">Peso de Técnica Socrática ({config.techniques.socratic}%)</label>
                    <input type="range" min="0" max="100" value={config.techniques.socratic} onChange={e => handleSliderChange('socratic', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"/>
                </div>
                 <div>
                    <label className="text-sm text-text-secondary">Peso de Pistas Graduales ({config.techniques.hints}%)</label>
                    <input type="range" min="0" max="100" value={config.techniques.hints} onChange={e => handleSliderChange('hints', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"/>
                </div>
                 <div>
                    <label className="text-sm text-text-secondary">Peso de Práctica Intercalada ({config.techniques.interleaving}%)</label>
                    <input type="range" min="0" max="100" value={config.techniques.interleaving} onChange={e => handleSliderChange('interleaving', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"/>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <SecondaryButton onClick={onGenerateRubric}>Generar Rúbrica</SecondaryButton>
                </div>
            </div>
        </Card>
    );
}

const CreateTutorModal: React.FC<{ onClose: () => void, onCreate: (newConfigs: Record<TutorId, TutorConfig>) => void }> = ({ onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [subject, setSubject] = useState<Subject | ''>('');
    const [loading, setLoading] = useState(false);
    const availableSubjects = docSvc.getAvailableKnowledgeBases();

    const handleSubmit = () => {
        if (!name || !subject) return;
        setLoading(true);
        const newConfigs = tutorSvc.createTutor(name, subject);
        onCreate(newConfigs);
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Crear Nuevo Tutor IA</h3>
                    <button onClick={onClose} className="p-1"><X size={20}/></button>
                </div>
                {availableSubjects.length === 0 ? (
                    <div className="text-center p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-lg">
                        <p className="font-semibold text-yellow-300">No hay bases de conocimiento listas.</p>
                        <p className="text-sm text-yellow-400/80 mt-1">
                            Ve a <NavLink to="/admin/documentos" className="underline">Gestión de Documentos</NavLink> y procesa al menos una guía para poder crear un tutor.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="tutorName" className="block text-sm font-medium text-text-secondary">Nombre del Tutor</label>
                            <input type="text" id="tutorName" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Tutor LegalBot" className="mt-1 block w-full bg-surface-1 border-border rounded-input shadow-sm focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-text-secondary">Base de Conocimiento (Materia)</label>
                            <select id="subject" value={subject} onChange={e => setSubject(e.target.value as Subject)} className="mt-1 block w-full bg-surface-1 border-border rounded-input shadow-sm focus:ring-primary focus:border-primary">
                                <option value="" disabled>Selecciona una materia...</option>
                                {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                            <PrimaryButton onClick={handleSubmit} disabled={!name || !subject || loading}>
                                {loading ? 'Creando...' : 'Crear Tutor'}
                            </PrimaryButton>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export const TutorsPage: React.FC = () => {
    const [configs, setConfigs] = useState<Record<TutorId, TutorConfig> | null>(null);
    const [loading, setLoading] = useState(true);
    const [showRubricModal, setShowRubricModal] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        setConfigs(tutorSvc.getAllTutorConfigs());
        setLoading(false);
    }, []);

    const handleUpdate = (id: TutorId, newConfig: TutorConfig) => {
        if (!configs) return;
        const newConfigs = { ...configs, [id]: newConfig };
        setConfigs(newConfigs);
    };

    const handleSave = () => {
        if(configs) {
            tutorSvc.saveAllTutorConfigs(configs);
            // Show toast notification in real app
            alert('Configuraciones guardadas');
        }
    };
    
    const handleCreation = (newConfigs: Record<TutorId, TutorConfig>) => {
        setConfigs(newConfigs);
    }

    if(loading || !configs) return <Loader />;

    return (
        <div>
            {showRubricModal && <RubricModal onClose={() => setShowRubricModal(false)} />}
            {isCreateModalOpen && <CreateTutorModal onClose={() => setCreateModalOpen(false)} onCreate={handleCreation} />}
            <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
                <div>
                     <h1 className="text-3xl md:text-4xl font-bold">Gestión de Tutores</h1>
                     <p className="text-text-secondary mt-1">Ajusta el comportamiento y las técnicas pedagógicas de cada tutor IA.</p>
                </div>
                <div className="flex gap-2">
                    <SecondaryButton onClick={() => setCreateModalOpen(true)}><PlusCircle size={16}/> Crear Tutor</SecondaryButton>
                    <PrimaryButton onClick={handleSave}><Save size={16} className="mr-2"/> Guardar Todo</PrimaryButton>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* FIX: Explicitly type 'config' to resolve property access error on 'unknown'. */}
                {Object.values(configs).map((config: TutorConfig) => (
                    <TutorConfigCard key={config.id} config={config} onUpdate={handleUpdate} onGenerateRubric={() => setShowRubricModal(true)} />
                ))}
            </div>
        </div>
    );
};