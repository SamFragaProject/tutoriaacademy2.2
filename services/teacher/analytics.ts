/**
 * Servicio de Analíticas - TutoriA Academy
 * Genera heatmaps, KPIs y estadísticas de rendimiento
 */

import { supabase } from '../../lib/supabaseClient';

export interface HeatmapCell {
    studentName: string;
    score: number;
}

export interface SubtopicResult {
    subtopic: string;
    results: HeatmapCell[];
}

export interface TeacherKPI {
    totalStudents: number;
    activeGroups: number;
    pendingExams: number;
    averageScore: number;
}

/**
 * Genera datos para el heatmap de rendimiento por tema/subtema
 */
export async function fetchHeatmapData(grupoId: string): Promise<SubtopicResult[]> {
    try {
        // Obtener todos los alumnos del grupo
        const { data: alumnos, error: alumnosError } = await supabase
            .from('grupos_alumnos')
            .select(`
                usuarios!inner (
                    id,
                    nombre,
                    apellidos
                )
            `)
            .eq('grupo_id', grupoId)
            .eq('activo', true);

        if (alumnosError) throw alumnosError;
        if (!alumnos || alumnos.length === 0) return [];

        // Obtener todas las calificaciones del grupo agrupadas por subtema
        const { data: calificaciones, error: calError } = await supabase
            .from('calificaciones')
            .select('alumno_id, tema, subtema, calificacion')
            .eq('grupo_id', grupoId)
            .not('subtema', 'is', null)
            .order('subtema');

        if (calError) throw calError;
        if (!calificaciones || calificaciones.length === 0) return [];

        // Agrupar calificaciones por subtema
        const subtemaMap = new Map<string, Map<string, number[]>>();

        calificaciones.forEach(cal => {
            const key = `${cal.tema} - ${cal.subtema}`;
            if (!subtemaMap.has(key)) {
                subtemaMap.set(key, new Map());
            }
            
            const alumnoScores = subtemaMap.get(key)!;
            if (!alumnoScores.has(cal.alumno_id)) {
                alumnoScores.set(cal.alumno_id, []);
            }
            
            alumnoScores.get(cal.alumno_id)!.push(parseFloat(cal.calificacion));
        });

        // Convertir a formato SubtopicResult
        const heatmapData: SubtopicResult[] = [];

        subtemaMap.forEach((alumnoScores, subtemaKey) => {
            const results: HeatmapCell[] = alumnos.map((item: any) => {
                const usuario = item.usuarios;
                const scores = alumnoScores.get(usuario.id) || [];
                const avgScore = scores.length > 0 
                    ? scores.reduce((a, b) => a + b, 0) / scores.length 
                    : 0;

                return {
                    studentName: `${usuario.nombre} ${(usuario.apellidos || '').trim()}`.trim(),
                    score: Math.round(avgScore)
                };
            });

            heatmapData.push({
                subtopic: subtemaKey,
                results
            });
        });

        return heatmapData;
    } catch (error) {
        console.error('Error fetching heatmap data:', error);
        return [];
    }
}

/**
 * Obtiene KPIs generales del profesor
 */
export async function fetchTeacherKPIs(profesorId: string): Promise<TeacherKPI> {
    try {
        // Obtener IDs de grupos del profesor
        const { data: grupos, error: gruposError } = await supabase
            .from('grupos')
            .select('id')
            .eq('profesor_id', profesorId)
            .eq('activo', true);

        if (gruposError) throw gruposError;
        const groupIds = (grupos || []).map(g => g.id);

        // Grupos activos
        const activeGroups = groupIds.length;

        // Total de estudiantes en todos los grupos del profesor
        let totalStudents = 0;
        if (groupIds.length > 0) {
            const { count, error } = await supabase
                .from('grupos_alumnos')
                .select('*', { count: 'exact', head: true })
                .in('grupo_id', groupIds);
            if (error) throw error;
            totalStudents = count || 0;
        }

        // Exámenes pendientes (próximos 7 días)
        const hoy = new Date().toISOString();
        const proxSemana = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const { count: pendingExams, error: examsError } = await supabase
            .from('examenes')
            .select('*', { count: 'exact', head: true })
            .eq('profesor_id', profesorId)
            .eq('activo', true)
            .gte('fecha_inicio', hoy)
            .lte('fecha_inicio', proxSemana);
        if (examsError) throw examsError;

        // Promedio general de todos los grupos
        let averageScore = 0;
        if (groupIds.length > 0) {
            const { data: promedios, error: promError } = await supabase
                .from('calificaciones')
                .select('calificacion')
                .in('grupo_id', groupIds);
            if (promError) throw promError;

            if (promedios && promedios.length > 0) {
                const suma = promedios.reduce((acc, cal) => acc + parseFloat(cal.calificacion), 0);
                averageScore = Math.round((suma / promedios.length) * 10) / 10;
            }
        }

        return {
            totalStudents,
            activeGroups,
            pendingExams: pendingExams || 0,
            averageScore
        };
    } catch (error) {
        console.error('Error fetching teacher KPIs:', error);
        return {
            totalStudents: 0,
            activeGroups: 0,
            pendingExams: 0,
            averageScore: 0
        };
    }
}

/**
 * Obtiene estadísticas detalladas de un grupo
 */
export async function fetchGroupAnalytics(grupoId: string) {
    try {
        // Distribución de calificaciones
        const { data: calificaciones } = await supabase
            .from('calificaciones')
            .select('calificacion')
            .eq('grupo_id', grupoId);

        let distribucion = {
            excelente: 0, // 90-100
            bueno: 0,     // 80-89
            regular: 0,   // 70-79
            bajo: 0       // < 70
        };

        if (calificaciones) {
            calificaciones.forEach(cal => {
                const score = parseFloat(cal.calificacion);
                if (score >= 90) distribucion.excelente++;
                else if (score >= 80) distribucion.bueno++;
                else if (score >= 70) distribucion.regular++;
                else distribucion.bajo++;
            });
        }

        // Tendencia temporal (últimos 30 días)
        const hace30Dias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        
        const { data: tendencia } = await supabase
            .from('calificaciones')
            .select('fecha, calificacion')
            .eq('grupo_id', grupoId)
            .gte('fecha', hace30Dias)
            .order('fecha');

        // Alumnos con bajo rendimiento
        const { data: alumnosBajoRendimiento } = await supabase
            .from('calificaciones')
            .select(`
                alumno_id,
                calificacion,
                usuarios!inner (
                    nombre,
                    apellidos
                )
            `)
            .eq('grupo_id', grupoId)
            .lt('calificacion', 70);

        return {
            distribucion,
            tendencia: tendencia || [],
            alumnosBajoRendimiento: alumnosBajoRendimiento || []
        };
    } catch (error) {
        console.error('Error fetching group analytics:', error);
        throw error;
    }
}

/**
 * Obtiene subtemas con bajo rendimiento para refuerzo
 */
export async function fetchLowPerformanceSubtopics(grupoId: string, threshold: number = 70) {
    try {
        const { data, error } = await supabase
            .from('calificaciones')
            .select('tema, subtema, calificacion')
            .eq('grupo_id', grupoId)
            .not('subtema', 'is', null);

        if (error) throw error;
        if (!data || data.length === 0) return [];

        // Agrupar por subtema y calcular promedio
        const subtemaPromedios = new Map<string, { tema: string; subtema: string; promedio: number; count: number }>();

        data.forEach(cal => {
            const key = `${cal.tema}|${cal.subtema}`;
            if (!subtemaPromedios.has(key)) {
                subtemaPromedios.set(key, {
                    tema: cal.tema,
                    subtema: cal.subtema,
                    promedio: 0,
                    count: 0
                });
            }
            
            const item = subtemaPromedios.get(key)!;
            item.promedio += parseFloat(cal.calificacion);
            item.count++;
        });

        // Filtrar subtemas con promedio bajo
        const subtemasConBajoRendimiento = Array.from(subtemaPromedios.values())
            .map(item => ({
                ...item,
                promedio: item.promedio / item.count
            }))
            .filter(item => item.promedio < threshold)
            .sort((a, b) => a.promedio - b.promedio);

        return subtemasConBajoRendimiento;
    } catch (error) {
        console.error('Error fetching low performance subtopics:', error);
        return [];
    }
}

