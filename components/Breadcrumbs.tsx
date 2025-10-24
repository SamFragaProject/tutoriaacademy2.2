// components/Breadcrumbs.tsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbsProps {
  className?: string;
}

// Mapeo de rutas a nombres legibles
const ROUTE_NAMES: Record<string, string> = {
  // Estudiante
  app: 'Inicio',
  dashboard: 'Dashboard',
  materias: 'Materias',
  agenda: 'Agenda',
  progreso: 'Progreso',
  chat: 'Tutor IA',
  juegos: 'Juegos',
  diagnostico: 'Diagnóstico',
  practicas: 'Prácticas',
  simulacro: 'Simulacro',
  ranking: 'Ranking',
  configuracion: 'Configuración',
  biblioteca: 'Biblioteca',
  onboarding: 'Bienvenida',
  exam: 'Examen',
  
  // Profesor
  docente: 'Portal Docente',
  grupos: 'Grupos',
  'banco-preguntas': 'Banco de Preguntas',
  examenes: 'Exámenes',
  calificaciones: 'Calificaciones',
  resultados: 'Resultados',
  copiloto: 'Copiloto',
  screening: 'Screening',
  'crear-examen-ia': 'Crear Examen IA',
  tareas: 'Tareas',
  comunicacion: 'Comunicación',
  'asistente-chatbot': 'Asistente Chatbot',
  
  // Director
  director: 'Portal Director',
  escuela: 'Escuela',
  docentes: 'Profesores',
  alumnos: 'Estudiantes',
  analisis: 'Análisis',
  suscripcion: 'Suscripción',
  
  // Admin
  admin: 'Administración',
  users: 'Usuarios',
  documents: 'Documentos',
  tutors: 'Tutores',
  metrics: 'Métricas',
  emails: 'Emails',
  apis: 'APIs',
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className = '' }) => {
  const location = useLocation();
  
  // Dividir la ruta en segmentos
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Si estamos en la raíz, no mostrar breadcrumbs
  if (pathSegments.length === 0) return null;

  // Construir array de breadcrumbs
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const name = ROUTE_NAMES[segment] || segment;
    const isLast = index === pathSegments.length - 1;

    return {
      name,
      path,
      isLast,
    };
  });

  return (
    <nav className={`flex items-center gap-2 text-sm ${className}`} aria-label="Breadcrumb">
      {/* Home icon */}
      <Link
        to="/"
        className="text-text-secondary hover:text-primary transition-colors"
        aria-label="Inicio"
      >
        <Home size={16} />
      </Link>

      {breadcrumbs.map((crumb, index) => (
        <motion.div
          key={crumb.path}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-2"
        >
          <ChevronRight size={16} className="text-text-secondary" />
          
          {crumb.isLast ? (
            <span className="font-medium text-text-primary">{crumb.name}</span>
          ) : (
            <Link
              to={crumb.path}
              className="text-text-secondary hover:text-primary transition-colors"
            >
              {crumb.name}
            </Link>
          )}
        </motion.div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
