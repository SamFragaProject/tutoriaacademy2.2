import { supabase } from '../../lib/supabaseClient';

// Tipos en BD según supabase_schema_fase4.sql
export type TareaTipo = 'tarea' | 'practica' | 'lectura' | 'proyecto';

export interface TareaDB {
	id: string;
	grupo_id: string;
	profesor_id: string;
	titulo: string;
	descripcion: string | null;
	tipo: TareaTipo;
	fecha_asignacion: string;
	fecha_entrega: string | null;
	puntos_max: number;
	archivo_url: string | null;
	instrucciones: any | null; // JSONB
	activo: boolean;
	created_at: string;
}

export interface EntregaDB {
	id: string;
	tarea_id: string;
	alumno_id: string;
	contenido: string | null;
	archivo_url: string | null;
	calificacion: number | null;
	comentarios_profesor: string | null;
	estado: 'pendiente' | 'entregada' | 'revisada' | 'retrasada' | null;
	fecha_entrega: string;
	created_at: string;
}

// Obtiene todas las tareas activas de un profesor
export async function fetchTasksByTeacher(profesorId: string): Promise<TareaDB[]> {
	const { data, error } = await supabase
		.from('tareas')
		.select('*')
		.eq('profesor_id', profesorId)
		.eq('activo', true)
		.order('fecha_entrega', { ascending: true, nullsFirst: false });

	if (error) throw error;
	return (data || []) as TareaDB[];
}

// Obtiene todas las tareas activas de un grupo
export async function fetchTasksByGroup(grupoId: string): Promise<TareaDB[]> {
	const { data, error } = await supabase
		.from('tareas')
		.select('*')
		.eq('grupo_id', grupoId)
		.eq('activo', true)
		.order('fecha_entrega', { ascending: true, nullsFirst: false });

	if (error) throw error;
	return (data || []) as TareaDB[];
}

// Crea una nueva tarea
export async function createTask(payload: Omit<TareaDB, 'id' | 'fecha_asignacion' | 'created_at' | 'activo'> & { activo?: boolean }) {
	const { data, error } = await supabase
		.from('tareas')
		.insert([payload])
		.select()
		.single();

	if (error) throw error;
	return data as TareaDB;
}

// Actualiza una tarea
export async function updateTask(tareaId: string, updates: Partial<TareaDB>) {
	const { data, error } = await supabase
		.from('tareas')
		.update(updates)
		.eq('id', tareaId)
		.select()
		.single();

	if (error) throw error;
	return data as TareaDB;
}

// Eliminación lógica de una tarea
export async function deleteTask(tareaId: string) {
	const { error } = await supabase
		.from('tareas')
		.update({ activo: false })
		.eq('id', tareaId);

	if (error) throw error;
}

// Entregas de una tarea
export async function fetchTaskSubmissions(tareaId: string): Promise<EntregaDB[]> {
	const { data, error } = await supabase
		.from('entregas')
		.select('*')
		.eq('tarea_id', tareaId)
		.order('fecha_entrega', { ascending: false });

	if (error) throw error;
	return (data || []) as EntregaDB[];
}

export async function upsertSubmission(entry: Partial<EntregaDB> & { tarea_id: string; alumno_id: string }) {
	const { data, error } = await supabase
		.from('entregas')
		.upsert(entry, { onConflict: 'tarea_id,alumno_id' })
		.select()
		.single();

	if (error) throw error;
	return data as EntregaDB;
}

export async function gradeSubmission(tareaId: string, alumnoId: string, calificacion: number, comentarios_profesor?: string) {
	const { data, error } = await supabase
		.from('entregas')
		.update({ calificacion, comentarios_profesor, estado: 'revisada' })
		.eq('tarea_id', tareaId)
		.eq('alumno_id', alumnoId)
		.select()
		.single();

	if (error) throw error;
	return data as EntregaDB;
}

