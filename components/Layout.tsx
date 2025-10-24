import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Home, Compass, MessageSquare, BarChart2, CheckSquare, Trophy, Settings, Shield, Users, FileText, Key, BarChart, Mail, Power, Menu, X, BrainCircuit, Bot, SlidersHorizontal, Brain, PanelLeftClose, PanelLeftOpen, Library, LayoutDashboard, Calendar, Star, Send, Play, Pause, Coffee, Clock, BookCopy, UsersRound, ClipboardPenLine, LayoutGrid, Banknote, Building, School, BarChart3, Sun, Moon, ChevronLeft, GraduationCap, CheckCircle } from 'lucide-react';
import type { User, UserPreferences } from '../types';
import { PrimaryButton, SecondaryButton } from './ui';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useSidebar } from '../contexts/SidebarContext';
import StudyTimerWidget from './StudyTimerWidget';
import Breadcrumbs from './Breadcrumbs';
import UnifiedAssistant from './UnifiedAssistant';
import OnboardingTour from './OnboardingTour';


const Logo: React.FC<{ isCollapsed?: boolean }> = ({ isCollapsed = false }) => (
    <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
        <BrainCircuit className="h-8 w-8 text-white flex-shrink-0" />
        <AnimatePresence>
            {!isCollapsed && (
                <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-xl font-bold text-white tracking-tight whitespace-nowrap">
                    TutoriA Academy
                </motion.span>
            )}
        </AnimatePresence>
    </div>
);

// NEW THEME TOGGLE
const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-1/80 text-text-secondary hover:text-text-primary transition-colors border border-border"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </motion.div>
            </AnimatePresence>
        </button>
    );
};


// PUBLIC LAYOUT
export const PublicLayout: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navLinks = [
        { name: 'Inicio', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: 'Ayuda', path: '/ayuda' },
    ];
    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <NavLink to="/">
                          <div className="flex items-center gap-3">
                              <BrainCircuit className="h-8 w-8 text-primary flex-shrink-0" />
                              <span className="text-xl font-bold text-text-primary tracking-tight whitespace-nowrap">
                                  TutoriA Academy
                              </span>
                          </div>
                        </NavLink>
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map(link => (
                                <NavLink key={link.name} to={link.path} className={({ isActive }) => `text-sm font-medium transition-colors duration-fast hover:text-primary ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <ThemeToggle />
                            <PrimaryButton><NavLink to="/login">Iniciar sesión</NavLink></PrimaryButton>
                        </div>
                        <div className="md:hidden flex items-center gap-4">
                             <ThemeToggle />
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-text-secondary hover:text-text-primary">
                                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </nav>
                {isMenuOpen && (
                    <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-background/80 backdrop-blur-md border-t border-border">
                        {navLinks.map(link => (
                            <NavLink key={link.name} to={link.path} onClick={()=>setIsMenuOpen(false)} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-surface-2 hover:text-primary ${isActive ? 'text-primary bg-surface-2' : 'text-text-secondary'}`}>
                                {link.name}
                            </NavLink>
                        ))}
                        <div className="border-t border-border pt-4 space-y-2">
                             <PrimaryButton className="w-full"><NavLink to="/login" onClick={()=>setIsMenuOpen(false)}>Iniciar Sesión</NavLink></PrimaryButton>
                        </div>
                    </div>
                )}
            </header>
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

const Footer: React.FC = () => (
    <footer className="bg-background border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center gap-3">
                    <BrainCircuit className="h-8 w-8 text-primary flex-shrink-0" />
                    <span className="text-xl font-bold text-text-primary tracking-tight whitespace-nowrap">
                        TutoriA Academy
                    </span>
                </div>
                <div className="flex space-x-6 text-sm">
                    <NavLink to="/terminos" className="text-text-secondary hover:text-primary">Términos</NavLink>
                    <NavLink to="/privacidad" className="text-text-secondary hover:text-primary">Privacidad</NavLink>
                    <NavLink to="/contacto" className="text-text-secondary hover:text-primary">Contacto</NavLink>
                </div>
                <p className="text-sm text-text-secondary">&copy; {new Date().getFullYear()} TutoriA Academy.</p>
            </div>
        </div>
    </footer>
);


// STUDENT LAYOUT
const studentNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
    { icon: BookCopy, label: 'Mis Materias', path: '/app/materias' },
    { icon: MessageSquare, label: 'Tutor', path: '/app/chat' },
    { icon: Library, label: 'Biblioteca', path: '/app/biblioteca' },
    { icon: Calendar, label: 'Agenda', path: '/app/agenda' },
    { icon: BarChart2, label: 'Mi Progreso', path: '/app/progreso' },
    { icon: Brain, label: 'Gimnasio Cognitivo', path: '/app/juegos' },
    { icon: Trophy, label: 'Liga Escolar', path: '/app/ranking' },
];

const StudentSidebar: React.FC = () => {
    const location = useLocation();
    const { isCollapsed, toggleSidebar, isMobileOpen, setMobileOpen } = useSidebar();

    const navLinkClasses = (path: string) => `group flex items-center p-3 rounded-lg transition-colors duration-fast ${ isCollapsed ? 'justify-center' : ''} ${location.pathname.startsWith(path) ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-surface-2'}`;

    return (
        <aside
            className={`fixed top-0 left-0 z-40 h-screen bg-surface-1 border-r border-border flex flex-col transition-all duration-normal ease-out ${ isMobileOpen ? 'translate-x-0' : '-translate-x-full' } lg:translate-x-0 ${ isCollapsed ? 'w-20' : 'w-64' }`}
        >
            <div className={`h-20 flex items-center shrink-0 border-b border-border ${ isCollapsed ? 'px-2' : 'px-6'}`}>
                 <NavLink to="/app/dashboard">
                    <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                        <BrainCircuit className="h-8 w-8 text-primary flex-shrink-0" />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-xl font-bold text-text-primary tracking-tight whitespace-nowrap">
                                    TutoriA Academy
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </NavLink>
            </div>

            <nav className="flex-grow flex flex-col no-scrollbar overflow-y-auto px-4 py-6 space-y-2">
                {studentNavItems.map(item => (
                    <NavLink key={item.label} to={item.path} onClick={() => setMobileOpen(false)}
                        className={navLinkClasses(item.path)} title={item.label}>
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <AnimatePresence>
                        {!isCollapsed && (
                             <motion.span 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                                className="font-medium whitespace-nowrap ml-3">
                                {item.label}
                            </motion.span>
                        )}
                        </AnimatePresence>
                    </NavLink>
                ))}
            </nav>

            <div className="shrink-0 p-4 border-t border-border space-y-2">
                 <NavLink to="/app/configuracion" onClick={() => setMobileOpen(false)} className={navLinkClasses('/app/configuracion')} title="Configuración">
                    <Settings className="h-5 w-5 flex-shrink-0" />
                     {!isCollapsed && <span className="font-medium whitespace-nowrap ml-3">Configuración</span>}
                </NavLink>
                <button 
                    onClick={toggleSidebar}
                    className="hidden lg:flex items-center w-full p-3 rounded-lg text-text-secondary hover:bg-surface-2"
                >
                    {isCollapsed ? <PanelLeftOpen className="h-5 w-5 mx-auto"/> : <PanelLeftClose className="h-5 w-5"/>}
                    {!isCollapsed && <span className="font-medium whitespace-nowrap ml-3 text-sm">Colapsar</span>}
                </button>
            </div>
        </aside>
    );
}

const ProfileDropdown: React.FC<{ user: User | null, onLogout: () => void }> = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-3">
                <span className="font-semibold text-text-primary hidden sm:block">{user?.name}</span>
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white ring-2 ring-white/50">
                    {user?.name?.charAt(0)}
                </div>
            </button>

            <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-14 right-0 w-56 mt-2 origin-top-right bg-surface-1 rounded-input border border-border shadow-card z-50"
                >
                    <div className="p-2">
                        <div className="px-3 py-2">
                            <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
                            <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                        </div>
                        <div className="border-t border-border/40 my-1"></div>
                        <NavLink to={'/app/configuracion'} onClick={() => setIsOpen(false)} className="flex items-center w-full px-3 py-2 text-sm text-text-secondary rounded-md hover:bg-surface-2 hover:text-text-primary">
                            <Settings className="w-4 h-4 mr-2" />
                            Configuración
                        </NavLink>
                        <button onClick={() => { onLogout(); setIsOpen(false); }} className="flex items-center w-full px-3 py-2 text-sm text-red-500 rounded-md hover:bg-red-500/10">
                            <Power className="w-4 h-4 mr-2" />
                            Cerrar Sesión
                        </button>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

export const StudentLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { isCollapsed, isMobileOpen, setMobileOpen } = useSidebar();
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Detectar si es la primera vez del usuario
    useEffect(() => {
        if (user) {
            const hasSeenOnboarding = localStorage.getItem(`onboarding:${user.id}:seen`);
            if (!hasSeenOnboarding) {
                setShowOnboarding(true);
            }
        }
    }, [user]);

    const handleOnboardingComplete = () => {
        if (user) {
            localStorage.setItem(`onboarding:${user.id}:seen`, 'true');
        }
        setShowOnboarding(false);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background">
            <StudentSidebar />
            <div className={`flex flex-col min-h-screen transition-all duration-normal ease-out lg:pl-64 ${ isCollapsed ? 'lg:!pl-20' : 'lg:!pl-64' }`}>
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
                    <button onClick={() => setMobileOpen(!isMobileOpen)} className="text-text-secondary lg:hidden">
                        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    
                    {/* Breadcrumbs - hidden on mobile */}
                    <div className="hidden md:block">
                        <Breadcrumbs />
                    </div>
                    
                    <div className="relative ml-auto flex items-center gap-4">
                        <ThemeToggle />
                        <ProfileDropdown user={user} onLogout={handleLogout} />
                    </div>
                </header>
                <main className="flex-grow p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
            <StudyTimerWidget />
            {/* Temporalmente deshabilitado para evitar errores de render por dependencias del usuario */}
            {/* <UnifiedAssistant /> */}
            {/* OnboardingTour desactivado - ayuda integrada en chat */}
            {/* {showOnboarding && (
                <OnboardingTour
                    onComplete={handleOnboardingComplete}
                    onDismiss={handleOnboardingComplete}
                />
            )} */}
        </div>
    );
};


// --- B2B LAYOUTS ---

// TEACHER LAYOUT
const teacherNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/docente/dashboard' },
    { icon: UsersRound, label: 'Mis Grupos', path: '/docente/grupos' },
    { icon: BrainCircuit, label: 'Copiloto IA', path: '/docente/copiloto' },
    { icon: FileText, label: 'Banco de Preguntas', path: '/docente/banco-preguntas' },
    { icon: ClipboardPenLine, label: 'Exámenes', path: '/docente/examenes' },
    { icon: CheckCircle, label: 'Calificaciones', path: '/docente/calificaciones' },
    { icon: BarChart2, label: 'Resultados', path: '/docente/resultados' },
];

export const TeacherLayout: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // ULTRA MINIMALISTA - sin dependencias que puedan fallar
    const navLinkClasses = (path: string) => `group flex items-center p-3 px-4 gap-4 rounded-lg transition-colors duration-fast ease-in-out justify-start ${location.pathname.startsWith(path) ? 'bg-primary/20 text-primary font-semibold' : 'text-text-secondary hover:bg-surface-2'}`;
    const iconClasses = (path: string) => `h-5 w-5 transition-colors flex-shrink-0 ${location.pathname.startsWith(path) ? 'text-primary' : 'text-text-secondary group-hover:text-text-primary'}`;

    return (
        <div className="min-h-screen bg-background">
            <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 bg-surface-1 border-r border-border flex flex-col w-64`}>
                <div className="h-20 flex items-center shrink-0 border-b border-border px-6">
                    <div className="flex items-center gap-3">
                        <BrainCircuit className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold text-text-primary tracking-tight">TutoriA Academy</span>
                    </div>
                </div>
                <nav className="flex-grow px-4 py-6 space-y-2">
                    {teacherNavItems.map(item => (
                        <NavLink key={item.label} to={item.path} onClick={() => setSidebarOpen(false)} className={navLinkClasses(item.path)}>
                            <item.icon className={iconClasses(item.path)} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="shrink-0 p-4 border-t border-border">
                    <button onClick={handleLogout} className="flex items-center p-3 px-4 gap-4 w-full rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-colors group justify-start">
                        <Power className="h-5 w-5" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
            <div className={`flex flex-col min-h-screen lg:pl-64`}>
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-text-secondary lg:hidden">
                        <Menu size={20} />
                    </button>
                    
                    <div className="hidden md:block">
                        <span className="text-sm text-text-secondary">Dashboard del Profesor</span>
                    </div>
                    
                    <div className="relative ml-auto flex items-center gap-4">
                        <ThemeToggle />
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-text-primary hidden sm:block">Profesor</span>
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white ring-2 ring-white/50">
                                P
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-grow p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

// DIRECTOR/ADMIN LAYOUT
const directorNavItems = [
    { icon: LayoutGrid, label: 'Dashboard General', path: '/director/dashboard' },
    { icon: Building, label: 'Gestión de Escuela', path: '/director/escuela' },
    { icon: Users, label: 'Docentes', path: '/director/docentes' },
    { icon: GraduationCap, label: 'Alumnos', path: '/director/alumnos' },
    { icon: BarChart3, label: 'Análisis Académico', path: '/director/analisis' },
    { icon: Banknote, label: 'Suscripción', path: '/director/suscripcion' },
];

export const DirectorLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navLinkClasses = (path: string) => `group flex items-center p-3 px-4 gap-4 rounded-lg transition-colors duration-fast ease-in-out justify-start ${location.pathname.startsWith(path) ? 'bg-primary/20 text-primary font-semibold' : 'text-text-secondary hover:bg-surface-2'}`;
    const iconClasses = (path: string) => `h-5 w-5 transition-colors flex-shrink-0 ${location.pathname.startsWith(path) ? 'text-primary' : 'text-text-secondary group-hover:text-text-primary'}`;


    return (
        <div className="flex h-screen bg-background">
            <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 bg-surface-1 border-r border-border flex flex-col`}>
                <div className="h-20 flex items-center shrink-0 border-b border-border px-6">
                    <div className="flex items-center gap-3">
                        <BrainCircuit className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold text-text-primary tracking-tight">TutoriA Academy</span>
                    </div>
                </div>
                <nav className="flex-grow px-4 py-6 space-y-2">
                    {directorNavItems.map(item => (
                        <NavLink key={item.label} to={item.path}
                            className={navLinkClasses(item.path)}>
                            <item.icon className={iconClasses(item.path)} />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-border">
                    <button onClick={handleLogout} className="flex items-center p-3 px-4 gap-4 w-full rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-colors group justify-start">
                        <Power className="h-5 w-5" />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
                     <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-text-secondary md:hidden">
                        <Menu size={20} />
                    </button>
                    <div className="relative ml-auto flex items-center gap-4">
                        <ThemeToggle />
                        <ProfileDropdown user={user} onLogout={handleLogout} />
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

// --- NEW ADMIN LAYOUT ---
const adminNavItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Usuarios', path: '/admin/usuarios' },
    { icon: FileText, label: 'Documentos', path: '/admin/documentos' },
    { icon: SlidersHorizontal, label: 'Tutores IA', path: '/admin/tutores' },
    { icon: BarChart3, label: 'Métricas', path: '/admin/metricas' },
    { icon: Mail, label: 'Emails', path: '/admin/emails' },
    { icon: Key, label: 'APIs', path: '/admin/apis' },
];

export const AdminLayout: React.FC = () => {
    const { user, userData, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navLinkClasses = (path: string) => `group flex items-center p-3 px-4 gap-4 rounded-lg transition-colors duration-fast ease-in-out justify-start ${location.pathname.startsWith(path) ? 'bg-primary/20 text-primary font-semibold' : 'text-text-secondary hover:bg-surface-2'}`;
    const iconClasses = (path: string) => `h-5 w-5 transition-colors flex-shrink-0 ${location.pathname.startsWith(path) ? 'text-primary' : 'text-text-secondary group-hover:text-text-primary'}`;

    return (
        <div className="min-h-screen bg-background">
             <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 bg-surface-1 border-r border-border flex flex-col w-64`}>
                <div className="h-20 flex items-center shrink-0 border-b border-border px-6">
                    <div className="flex items-center gap-3">
                        <BrainCircuit className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold text-text-primary tracking-tight">TutoriA Admin</span>
                    </div>
                </div>
                <nav className="flex-grow px-4 py-6 space-y-2 no-scrollbar overflow-y-auto">
                    {adminNavItems.map(item => (
                        <NavLink key={item.label} to={item.path} onClick={() => setSidebarOpen(false)} className={navLinkClasses(item.path)}>
                            <item.icon className={iconClasses(item.path)} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                 <div className="shrink-0 p-4 border-t border-border">
                    <button onClick={handleLogout} className="flex items-center p-3 px-4 gap-4 w-full rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-colors group justify-start">
                        <Power className="h-5 w-5" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
            <div className={`flex flex-col min-h-screen lg:pl-64`}>
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
                     <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-text-secondary lg:hidden">
                        <Menu size={20} />
                    </button>
                    <div className="relative ml-auto flex items-center gap-4">
                        <ThemeToggle />
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-text-primary hidden sm:block">{userData?.nombre || 'Admin'}</span>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent-a flex items-center justify-center font-bold text-white ring-2 ring-surface-2">
                                {userData?.nombre?.charAt(0) || 'A'}
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-grow p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};


// Backward compatibility export
export const AdminLayout_DEPRECATED = DirectorLayout;