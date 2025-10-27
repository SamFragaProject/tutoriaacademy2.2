import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
    ArrowLeft, Users, BookOpen, ClipboardList, BarChart3, 
    Plus, Mail, Download, Award, TrendingUp, Calendar,
    CheckCircle2, XCircle, Clock, Loader2, AlertCircle
} from 'lucide-react';
import { Card } from '../components/ui';
import * as teacherService from '../services/teacher';

type TabType = 'estudiantes' | 'tareas' | 'examenes' | 'estadisticas';

export const GroupDetailPage: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('estudiantes');

    // Obtener datos del grupo desde Supabase
    const { data: group, isLoading: loadingGroup, error: errorGroup } = useQuery({
        queryKey: ['group', groupId],
        queryFn: () => teacherService.fetchGroupById(groupId || ''),
        enabled: !!groupId,
    });

    // Obtener estudiantes del grupo desde Supabase
    const { data: students = [], isLoading: loadingStudents, error: errorStudents } = useQuery({
        queryKey: ['group-students', groupId],
        queryFn: () => teacherService.fetchGroupStudents(groupId || ''),
        enabled: !!groupId,
    });

    const isLoading = loadingGroup || loadingStudents;
    const error = errorGroup || errorStudents;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <p className="text-text-secondary">Cargando grupo...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <AlertCircle className="w-16 h-16 text-red-500" />
                <h2 className="text-2xl font-bold text-text-primary">Error al cargar el grupo</h2>
                <p className="text-text-secondary">{(error as Error).message}</p>
                <p className="text-sm text-text-secondary mb-4">Asegúrate de haber ejecutado disable_rls_all_tables.sql en Supabase</p>
                <button
                    onClick={() => navigate('/docente/grupos')}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                >
                    Volver a Grupos
                </button>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <XCircle className="w-16 h-16 text-red-500" />
                <h2 className="text-2xl font-bold text-text-primary">Grupo no encontrado</h2>
                <button
                    onClick={() => navigate('/docente/grupos')}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                >
                    Volver a Grupos
                </button>
            </div>
        );
    }

    // Calcular estadísticas
    const avgPromedio = students.length > 0 
        ? students.reduce((acc, s) => acc + s.promedio, 0) / students.length 
        : 0;
    const avgAsistencia = students.length > 0 
        ? students.reduce((acc, s) => acc + s.asistencia, 0) / students.length 
        : 0;
    const totalXP = students.reduce((acc, s) => acc + s.xp, 0);

    const tabs = [
        { id: 'estudiantes' as TabType, label: 'Estudiantes', icon: Users, count: students.length },
        { id: 'tareas' as TabType, label: 'Tareas', icon: ClipboardList, count: 5 },
        { id: 'examenes' as TabType, label: 'Exámenes', icon: BookOpen, count: 3 },
        { id: 'estadisticas' as TabType, label: 'Estadísticas', icon: BarChart3, count: null },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Header con botón de regreso */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/docente/grupos')}
                    className="p-2 hover:bg-background-secondary rounded-lg transition"
                >
                    <ArrowLeft className="w-6 h-6 text-text-primary" />
                </button>
                <div className="flex-1">
                    <h1 className="text-3xl font-black text-text-primary">{group.nombre}</h1>
                    <p className="text-text-secondary">{group.materia} • {students.length} estudiantes</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Asignar Tarea
                    </button>
                    <button className="px-4 py-2 bg-background-secondary text-text-primary rounded-lg hover:bg-background-tertiary transition flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Mensaje Grupal
                    </button>
                </div>
            </div>

            {/* KPIs del grupo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <Users className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Estudiantes</p>
                            <p className="text-2xl font-bold text-text-primary">{students.length}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-500/10 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Promedio General</p>
                            <p className="text-2xl font-bold text-text-primary">{avgPromedio.toFixed(1)}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                            <CheckCircle2 className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Asistencia</p>
                            <p className="text-2xl font-bold text-text-primary">{avgAsistencia.toFixed(1)}%</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-500/10 rounded-lg">
                            <Award className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">XP Total</p>
                            <p className="text-2xl font-bold text-text-primary">{totalXP.toLocaleString()}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabs */}
            <Card className="p-0 overflow-hidden">
                <div className="flex border-b border-border">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition ${
                                    isActive
                                        ? 'bg-primary text-white font-bold'
                                        : 'text-text-secondary hover:bg-background-secondary'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{tab.label}</span>
                                {tab.count !== null && (
                                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                                        isActive ? 'bg-white/20' : 'bg-background-tertiary'
                                    }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Contenido de tabs */}
                <div className="p-6">
                    {activeTab === 'estudiantes' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-text-primary">
                                    Lista de Estudiantes ({students.length})
                                </h3>
                                <button className="px-4 py-2 bg-background-secondary text-text-primary rounded-lg hover:bg-background-tertiary transition flex items-center gap-2">
                                    <Download className="w-4 h-4" />
                                    Exportar CSV
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-3 px-4 text-sm font-bold text-text-primary">Estudiante</th>
                                            <th className="text-left py-3 px-4 text-sm font-bold text-text-primary">Email</th>
                                            <th className="text-center py-3 px-4 text-sm font-bold text-text-primary">Promedio</th>
                                            <th className="text-center py-3 px-4 text-sm font-bold text-text-primary">Asistencia</th>
                                            <th className="text-center py-3 px-4 text-sm font-bold text-text-primary">XP</th>
                                            <th className="text-center py-3 px-4 text-sm font-bold text-text-primary">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students
                                            .sort((a, b) => b.promedio - a.promedio)
                                            .map((student, index) => (
                                            <tr
                                                key={student.id}
                                                className="border-b border-border hover:bg-background-secondary transition"
                                            >
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                                            {student.nombre.charAt(0)}{student.apellido.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-text-primary flex items-center gap-2">
                                                                {student.nombre} {student.apellido}
                                                                {index < 3 && (
                                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                                                                        Top {index + 1}
                                                                    </span>
                                                                )}
                                                            </p>
                                                            <p className="text-xs text-text-secondary">ID: {student.id.substring(0, 8)}...</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-text-secondary">
                                                    {student.email}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                        student.promedio >= 90
                                                            ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                                                            : student.promedio >= 80
                                                            ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                                            : student.promedio >= 70
                                                            ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                                                            : 'bg-red-500/20 text-red-600 dark:text-red-400'
                                                    }`}>
                                                        {student.promedio}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-16 bg-background-tertiary rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full ${
                                                                    student.asistencia >= 95
                                                                        ? 'bg-green-500'
                                                                        : student.asistencia >= 85
                                                                        ? 'bg-blue-500'
                                                                        : 'bg-yellow-500'
                                                                }`}
                                                                style={{ width: `${student.asistencia}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-semibold text-text-primary">
                                                            {student.asistencia}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="px-3 py-1 rounded-full text-sm font-bold bg-primary/20 text-primary">
                                                        {student.xp.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <button className="px-3 py-1 text-sm bg-background-secondary hover:bg-background-tertiary rounded-lg transition">
                                                        Ver Perfil
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'tareas' && (
                        <div className="text-center py-12">
                            <ClipboardList className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-bold text-text-primary mb-2">Próximamente</h3>
                            <p className="text-text-secondary mb-4">Sistema de tareas en desarrollo</p>
                            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center gap-2 mx-auto">
                                <Plus className="w-5 h-5" />
                                Crear Nueva Tarea
                            </button>
                        </div>
                    )}

                    {activeTab === 'examenes' && (
                        <div className="text-center py-12">
                            <BookOpen className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-bold text-text-primary mb-2">Próximamente</h3>
                            <p className="text-text-secondary mb-4">Sistema de exámenes en desarrollo</p>
                            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center gap-2 mx-auto">
                                <Plus className="w-5 h-5" />
                                Crear Nuevo Examen
                            </button>
                        </div>
                    )}

                    {activeTab === 'estadisticas' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-text-primary">Estadísticas del Grupo</h3>
                            
                            {/* Distribución de calificaciones */}
                            <Card className="p-4">
                                <h4 className="font-bold text-text-primary mb-4">Distribución de Promedios</h4>
                                <div className="space-y-3">
                                    {[
                                        { range: '90-100', color: 'bg-green-500', count: students.filter(s => s.promedio >= 90).length },
                                        { range: '80-89', color: 'bg-blue-500', count: students.filter(s => s.promedio >= 80 && s.promedio < 90).length },
                                        { range: '70-79', color: 'bg-yellow-500', count: students.filter(s => s.promedio >= 70 && s.promedio < 80).length },
                                        { range: '0-69', color: 'bg-red-500', count: students.filter(s => s.promedio < 70).length },
                                    ].map((stat) => (
                                        <div key={stat.range} className="flex items-center gap-4">
                                            <span className="text-sm font-semibold text-text-primary w-16">{stat.range}</span>
                                            <div className="flex-1 bg-background-tertiary rounded-full h-8 overflow-hidden">
                                                <div
                                                    className={`${stat.color} h-full flex items-center justify-end px-3 text-white font-bold text-sm transition-all duration-500`}
                                                    style={{ width: `${(stat.count / students.length) * 100}%` }}
                                                >
                                                    {stat.count > 0 && `${stat.count} estudiantes`}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Top 5 estudiantes */}
                            <Card className="p-4">
                                <h4 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-yellow-500" />
                                    Top 5 Estudiantes
                                </h4>
                                <div className="space-y-2">
                                    {students
                                        .sort((a, b) => b.promedio - a.promedio)
                                        .slice(0, 5)
                                        .map((student, index) => (
                                        <div key={student.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-background-secondary transition">
                                            <span className="text-2xl font-bold text-text-secondary">#{index + 1}</span>
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                                {student.nombre.charAt(0)}{student.apellido.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-text-primary">{student.nombre} {student.apellido}</p>
                                                <p className="text-xs text-text-secondary">{student.xp.toLocaleString()} XP</p>
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-500/20 text-green-600 dark:text-green-400">
                                                {student.promedio}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
};
