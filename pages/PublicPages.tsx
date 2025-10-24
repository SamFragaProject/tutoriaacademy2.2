import React from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { BarChart, CheckCircle, BrainCircuit, Trophy, Lock, MessageSquare, ShieldCheck, Zap, TrendingUp, Users, Award, Clock, BookOpen, Rocket, Target, FileText, GraduationCap, Star, Sparkles } from 'lucide-react';
import { Card, StatCard, PrimaryButton, SecondaryButton, ComingSoonTooltip, Chip } from '../components/ui';
import { BLOG_POSTS } from '../constants';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import BrainIllustration from '../components/illustrations/BrainIllustration';
import RocketIllustration from '../components/illustrations/RocketIllustration';
import BookIllustration from '../components/illustrations/BookIllustration';
import GymBrainIllustration from '../components/illustrations/GymBrainIllustration';
import { useAuth } from '../hooks/useAuth';

const chartData = [
  { name: 'Sem 1', Progreso: 10 },
  { name: 'Sem 2', Progreso: 25 },
  { name: 'Sem 3', Progreso: 40 },
  { name: 'Sem 4', Progreso: 65 },
  { name: 'Sem 5', Progreso: 85 },
];


export const HomePage: React.FC = () => {
    const { user, userData, signOut } = useAuth();
    const navigate = useNavigate();
    
    const sectionVariants: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" }}
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    const goToDashboard = () => {
        if (userData?.rol === 'profesor') {
            navigate('/docente/dashboard');
        } else if (userData?.rol === 'director') {
            navigate('/director/dashboard');
        } else if (userData?.rol === 'alumno') {
            navigate('/app/dashboard');
        } else {
            navigate('/login');
        }
    };


    const features = [
        { 
            icon: BrainCircuit, 
            title: 'IA Diagnóstica', 
            description: 'Evaluación inteligente de fortalezas y debilidades',
            gradient: 'from-purple-500 to-purple-700',
            bgLight: 'bg-purple-50',
            bgDark: 'bg-purple-950/30',
            stats: '98% precisión'
        },
        { 
            icon: Target, 
            title: 'Plan Adaptativo', 
            description: 'Contenido que evoluciona con tu progreso',
            gradient: 'from-blue-500 to-blue-700',
            bgLight: 'bg-blue-50',
            bgDark: 'bg-blue-950/30',
            stats: '100% personalizado'
        },
        { 
            icon: Rocket, 
            title: 'Tutor 24/7', 
            description: 'Asistente IA con referencias oficiales',
            gradient: 'from-orange-500 to-red-600',
            bgLight: 'bg-orange-50',
            bgDark: 'bg-red-950/30',
            stats: 'Siempre disponible'
        },
        { 
            icon: CheckCircle, 
            title: 'Práctica Ilimitada', 
            description: 'Ejercicios y simulacros sin límites',
            gradient: 'from-green-500 to-emerald-600',
            bgLight: 'bg-green-50',
            bgDark: 'bg-green-950/30',
            stats: '10K+ preguntas'
        },
        { 
            icon: Trophy, 
            title: 'Gamificación', 
            description: 'XP, rankings, logros y desafíos',
            gradient: 'from-yellow-500 to-amber-600',
            bgLight: 'bg-yellow-50',
            bgDark: 'bg-yellow-950/30',
            stats: '50+ logros'
        },
        { 
            icon: TrendingUp, 
            title: 'Analytics Pro', 
            description: 'Seguimiento detallado de tu evolución',
            gradient: 'from-cyan-500 to-teal-600',
            bgLight: 'bg-cyan-50',
            bgDark: 'bg-cyan-950/30',
            stats: 'Tiempo real'
        },
    ];

    const capabilities = [
        {
            icon: Users,
            title: 'Multi-rol',
            description: 'Estudiantes, profesores y directores',
            color: 'text-purple-500'
        },
        {
            icon: ShieldCheck,
            title: 'Screening',
            description: 'Detección de dificultades de aprendizaje',
            color: 'text-blue-500'
        },
        {
            icon: Zap,
            title: 'Adaptativo',
            description: 'Contenido según tu estilo de aprendizaje',
            color: 'text-orange-500'
        },
        {
            icon: BarChart,
            title: 'Predictivo',
            description: 'Algoritmos que anticipan tus necesidades',
            color: 'text-green-500'
        },
    ];

    const testimonials = [
        { 
            name: 'Ana Sofía R.', 
            role: 'Estudiante',
            area: 'Aspirante a Medicina', 
            text: 'La gamificación realmente me enganchó. Ver mi XP subir después de cada sesión de práctica es súper motivador.',
            avatar: '👩‍🎓',
            rating: 5
        },
        { 
            name: 'Carlos G.', 
            role: 'Estudiante',
            area: 'Aspirante a Ingeniería', 
            text: 'El plan de estudio personalizado me quitó el estrés de no saber por dónde empezar. La IA identificó mis puntos débiles al instante.',
            avatar: '👨‍💻',
            rating: 5
        },
        { 
            name: 'Valeria M.', 
            role: 'Estudiante',
            area: 'Aspirante a Arquitectura', 
            text: 'Pasar del 70% al 92% en los simulacros fue gracias a las prácticas con feedback inmediato. Recomiendo TutoriA al 100%.',
            avatar: '👩‍🎨',
            rating: 5
        },
    ];
    
    const faqs = [
        { 
            q: '¿Cómo accedo a la plataforma?', 
            a: 'Tu escuela o institución te proporcionará tus credenciales de acceso. Una vez que las tengas, simplemente haz clic en "Iniciar Sesión" e ingrésalas.',
            icon: Lock
        },
        { 
            q: '¿Qué incluye mi acceso?', 
            a: 'Tu acceso incluye todas las herramientas de la plataforma: diagnóstico, plan de estudio personalizado, tutor IA, prácticas ilimitadas, simulacros, analíticas de progreso y el gimnasio cognitivo.',
            icon: CheckCircle
        },
        { 
            q: '¿Puedo usar la plataforma en mi celular?', 
            a: '¡Sí! La plataforma es completamente responsiva y está diseñada para funcionar de maravilla tanto en computadoras de escritorio como en dispositivos móviles.',
            icon: Users
        },
        { 
            q: '¿Mis datos están seguros?', 
            a: 'Absolutamente. La seguridad y privacidad de nuestros usuarios es nuestra máxima prioridad. Utilizamos encriptación y seguimos las mejores prácticas de la industria.',
            icon: ShieldCheck
        },
    ];

  return (
    <div className="space-y-24 md:space-y-32 pb-24 overflow-x-hidden">
      {/* Widget de sesión activa */}
      {user && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3 backdrop-blur-sm bg-opacity-95">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
              {userData?.nombre?.[0] || 'U'}
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {userData?.nombre || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {userData?.rol || 'Usuario'}
              </p>
            </div>
            <div className="flex gap-2 ml-2">
              <button
                onClick={goToDashboard}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                title="Ir al panel"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                title="Cerrar sesión"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero - Diseño Dinámico y Original */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Fondo animado con gradientes */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5" />
        
        {/* Círculos decorativos animados */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/4 w-72 h-72 bg-gradient-to-br from-orange-500/15 to-pink-500/15 rounded-full blur-3xl"
        />

        {/* Partículas flotantes */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            
            {/* Columna izquierda - Contenido */}
            <div className="flex flex-col text-center lg:text-left">
              
              {/* Badges animados */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full backdrop-blur-sm"
                >
                  <BrainCircuit className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">IA Avanzada</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm"
                >
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Para Instituciones</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-full backdrop-blur-sm"
                >
                  <Trophy className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">Gamificado</span>
                </motion.div>
              </motion.div>
              
              {/* Título principal con gradiente animado */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 animate-gradient">
                  Aprende
                </span>
                <br />
                <span className="text-text-primary">con Inteligencia</span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 animate-gradient">
                  Artificial
                </span>
              </motion.h1>
              
              {/* Descripción con efecto typewriter */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg md:text-xl text-text-secondary leading-relaxed font-medium mb-8"
              >
                La plataforma educativa que se adapta a ti. Diagnósticos precisos, planes personalizados, 
                tutor IA 24/7 y analíticas en tiempo real para <span className="text-primary font-bold">maximizar tu potencial</span>.
              </motion.p>
              
              {/* CTAs con efectos hover avanzados */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 items-center lg:items-start"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <NavLink to="/login">
                    <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                      <span className="relative z-10 flex items-center gap-2">
                        <Rocket className="w-5 h-5" />
                        Comenzar Ahora
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </NavLink>
                </motion.div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-surface-1/80 backdrop-blur-sm border-2 border-border hover:border-primary text-text-primary font-bold text-lg rounded-2xl transition-all duration-300 flex items-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  Ver Demo
                </motion.button>
              </motion.div>
            </div>
            
            {/* Columna derecha - Ilustraciones */}
            <div className="relative hidden lg:block">
              {/* Ilustración del cerebro flotante */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute top-0 right-20 z-20"
              >
                <BrainIllustration className="w-48 h-48" />
              </motion.div>
              
              {/* Ilustración del cohete */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="relative z-10"
              >
                <RocketIllustration className="w-96 h-96" />
              </motion.div>
              
              {/* Ilustración del libro */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="absolute bottom-10 -left-10 z-20"
              >
                <BookIllustration className="w-56 h-56" />
              </motion.div>
            </div>
          </div>
            
          {/* Estadísticas destacadas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mx-auto"
          >
              {[
                { value: '10K+', label: 'Estudiantes', icon: Users, gradient: 'from-purple-500 to-blue-500' },
                { value: '98%', label: 'Precisión IA', icon: Target, gradient: 'from-blue-500 to-cyan-500' },
                { value: '24/7', label: 'Disponible', icon: Clock, gradient: 'from-cyan-500 to-green-500' },
                { value: '50+', label: 'Logros', icon: Trophy, gradient: 'from-orange-500 to-pink-500' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300 blur-xl" />
                  <div className="relative p-6 rounded-2xl bg-surface-1/80 backdrop-blur-sm border border-border group-hover:border-primary/50 transition-all duration-300">
                    <stat.icon className={`w-8 h-8 mx-auto mb-3 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} />
                    <div className="text-3xl font-black text-text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-text-secondary font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

        </div>
      </section>

      {/* Features Grid - Estilo Moderno con Gradientes */}
      <motion.section 
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4"
          >
            <span className="text-primary font-semibold text-sm">🚀 Plataforma Todo-en-Uno</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Herramientas de última generación para impulsar tu aprendizaje
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-1 to-surface-2 border border-border hover:border-primary/50 transition-all duration-300 h-full">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative p-8">
                  {/* Icon con gradiente */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-text-primary">
                        {feature.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${feature.gradient} text-white`}>
                        {feature.stats}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Progress Indicator */}
                  <div className="mt-6 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + 0.3, duration: 1 }}
                        className={`h-full bg-gradient-to-r ${feature.gradient} rounded-full`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Capabilities Row */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {capabilities.map((cap, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-surface-1 border border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="p-3 rounded-lg bg-surface-2">
                <cap.icon className={`w-6 h-6 ${cap.color}`} />
              </div>
              <div>
                <h4 className="font-semibold text-text-primary text-sm">{cap.title}</h4>
                <p className="text-xs text-text-secondary">{cap.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How it works - Diseño Visual Mejorado */}
      <motion.section 
        id="how-it-works"
        className="relative py-24 overflow-hidden"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-blue-500/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-info/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full mb-4"
            >
              <span className="text-primary font-semibold text-sm">⚡ Proceso Simplificado</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">
              Comienza en 3 simples pasos
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Diseñado para que puedas empezar en minutos, no en horas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative group"
            >
              <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-2 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
                {/* Number Badge */}
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/50">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                </div>

                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 mt-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                  <BrainCircuit className="w-10 h-10 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-text-primary mb-3 text-center">
                  Diagnóstico IA
                </h3>
                <p className="text-text-secondary text-center leading-relaxed">
                  Responde una breve evaluación inicial. Nuestra IA analizará tu nivel en cada materia.
                </p>

                {/* Connector Arrow (desktop) */}
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500" />
                  <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full transform translate-x-1" />
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-2 border-blue-500/20 hover:border-blue-500/50 transition-all duration-300">
                {/* Number Badge */}
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                </div>

                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 mt-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <Target className="w-10 h-10 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-text-primary mb-3 text-center">
                  Plan Personalizado
                </h3>
                <p className="text-text-secondary text-center leading-relaxed">
                  Recibe un calendario adaptado a tus fortalezas y áreas de mejora automáticamente.
                </p>

                {/* Connector Arrow (desktop) */}
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-green-500" />
                  <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full transform translate-x-1" />
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative group"
            >
              <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-600/5 border-2 border-green-500/20 hover:border-green-500/50 transition-all duration-300">
                {/* Number Badge */}
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/50">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                </div>

                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 mt-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Rocket className="w-10 h-10 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-text-primary mb-3 text-center">
                  ¡Despega!
                </h3>
                <p className="text-text-secondary text-center leading-relaxed">
                  Practica, consulta al tutor IA y mide tu progreso con simulacros realistas.
                </p>
              </div>
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-16"
          >
            <PrimaryButton className="text-lg px-8 py-4">
              <NavLink to="/login" className="flex items-center gap-2">
                Comenzar ahora <Rocket className="w-5 h-5" />
              </NavLink>
            </PrimaryButton>
          </motion.div>
        </div>
      </motion.section>

      {/* Gimnasio Cognitivo - Sección Destacada */}
      <motion.section
        id="gimnasio-cognitivo"
        className="relative py-32 overflow-hidden"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Background con gradientes animados */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10" />
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-full mb-6 border-2 border-purple-500/20"
            >
              <span className="text-3xl">🧠</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">EXCLUSIVO</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-black text-text-primary mb-6"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                Gimnasio Cognitivo
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto font-medium"
            >
              Entrena tu cerebro con minijuegos científicamente diseñados para 
              <span className="text-purple-600 dark:text-purple-400 font-bold"> mejorar tu memoria, atención y velocidad de procesamiento</span>
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Columna izquierda - Ilustración */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <GymBrainIllustration className="w-full h-auto max-w-lg mx-auto" />
            </motion.div>

            {/* Columna derecha - Beneficios */}
            <div className="space-y-6">
              {[
                {
                  icon: '⚡',
                  title: 'N-Back Challenge',
                  description: 'Mejora tu memoria de trabajo y capacidad de concentración con secuencias cada vez más complejas.',
                  color: 'from-yellow-500 to-orange-500',
                  bgColor: 'from-yellow-500/10 to-orange-500/10',
                  borderColor: 'border-yellow-500/30'
                },
                {
                  icon: '🎯',
                  title: 'Focus Switch',
                  description: 'Entrena tu flexibilidad cognitiva alternando rápidamente entre diferentes tipos de tareas.',
                  color: 'from-blue-500 to-cyan-500',
                  bgColor: 'from-blue-500/10 to-cyan-500/10',
                  borderColor: 'border-blue-500/30'
                },
                {
                  icon: '💨',
                  title: 'Speed Reader (RSVP)',
                  description: 'Aumenta tu velocidad de lectura hasta 3x manteniendo excelente comprensión.',
                  color: 'from-green-500 to-emerald-500',
                  bgColor: 'from-green-500/10 to-emerald-500/10',
                  borderColor: 'border-green-500/30'
                },
                {
                  icon: '🧩',
                  title: 'Entrenamiento Adaptativo',
                  description: 'La dificultad se ajusta automáticamente a tu nivel para mantener el desafío óptimo.',
                  color: 'from-purple-500 to-pink-500',
                  bgColor: 'from-purple-500/10 to-pink-500/10',
                  borderColor: 'border-purple-500/30'
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, x: 8 }}
                  className={`
                    relative p-6 rounded-2xl border-2 ${benefit.borderColor}
                    bg-gradient-to-r ${benefit.bgColor}
                    backdrop-blur-sm transition-all duration-300 cursor-pointer
                    group overflow-hidden
                  `}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${benefit.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative flex items-start gap-4">
                    <motion.div
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      className={`
                        flex-shrink-0 w-14 h-14 rounded-xl 
                        bg-gradient-to-br ${benefit.color}
                        flex items-center justify-center text-2xl shadow-lg
                      `}
                    >
                      {benefit.icon}
                    </motion.div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-text-primary mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-text-secondary leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats destacadas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: '+25%', label: 'Mejora en memoria de trabajo', icon: '💾' },
              { value: '+40%', label: 'Aumento en velocidad de lectura', icon: '📖' },
              { value: '-30%', label: 'Reducción en tiempo de respuesta', icon: '⚡' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-2 border-purple-500/30 text-center group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative">
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 mb-2">
                    {stat.value}
                  </div>
                  <p className="text-sm font-semibold text-text-secondary">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <NavLink to="/login">
                <button className="group relative px-10 py-5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-black text-xl rounded-2xl overflow-hidden shadow-2xl">
                  <span className="relative z-10 flex items-center gap-3">
                    <span>🧠</span>
                    Entrenar Ahora
                    <Sparkles className="w-6 h-6" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </NavLink>
            </motion.div>
            <p className="mt-4 text-sm text-text-secondary font-semibold">
              ✨ Minijuegos ilimitados incluidos en tu suscripción
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Showcase */}
      <motion.section 
        id="showcase" 
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">Tu Dashboard de Aprendizaje</h2>
            <p className="mt-3 text-text-secondary max-w-2xl mx-auto">Visualiza tu progreso en tiempo real con una interfaz diseñada para mantenerte enfocado y motivado.</p>
        </div>
        <Card className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    <StatCard icon={Award} label="Puntos de Experiencia (XP)" value="1,250" color="blue" />
                    <StatCard icon={TrendingUp} label="Precisión Global" value="88%" color="green" />
                    <StatCard icon={Zap} label="Racha de Estudio" value="12 Días" color="yellow" />
                    <StatCard icon={BookOpen} label="Materias Activas" value="2" color="blue" />
                </div>
                <div className="lg:col-span-2">
                    <h4 className="text-lg font-semibold text-text-primary mb-4">Progreso General del Plan</h4>
                    <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis dataKey="name" stroke="var(--color-text-secondary)" />
                                <YAxis stroke="var(--color-text-secondary)" unit="%" />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border)', backdropFilter: 'blur(4px)', borderRadius: 'var(--radius-input)' }} />
                                <Line type="monotone" dataKey="Progreso" stroke="var(--color-info)" strokeWidth={3} dot={{ r: 5, fill: 'var(--color-info)' }} activeDot={{ r: 8, stroke: 'var(--color-background)', strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </Card>
      </motion.section>
      
      {/* Testimonials - Diseño Visual Mejorado */}
      <motion.section 
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full mb-4"
          >
            <span className="text-orange-500 font-semibold text-sm">⭐ Historias de Éxito</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">
            Resultados reales de estudiantes reales
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Miles de estudiantes ya están alcanzando sus metas con TutoriA
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-surface-1 to-surface-2 border border-border hover:border-primary/50 transition-all duration-300">
                {/* Quote Icon */}
                <div className="absolute -top-4 left-8 w-10 h-10 bg-gradient-to-br from-primary to-info rounded-xl flex items-center justify-center text-white text-2xl font-serif">
                  "
                </div>

                {/* Stars Rating */}
                <div className="flex gap-1 mb-4 mt-2">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Award key={idx} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-text-primary text-base leading-relaxed mb-6 italic">
                  "{t.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg"
                  >
                    {/* Animated ring */}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border-2 border-primary"
                    />
                    {t.avatar}
                  </motion.div>
                  <div className="flex-1">
                    <p className="font-bold text-text-primary text-base">{t.name}</p>
                    <p className="text-sm text-text-secondary flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      {t.area}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '10K+', label: 'Estudiantes activos' },
            { value: '95%', label: 'Satisfacción' },
            { value: '85%', label: 'Mejora promedio' },
            { value: '24/7', label: 'Soporte IA' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-center p-6 rounded-2xl bg-surface-1 border border-border"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-text-secondary">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* FAQ - Diseño Visual Mejorado */}
      <motion.section 
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-full mb-4"
          >
            <span className="text-green-500 font-semibold text-sm">❓ FAQ</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">
            ¿Tienes preguntas?
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Encuentra respuestas a las dudas más comunes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <details className="group p-6 rounded-2xl bg-gradient-to-br from-surface-1 to-surface-2 border border-border hover:border-primary/50 cursor-pointer transition-all duration-300">
                <summary className="list-none flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center">
                    <faq.icon className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Question */}
                  <div className="flex-1">
                    <h3 className="font-bold text-text-primary text-lg group-open:text-primary transition-colors">
                      {faq.q}
                    </h3>
                  </div>

                  {/* Chevron */}
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-surface-3 flex items-center justify-center group-open:rotate-180 transition-transform duration-300">
                      <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </summary>

                {/* Answer */}
                <div className="mt-4 ml-14 pl-4 border-l-2 border-primary/30">
                  <p className="text-text-secondary leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </details>
            </motion.div>
          ))}
        </div>

        {/* CTA Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-info/10 border-2 border-primary/20">
            <h3 className="text-2xl font-bold text-text-primary mb-3">
              ¿Aún tienes dudas?
            </h3>
            <p className="text-text-secondary mb-6">
              Nuestro equipo está listo para ayudarte
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SecondaryButton className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Contactar Soporte
              </SecondaryButton>
              <PrimaryButton>
                <NavLink to="/login">Comenzar Ahora</NavLink>
              </PrimaryButton>
            </div>
          </div>
        </motion.div>
      </motion.section>

    </div>
  );
};

export const BlogIndexPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold text-center mb-12 text-text-primary">Blog de TutoriA</h1>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-8 space-y-8">
                    {BLOG_POSTS.map(post => (
                        <Card key={post.slug}>
                            <h2 className="text-2xl font-bold text-text-primary hover:text-primary transition-colors">
                                <NavLink to={`/blog/${post.slug}`}>{post.title}</NavLink>
                            </h2>
                            <p className="text-sm text-text-secondary mt-2">Por {post.author} el {post.date}</p>
                            <p className="text-text-primary mt-4">{post.excerpt}</p>
                            <NavLink to={`/blog/${post.slug}`} className="mt-4 inline-block font-semibold text-primary hover:text-text-primary">Leer más &rarr;</NavLink>
                        </Card>
                    ))}
                </div>
                <aside className="md:col-span-4">
                    <div className="sticky top-24">
                        <Card>
                            <h3 className="text-xl font-bold text-text-primary">Prueba nuestro Tutor IA</h3>
                            <p className="text-text-secondary mt-2">Resuelve tus dudas al instante con el poder de la IA.</p>
                            <PrimaryButton className="w-full mt-4"><NavLink to="/login">Acceder al portal</NavLink></PrimaryButton>
                        </Card>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export const BlogPostPage: React.FC = () => {
    const { slug } = useParams();
    const post = BLOG_POSTS.find(p => p.slug === slug);

    if (!post) {
        return <div className="text-center py-20 text-text-primary">Post no encontrado.</div>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-3xl mx-auto">
                <Card>
                    <h1 className="text-4xl font-bold text-text-primary">{post.title}</h1>
                    <p className="text-text-secondary mt-4">Por {post.author} el {post.date}</p>
                    <div className="prose prose-invert text-text-primary prose-lg mt-8" dangerouslySetInnerHTML={{ __html: post.content }} />
                     <NavLink to="/blog" className="mt-8 inline-block font-semibold text-primary hover:text-text-primary">&larr; Volver al blog</NavLink>
                </Card>
            </div>
        </div>
    );
};

export const HelpPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
             <h1 className="text-4xl font-bold text-center mb-12 text-text-primary">Centro de Ayuda</h1>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <Card>
                        <h2 className="text-2xl font-bold text-text-primary mb-4">Preguntas Frecuentes</h2>
                        <div className="space-y-4">
                            <details className="p-4 rounded-button bg-surface-2 border border-border"><summary className="font-semibold text-text-primary">¿Cómo empiezo con mi diagnóstico?</summary><p className="text-text-secondary mt-2">Ve a la sección "Diagnóstico" en tu panel. La prueba comenzará automáticamente. Tómate tu tiempo y responde con honestidad para obtener el mejor plan de estudio.</p></details>
                            <details className="p-4 rounded-button bg-surface-2 border border-border"><summary className="font-semibold text-text-primary">Mi plan de estudio no me convence, ¿puedo cambiarlo?</summary><p className="text-text-secondary mt-2">¡Claro! El plan es una guía. Puedes volver a realizar el diagnóstico o hablar con el Tutor IA para que te sugiera ajustes basados en tus preferencias y progreso reciente.</p></details>
                             <details className="p-4 rounded-button bg-surface-2 border border-border"><summary className="font-semibold text-text-primary">¿Qué es el "Modo ahorro de tokens"?</summary><p className="text-text-secondary mt-2">Este modo, que puedes activar en tu configuración, hace que las respuestas del Tutor IA sean más breves y directas. Mantiene la calidad pero consume menos de tu cuota mensual, ideal para sesiones de preguntas rápidas.</p></details>
                        </div>
                         <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4">Cómo reportar un problema</h2>
                         <ol className="list-decimal list-inside text-text-primary space-y-2">
                             <li>Toma una captura de pantalla del problema si es posible.</li>
                             <li>Ve a la sección "Ayuda" y busca el formulario de contacto.</li>
                             <li>Describe el problema con el mayor detalle posible: qué estabas haciendo, qué esperabas que pasara y qué pasó en realidad.</li>
                             <li>Adjunta la captura de pantalla y envía tu reporte. Nuestro equipo lo revisará a la brevedad.</li>
                         </ol>
                    </Card>
                </div>
                <div className="md:col-span-1">
                    <Card>
                        <h2 className="text-2xl font-bold text-text-primary mb-4">Contacta a Soporte</h2>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-text-secondary">Asunto</label>
                                <input type="text" id="subject" className="mt-1 block w-full bg-surface-1 border-border rounded-input shadow-sm focus:ring-primary focus:border-primary" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-text-secondary">Mensaje</label>
                                <textarea id="message" rows={5} className="mt-1 block w-full bg-surface-1 border-border rounded-input shadow-sm focus:ring-primary focus:border-primary"></textarea>
                            </div>
                            <ComingSoonTooltip text="Función Próximamente" explanation="El envío de formularios se activará en producción. Esta es una demostración de la interfaz.">
                                <PrimaryButton type="submit" className="w-full">Enviar Mensaje</PrimaryButton>
                            </ComingSoonTooltip>
                        </form>
                    </Card>
                </div>
             </div>
        </div>
    );
};


export const LegalPage: React.FC<{type: 'terms' | 'privacy' | 'contact'}> = ({type}) => {
    const content = {
        terms: {
            title: 'Términos y Condiciones',
            body: `<p>Bienvenido a TutoriA Academy. Al usar nuestros servicios, aceptas estos términos. El servicio se proporciona "tal cual". No garantizamos resultados específicos en ningún examen. La suscripción es mensual y se renueva automáticamente a menos que se cancele. El contenido generado por la IA es para fines educativos y puede contener imprecisiones.</p>`
        },
        privacy: {
            title: 'Política de Privacidad',
            body: `<p>Respetamos tu privacidad. Recopilamos datos de uso para mejorar nuestro servicio, como tu progreso y las interacciones con la IA. No compartimos tus datos personales con terceros sin tu consentimiento, excepto cuando sea requerido por ley. Utilizamos cookies para mantener tu sesión activa. Puedes solicitar la eliminación de tus datos en cualquier momento.</p>`
        },
        contact: {
            title: 'Contacto',
            body: ''
        }
    };
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <Card className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-text-primary mb-6">{content[type].title}</h1>
                {type !== 'contact' ? (
                     <div className="prose prose-invert text-text-primary" dangerouslySetInnerHTML={{ __html: content[type].body }} />
                ) : (
                    <div>
                         <p className="text-text-primary mb-6">Si tienes alguna pregunta, no dudes en contactarnos. Rellena el formulario y nos pondremos en contacto contigo.</p>
                         <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Nombre</label>
                                    <input type="text" id="name" className="mt-1 block w-full bg-surface-1 border-border rounded-input shadow-sm focus:ring-primary focus:border-primary" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email</label>
                                    <input type="email" id="email" className="mt-1 block w-full bg-surface-1 border-border rounded-input shadow-sm focus:ring-primary focus:border-primary" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-text-secondary">Asunto</label>
                                <input type="text" id="subject" className="mt-1 block w-full bg-surface-1 border-border rounded-input shadow-sm focus:ring-primary focus:border-primary" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-text-secondary">Mensaje</label>
                                <textarea id="message" rows={5} className="mt-1 block w-full bg-surface-1 border-border rounded-input shadow-sm focus:ring-primary focus:border-primary"></textarea>
                            </div>
                             <ComingSoonTooltip text="Función Próximamente" explanation="El envío de formularios de contacto se activará en producción.">
                                <PrimaryButton type="submit" className="w-full sm:w-auto">Enviar Mensaje</PrimaryButton>
                            </ComingSoonTooltip>
                        </form>
                    </div>
                )}
            </Card>
        </div>
    );
};