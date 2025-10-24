import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, SecondaryButton, PrimaryButton, Chip } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { Download, UsersRound, TrendingUp, FileText, CheckSquare, Heart, Building, Users, BarChart, Banknote, UserPlus, Search, Star, AlertTriangle } from 'lucide-react';
import { MOCK_DIRECTOR_KPIS, MOCK_TEACHERS, MOCK_SCHOOL_SUBSCRIPTION, MOCK_GROUP_REPORTS, MOCK_TEACHER_GROUPS, MOCK_ACADEMIC_ANALYSIS_DATA, MOCK_SCHOOL_STUDENTS } from '../constants';
import { useToast } from '../components/Toast';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useTheme } from '../hooks/useTheme';

const PageHeader: React.FC<{ title: string, subtitle: string }> = ({ title, subtitle }) => (
    <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">{title}</h1>
        <p className="text-text-secondary mt-1">{subtitle}</p>
    </div>
);

const StatCard: React.FC<{
  icon: React.ElementType,
  title: string,
  value: string,
  trend?: string,
  linkTo?: string,
}> = ({ icon: Icon, title, value, trend, linkTo }) => {
    const content = (
        <div className="p-4 flex items-center gap-4">
             <div className="p-3 bg-surface-2 rounded-lg">
                <Icon className="h-6 w-6 text-info" />
            </div>
            <div>
                <p className="text-sm text-text-secondary">{title}</p>
                <p className="text-2xl font-bold text-text-primary">{value}</p>
                {trend && <p className="text-xs font-semibold text-green-400">{trend}</p>}
            </div>
        </div>
    );

    if (linkTo) {
        return (
            <NavLink to={linkTo}>
                <Card className="hover:border-primary/80 transition-colors">
                    {content}
                </Card>
            </NavLink>
        );
    }
    
    return <Card>{content}</Card>;
};


const RenewalCard: React.FC<{ value: number }> = ({ value }) => (
    <Card className="p-6 text-center bg-gradient-to-br from-primary/30 to-surface-1 shadow-card-hover">
        <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
        <p className="text-sm text-text-secondary font-semibold">INTENCIÓN DE RENOVACIÓN ANUAL</p>
        <p className="text-7xl font-bold text-text-primary my-2">{value}%</p>
        <div className="w-full bg-surface-2 rounded-full h-2.5 border border-border">
            <div className="bg-primary h-2 rounded-full" style={{ width: `${value}%` }}></div>
        </div>
        <p className="text-xs text-muted mt-2">Basado en uso, mejora y feedback</p>
    </Card>
);


export const DirectorDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { addToast } = useToast();

    const handleDownload = (reportName: string) => {
        addToast(
            <div className="flex items-center gap-2">
                <Download size={16} />
                <span>Generando reporte: {reportName}... (simulado)</span>
            </div>
        )
    };

    return (
        <div>
            <PageHeader title="Dashboard Directivo" subtitle={`Visión general de la implementación en ${user?.schoolName}.`} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <RenewalCard value={MOCK_DIRECTOR_KPIS.renewalIntent} />
                     <Card>
                        <h2 className="text-xl font-bold text-text-primary mb-4">Intervenciones Clave</h2>
                        <ul className="space-y-2 list-disc list-inside">
                          {MOCK_DIRECTOR_KPIS.interventions.map((item, index) => (
                              <li key={index} className="text-sm text-text-secondary">{item}</li>
                          ))}
                        </ul>
                    </Card>
                </div>

                 <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                       <StatCard 
                            icon={UsersRound}
                            title="Cobertura Semanal"
                            value={`${MOCK_DIRECTOR_KPIS.weeklyActiveCoverage.value}%`}
                            trend={MOCK_DIRECTOR_KPIS.weeklyActiveCoverage.trend}
                        />
                        <StatCard 
                            icon={TrendingUp}
                            title="Mejora en Aprendizaje"
                            value={`+${MOCK_DIRECTOR_KPIS.learningLift.value}%`}
                            trend={MOCK_DIRECTOR_KPIS.learningLift.trend}
                        />
                         <StatCard 
                            icon={BarChart}
                            title="Análisis Académico"
                            value="Ver Reportes"
                            trend="Rendimiento escolar detallado"
                            linkTo="/director/analisis"
                        />
                         <StatCard 
                            icon={Users}
                            title="Alumnos"
                            value={`${MOCK_SCHOOL_STUDENTS.length} en total`}
                            trend="Gestionar lista de alumnos"
                            linkTo="/director/alumnos"
                        />
                    </div>
                     <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-text-primary">Progreso Promedio por Grupo</h2>
                            <NavLink to="/director/analisis" className="text-sm font-semibold text-primary hover:underline">Ver más</NavLink>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart data={MOCK_GROUP_REPORTS}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                    <XAxis dataKey="groupName" stroke="var(--color-text-secondary)" />
                                    <YAxis stroke="var(--color-text-secondary)" unit="%" />
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--border)' }} />
                                    <Bar dataKey="avgProgress" name="Progreso Promedio" fill="var(--color-primary)" />
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export const SchoolManagementPage: React.FC = () => {
    const { user } = useAuth();
     const { addToast } = useToast();
    const handleSave = () => {
        addToast(
            <div className="flex items-center gap-2">
                <CheckSquare size={16} className="text-green-400"/>
                <span>Configuración guardada.</span>
            </div>
        )
    };

    return (
        <div>
            <PageHeader title="Gestión de Escuela" subtitle="Configura los detalles de tu institución." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-bold text-text-primary mb-4">Información General</h3>
                     <div className="space-y-4">
                         <div>
                            <label className="text-sm font-medium text-text-secondary">Nombre de la Escuela</label>
                            <input type="text" defaultValue={user?.schoolName} className="mt-1 block w-full bg-surface border-border rounded-input shadow-sm"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-secondary">Logo de la Escuela</label>
                            <div className="mt-1 flex items-center gap-4 p-2 bg-surface-1 border border-border rounded-input">
                                <Building size={32} className="text-info" />
                                <SecondaryButton className="text-xs">Subir Logo</SecondaryButton>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <h3 className="text-lg font-bold text-text-primary mb-4">Calendario Académico</h3>
                    <div className="space-y-4">
                         <div>
                            <label className="text-sm font-medium text-text-secondary">Inicio del Ciclo Escolar</label>
                            <input type="date" className="mt-1 block w-full bg-surface-1 border-border rounded-input shadow-sm"/>
                        </div>
                         <div>
                            <label className="text-sm font-medium text-text-secondary">Fin del Ciclo Escolar</label>
                            <input type="date" className="mt-1 block w-full bg-surface-1 border-border rounded-input shadow-sm"/>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="mt-6 text-right">
                <PrimaryButton onClick={handleSave}>Guardar Cambios</PrimaryButton>
            </div>
        </div>
    );
};

export const TeachersPage: React.FC = () => {
     const { addToast } = useToast();
    const handleInvite = () => {
        addToast(
            <div className="flex items-center gap-2">
                <UserPlus size={16}/>
                <span>Invitación enviada (simulado).</span>
            </div>
        )
    };
    return (
        <div>
            <PageHeader title="Gestión de Docentes" subtitle="Administra los perfiles de los profesores de tu escuela." />
            <Card>
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-text-primary">Lista de Docentes</h3>
                    <PrimaryButton onClick={handleInvite} className="text-sm"><UserPlus size={16} className="mr-2"/> Invitar Docente</PrimaryButton>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="text-xs text-text-primary uppercase bg-surface-2">
                            <tr>
                                <th className="px-6 py-3">Nombre</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Grupos Asignados</th>
                                <th className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_TEACHERS.map(teacher => (
                                <tr key={teacher.id} className="border-b border-border hover:bg-surface-2/50">
                                    <td className="px-6 py-4 text-text-primary font-medium">{teacher.name}</td>
                                    <td className="px-6 py-4">{teacher.email}</td>
                                    <td className="px-6 py-4">{teacher.groups.join(', ')}</td>
                                    <td className="px-6 py-4 text-right">
                                        <SecondaryButton className="text-xs py-1 px-3">Editar</SecondaryButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export const AcademicAnalysisPage: React.FC = () => {
    const { theme } = useTheme();
    const radarStrokeColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)';
    
    return (
        <div>
            <PageHeader title="Análisis Académico Institucional" subtitle="Explore el rendimiento agregado de materias, temas y docentes." />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <h3 className="text-lg font-bold text-text-primary mb-4">Dominio Promedio por Materia</h3>
                    <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={MOCK_ACADEMIC_ANALYSIS_DATA.subjectMastery}>
                                <PolarGrid stroke={radarStrokeColor} />
                                <PolarAngleAxis dataKey="subject" stroke={radarStrokeColor} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="none" />
                                <Radar name="Dominio" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.6} />
                                 <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                 <Card>
                    <h3 className="text-lg font-bold text-text-primary mb-4">Progreso Promedio por Docente</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={MOCK_ACADEMIC_ANALYSIS_DATA.teacherPerformance} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis type="number" domain={[0, 100]} stroke="var(--color-text-secondary)" unit="%" />
                                <YAxis type="category" dataKey="name" stroke="var(--color-text-secondary)" width={100} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }} cursor={{ fill: 'rgba(123, 97, 255, 0.1)' }}/>
                                <Bar dataKey="progress" name="Progreso Promedio" fill="var(--color-info)" />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card>
                    <h3 className="font-semibold mb-4 flex items-center gap-2"><Star className="text-accent-b" /> Puntos Fuertes de la Escuela</h3>
                    <ul className="space-y-2">
                        {MOCK_ACADEMIC_ANALYSIS_DATA.schoolStrengths.map(s => (
                            <li key={s.topic} className="flex justify-between p-2 bg-surface-2 rounded-md text-sm">
                                <span className="text-text-primary capitalize">{s.topic}</span>
                                <span className="font-bold text-green-400">{s.mastery.toFixed(0)}%</span>
                            </li>
                        ))}
                    </ul>
                </Card>
                 <Card>
                    <h3 className="font-semibold mb-4 flex items-center gap-2"><AlertTriangle className="text-yellow-400" /> Oportunidades de la Escuela</h3>
                     <ul className="space-y-2">
                        {MOCK_ACADEMIC_ANALYSIS_DATA.schoolOpportunities.map(o => (
                            <li key={o.topic} className="flex justify-between p-2 bg-surface-2 rounded-md text-sm">
                                <span className="text-text-primary capitalize">{o.topic}</span>
                                <span className="font-bold text-yellow-400">{o.mastery.toFixed(0)}%</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export const StudentsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [students] = useState(MOCK_SCHOOL_STUDENTS);

    const filteredStudents = useMemo(() => {
        return students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [students, searchTerm]);

    const getActivityChip = (activity: string) => {
        switch (activity) {
            case 'Alta': return <Chip color="beta">Alta</Chip>;
            case 'Media': return <Chip>Media</Chip>;
            case 'Baja': return <Chip color="default">Baja</Chip>;
            default: return <Chip>{activity}</Chip>;
        }
    };

    return (
        <div>
            <PageHeader title="Alumnos de la Escuela" subtitle="Busca y monitorea el progreso de todos los estudiantes." />
            <Card>
                 <div className="flex justify-between items-center mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar alumno..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-surface-2 border-border rounded-input pl-10 pr-4 py-2 focus:ring-primary focus:border-primary w-64"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="text-xs text-text-primary uppercase bg-surface-2">
                            <tr>
                                <th className="px-6 py-3">Nombre</th>
                                <th className="px-6 py-3">Grupo</th>
                                <th className="px-6 py-3">Dominio</th>
                                <th className="px-6 py-3">Progreso</th>
                                <th className="px-6 py-3">Actividad</th>
                                <th className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(student => (
                                <tr key={student.id} className="border-b border-border hover:bg-surface-2/50">
                                    <td className="px-6 py-4 text-text-primary font-medium">{student.name}</td>
                                    <td className="px-6 py-4">{student.group}</td>
                                    <td className="px-6 py-4 font-semibold text-primary">{student.masteryScore}</td>
                                    <td className="px-6 py-4">{student.progress}%</td>
                                    <td className="px-6 py-4">{getActivityChip(student.activity)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <SecondaryButton className="text-xs py-1 px-3">Ver Perfil</SecondaryButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};


export const SubscriptionPage: React.FC = () => {
    const sub = MOCK_SCHOOL_SUBSCRIPTION;
    const studentProgress = (sub.studentLicenses.used / sub.studentLicenses.total) * 100;
    const teacherProgress = (sub.teacherLicenses.used / sub.teacherLicenses.total) * 100;
    
    return (
        <div>
            <PageHeader title="Suscripción y Facturación" subtitle="Gestiona el plan y las licencias de tu escuela." />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-3">
                    <Card>
                        <h3 className="text-lg font-bold text-text-primary">Plan Actual</h3>
                        <p className="text-4xl font-bold text-info my-2">{sub.planName}</p>
                        <p className={`text-sm font-semibold capitalize ${sub.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                            Estado: {sub.status}
                        </p>
                        <p className="text-sm text-text-secondary mt-4">
                            Se renueva el: {new Date(sub.renewalDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                         <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
                            <PrimaryButton className="text-sm">Gestionar Facturación</PrimaryButton>
                            <SecondaryButton className="text-sm">Cambiar de Plan</SecondaryButton>
                        </div>
                    </Card>
                </div>
                 <div className="md:col-span-2">
                    <Card>
                        <h3 className="text-lg font-bold text-text-primary mb-4">Uso de Licencias</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm font-medium mb-1">
                                    <span className="text-text-primary">Alumnos</span>
                                    <span className="text-text-secondary">{sub.studentLicenses.used} / {sub.studentLicenses.total}</span>
                                </div>
                                <div className="w-full bg-surface-2 rounded-full h-2.5 border border-border">
                                    <div className="bg-info h-2 rounded-full" style={{ width: `${studentProgress}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm font-medium mb-1">
                                    <span className="text-text-primary">Docentes</span>
                                    <span className="text-text-secondary">{sub.teacherLicenses.used} / {sub.teacherLicenses.total}</span>
                                </div>
                                <div className="w-full bg-surface-2 rounded-full h-2.5 border border-border">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: `${teacherProgress}%` }}></div>
                                </div>
                            </div>
                            <PrimaryButton className="text-sm w-full mt-2">Añadir Licencias</PrimaryButton>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};