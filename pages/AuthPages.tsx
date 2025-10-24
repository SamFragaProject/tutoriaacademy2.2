import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, PrimaryButton, SecondaryButton } from '../components/ui';
import { BrainCircuit, Loader2, GraduationCap, ClipboardPenLine, Building, Building2, Shield, Sparkles } from 'lucide-react';
import { MOCK_USER_ALUMNO, MOCK_USER_DOCENTE, MOCK_USER_DIRECTOR, MOCK_USER_ADMIN, MOCK_USER_PRIMARIA, MOCK_USER_SECUNDARIA, MOCK_USER_PREPARATORIA } from '../constants';
import type { UserRole } from '../types';
import { motion } from 'framer-motion';

const AuthLayout: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => (
  <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    {/* Animated background */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5" />
    
    {/* Floating circles */}
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
      className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"
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
      className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"
    />

    {/* Particles */}
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-primary/20 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 3 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
    
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md z-10"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex justify-center mb-8"
      >
        <NavLink to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg"
          >
            <BrainCircuit className="h-8 w-8 text-white" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              TutoriA Academy
            </span>
            <span className="text-xs text-text-secondary font-medium">Powered by AI</span>
          </div>
        </NavLink>
      </motion.div>
      
      <Card className="backdrop-blur-xl bg-surface-1/95" gradient="from-purple-500/5 to-blue-500/5">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-3xl font-black text-text-primary">{title}</h2>
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        {children}
      </Card>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-text-secondary mt-6"
      >
        ¿Necesitas ayuda? <a href="#" className="text-primary hover:underline font-semibold">Contacta soporte</a>
      </motion.p>
    </motion.div>
  </div>
);

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(email, password);
            switch (user.role) {
                case 'alumno':
                    navigate('/app/dashboard');
                    break;
                case 'docente':
                    navigate('/docente/dashboard');
                    break;
                case 'director':
                    navigate('/director/dashboard');
                    break;
                case 'admin':
                    navigate('/admin/dashboard');
                    break;
                default:
                    navigate('/');
            }
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión.');
        }
    };

    const handleLoginAs = async (role: UserRole, gradeLevel?: 'primaria' | 'secundaria' | 'preparatoria') => {
        setError('');
        try {
            let userCredentials: { email: string, pass: string };

            switch (role) {
                case 'alumno':
                    // Si se especifica nivel educativo, usar ese usuario
                    if (gradeLevel === 'primaria') {
                        userCredentials = { email: 'ana.primaria@escuela.com', pass: 'primaria123' };
                    } else if (gradeLevel === 'secundaria') {
                        userCredentials = { email: 'carlos.secundaria@escuela.com', pass: 'secundaria123' };
                    } else if (gradeLevel === 'preparatoria') {
                        userCredentials = { email: 'maria.prepa@escuela.com', pass: 'preparatoria123' };
                    } else {
                        // Por defecto usar preparatoria
                        userCredentials = { email: MOCK_USER_ALUMNO.email, pass: 'alumno123' };
                    }
                    break;
                case 'docente':
                    userCredentials = { email: MOCK_USER_DOCENTE.email, pass: 'docente123' };
                    break;
                case 'director':
                    userCredentials = { email: MOCK_USER_DIRECTOR.email, pass: 'director123' };
                    break;
                case 'admin':
                    userCredentials = { email: MOCK_USER_ADMIN.email, pass: 'admin123' };
                    break;
                default:
                    throw new Error('Rol de usuario no válido para inicio rápido.');
            }
            
            const user = await login(userCredentials.email, userCredentials.pass);
            
            switch (user.role) {
                case 'alumno': navigate('/app/dashboard'); break;
                case 'docente': navigate('/docente/dashboard'); break;
                case 'director': navigate('/director/dashboard'); break;
                case 'admin': navigate('/admin/dashboard'); break;
                default: navigate('/');
            }

        } catch (err: any) {
            setError(err.message || `Error al iniciar sesión como ${role}.`);
        }
    };
    
  return (
    <AuthLayout title="Iniciar Sesión">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center font-medium"
          >
            {error}
          </motion.div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-text-primary mb-2">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            className="block w-full px-4 py-3 bg-surface-2 border-2 border-border focus:border-primary rounded-xl shadow-sm transition-all duration-300 text-text-primary placeholder:text-text-secondary/50 focus:ring-2 focus:ring-primary/20" 
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-bold text-text-primary mb-2">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            className="block w-full px-4 py-3 bg-surface-2 border-2 border-border focus:border-primary rounded-xl shadow-sm transition-all duration-300 text-text-primary placeholder:text-text-secondary/50 focus:ring-2 focus:ring-primary/20" 
            placeholder="••••••••"
          />
        </div>
        <div className="text-right">
            <motion.a 
              whileHover={{ x: 3 }}
              href="#" 
              className="text-sm text-primary hover:underline font-semibold inline-flex items-center gap-1"
            >
              ¿Olvidaste tu contraseña? →
            </motion.a>
        </div>
        <PrimaryButton type="submit" className="w-full !mt-6" loading={loading} disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Entrar a la Plataforma'}
        </PrimaryButton>
        <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-border/50"></div>
            <span className="flex-shrink mx-4 text-xs text-text-secondary font-bold uppercase tracking-wider">Demo Rápido</span>
            <div className="flex-grow border-t border-border/50"></div>
        </div>
        
        {/* Profesores */}
        <div className="space-y-2 mb-4">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-3">👨‍🏫 Profesores - Colegio TutoriA</p>
          <div className="grid grid-cols-1 gap-2">
            {/* Profesor Juan */}
            <motion.div whileHover={{ scale: 1.01, x: 4 }} whileTap={{ scale: 0.98 }}>
              <button 
                type="button" 
                onClick={() => handleLoginAs('docente')} 
                disabled={loading}
                className="w-full p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 hover:border-green-500/60 rounded-xl transition-all duration-300 disabled:opacity-50 group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">👨‍�</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-black text-text-primary">Juan Martínez</span>
                      <span className="px-2 py-0.5 rounded-md bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-bold">PROFESOR</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-secondary">
                      <span>📚 Matemáticas & Física</span>
                      <span>� 4 grupos</span>
                      <span>⭐ 15,000 XP</span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Alumnos por nivel educativo */}
        <div className="space-y-2 mb-4">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-3">🎓 Estudiantes - Secundaria</p>
          <div className="grid grid-cols-1 gap-2">
            {/* Carlos - 3A Matemáticas */}
            <motion.div whileHover={{ scale: 1.01, x: 4 }} whileTap={{ scale: 0.98 }}>
              <button 
                type="button" 
                onClick={() => handleLoginAs('alumno', 'secundaria')} 
                disabled={loading}
                className="w-full p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 hover:border-blue-500/60 rounded-xl transition-all duration-300 disabled:opacity-50 group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">�</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-black text-text-primary">Carlos Mendoza</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold">3A</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-secondary">
                      <span>📚 Matemáticas</span>
                      <span>⭐ 1,050 XP</span>
                      <span>🏅 3 medallas</span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>

            {/* Ana - 3B Ciencias */}
            <motion.div whileHover={{ scale: 1.01, x: 4 }} whileTap={{ scale: 0.98 }}>
              <button 
                type="button" 
                onClick={() => handleLoginAs('alumno', 'secundaria')} 
                disabled={loading}
                className="w-full p-3 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border-2 border-cyan-500/30 hover:border-cyan-500/60 rounded-xl transition-all duration-300 disabled:opacity-50 group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">�</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-black text-text-primary">Ana López</span>
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold">3B</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-secondary">
                      <span>� Ciencias</span>
                      <span>⭐ 890 XP</span>
                      <span>🏅 2 medallas</span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>

            {/* Luis - 3C Química */}
            <motion.div whileHover={{ scale: 1.01, x: 4 }} whileTap={{ scale: 0.98 }}>
              <button 
                type="button" 
                onClick={() => handleLoginAs('alumno', 'secundaria')} 
                disabled={loading}
                className="w-full p-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-2 border-emerald-500/30 hover:border-emerald-500/60 rounded-xl transition-all duration-300 disabled:opacity-50 group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">⚗️</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-black text-text-primary">Luis Fernández</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">3C</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-secondary">
                      <span>📚 Química</span>
                      <span>⭐ 1,200 XP</span>
                      <span>🏅 4 medallas</span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Preparatoria */}
        <div className="space-y-2 mb-4">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-3">🎓 Estudiantes - Preparatoria</p>
          <div className="grid grid-cols-1 gap-2">
            {/* María - 6A Física */}
            <motion.div whileHover={{ scale: 1.01, x: 4 }} whileTap={{ scale: 0.98 }}>
              <button 
                type="button" 
                onClick={() => handleLoginAs('alumno', 'preparatoria')} 
                disabled={loading}
                className="w-full p-3 bg-gradient-to-r from-purple-500/10 to-violet-500/10 border-2 border-purple-500/30 hover:border-purple-500/60 rounded-xl transition-all duration-300 disabled:opacity-50 group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">�</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-black text-text-primary">María Rodríguez</span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold">6A</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-secondary">
                      <span>📚 Física</span>
                      <span>⭐ 2,340 XP</span>
                      <span>🏅 8 medallas</span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>

            {/* Pedro - 6B Matemáticas */}
            <motion.div whileHover={{ scale: 1.01, x: 4 }} whileTap={{ scale: 0.98 }}>
              <button 
                type="button" 
                onClick={() => handleLoginAs('alumno', 'preparatoria')} 
                disabled={loading}
                className="w-full p-3 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border-2 border-indigo-500/30 hover:border-indigo-500/60 rounded-xl transition-all duration-300 disabled:opacity-50 group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-black text-text-primary">Pedro Sánchez</span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold">6B</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-secondary">
                      <span>📚 Matemáticas</span>
                      <span>⭐ 1,980 XP</span>
                      <span>🏅 6 medallas</span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>

            {/* Laura - 6C Química */}
            <motion.div whileHover={{ scale: 1.01, x: 4 }} whileTap={{ scale: 0.98 }}>
              <button 
                type="button" 
                onClick={() => handleLoginAs('alumno', 'preparatoria')} 
                disabled={loading}
                className="w-full p-3 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-2 border-pink-500/30 hover:border-pink-500/60 rounded-xl transition-all duration-300 disabled:opacity-50 group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🧪</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-black text-text-primary">Laura Martínez</span>
                      <span className="px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold">6C</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-secondary">
                      <span>� Química</span>
                      <span>⭐ 2,150 XP</span>
                      <span>🏅 7 medallas</span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Otros roles */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-3">⚙️ Administración</p>
          <div className="grid grid-cols-2 gap-2">
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
              <button 
                type="button" 
                onClick={() => handleLoginAs('director')} 
                disabled={loading}
                className="w-full p-3 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border-2 border-indigo-500/30 hover:border-indigo-500/60 rounded-xl transition-all duration-300 disabled:opacity-50"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg shadow-md">
                    <Building2 size={18} className="text-white"/>
                  </div>
                  <span className="text-xs font-bold text-text-primary">Director</span>
                </div>
              </button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
              <button 
                type="button" 
                onClick={() => handleLoginAs('admin')} 
                disabled={loading}
                className="w-full p-3 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-2 border-orange-500/30 hover:border-orange-500/60 rounded-xl transition-all duration-300 disabled:opacity-50"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-md">
                    <Shield size={18} className="text-white"/>
                  </div>
                  <span className="text-xs font-bold text-text-primary">Super Admin</span>
                </div>
              </button>
            </motion.div>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};