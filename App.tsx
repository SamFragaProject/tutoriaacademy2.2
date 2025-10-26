

import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout, StudentLayout, TeacherLayout, DirectorLayout, AdminLayout } from './components/Layout';
import { HomePage, BlogIndexPage, BlogPostPage, HelpPage, LegalPage } from './pages/PublicPages';
import { LoginPage } from './src/pages/LoginPage';
import { DashboardPage, SubjectsPage, SyllabusPage, AgendaPage, StatisticsPage, TutorPage, DiagnosisPage, PracticesPage, SimulacroPage, RankingPage, ConfigurationPage, GamesPage, GeneratingPlanPage, OnboardingPage, LibraryPage, ExamPage } from './pages/StudentPages';
import { TeacherDashboardPage, GroupsPage, QuestionBankPage, TeacherExamsPage, TeacherResultsPage, TutorCopilotPage, ScreeningPage, GradingPage, AIExamCreatorPage, TaskManagerPage, CommunicationHubPage, ContentManagementPage } from './pages/TeacherPages';
import { DirectorDashboardPage, SchoolManagementPage, TeachersPage, AcademicAnalysisPage, SubscriptionPage, StudentsPage } from './pages/DirectorPages';
import { AdminHomePage, UsersPage, DocumentsPage, TutorsPage, MetricsPage, EmailsPage, ApisPage } from './pages/AdminPages';
// Nuevas páginas admin con Supabase
import { AdminDashboardPage, AdminUsersPage, AdminSchoolsPage } from './pages/admin';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastContainer, useToast } from './components/Toast';
import { on } from './services/eventBus';
import type { MetaAchievement } from './types';
import MetaAchievementToast from './components/MetaAchievementToast';
import { OnboardingB2BPage } from './pages/OnboardingB2BPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NeoDashboardPage } from './pages/NeoDashboardPage';


const AppContent: React.FC = () => {
  const { addToast } = useToast();
  console.log('📱 AppContent rendering');

  useEffect(() => {
    console.log('📱 AppContent mounted');
    const unsubscribe = on('meta-achievement-unlocked', (unlockedAchievement: MetaAchievement) => {
      console.log('Event meta-achievement-unlocked received in App.tsx', unlockedAchievement);
      addToast(<MetaAchievementToast achievement={unlockedAchievement} />);
    });
    return () => unsubscribe();
  }, [addToast]);

  console.log('📱 AppContent returning HashRouter');
  return (
     <HashRouter>
      <Routes>
        {/* Public Pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/ayuda" element={<HelpPage />} />
          <Route path="/terminos" element={<LegalPage type="terms" />} />
          <Route path="/privacidad" element={<LegalPage type="privacy" />} />
          <Route path="/contacto" element={<LegalPage type="contact" />} />
        </Route>

        {/* Neo-Glass Pastel Demo (public, no deps) */}
        <Route path="/neo" element={<NeoDashboardPage />} />

        {/* Auth Pages */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* B2B Onboarding */}
        <Route path="/setup" element={<OnboardingB2BPage />} />

        {/* Student Pages */}
        <Route path="/app" element={<ProtectedRoute requiredRole="alumno"><StudentLayout /></ProtectedRoute>}>
          <Route path="onboarding" element={<OnboardingPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="materias" element={<SubjectsPage />} />
          <Route path="materias/:subjectName" element={<SyllabusPage />} />
          <Route path="agenda" element={<AgendaPage />} />
          <Route path="progreso" element={<StatisticsPage />} />
          {/* FIX: Changed path to 'chat' to match sidebar navigation and fixed component name. */}
          <Route path="chat" element={<TutorPage />} />
          <Route path="juegos" element={<GamesPage />} />
          <Route path="diagnostico" element={<DiagnosisPage />} />
          <Route path="generating-plan" element={<GeneratingPlanPage />} />
          <Route path="practicas" element={<PracticesPage />} />
          <Route path="simulacro" element={<SimulacroPage />} />
          <Route path="ranking" element={<RankingPage />} />
          <Route path="configuracion" element={<ConfigurationPage />} />
          <Route path="biblioteca" element={<LibraryPage />} />
          <Route path="exam/:examId" element={<ExamPage />} />
          <Route index element={<Navigate to="dashboard" />} />
        </Route>

        {/* Teacher Pages */}
        <Route path="/docente" element={<ProtectedRoute requiredRole="profesor"><ErrorBoundary><TeacherLayout /></ErrorBoundary></ProtectedRoute>}>
          <Route path="dashboard" element={<ErrorBoundary><TeacherDashboardPage /></ErrorBoundary>} />
          <Route path="grupos" element={<GroupsPage />} />
          <Route path="banco-preguntas" element={<QuestionBankPage />} />
          <Route path="examenes" element={<TeacherExamsPage />} />
          <Route path="calificaciones" element={<GradingPage />} />
          <Route path="resultados" element={<TeacherResultsPage />} />
          <Route path="copiloto" element={<TutorCopilotPage />} />
          <Route path="screening" element={<ScreeningPage />} />
          <Route path="crear-examen-ia" element={<AIExamCreatorPage />} />
          <Route path="tareas" element={<TaskManagerPage />} />
          <Route path="comunicacion" element={<CommunicationHubPage />} />
          <Route path="contenido" element={<ContentManagementPage />} />
          <Route index element={<Navigate to="dashboard" />} />
        </Route>
        
        {/* Director Pages */}
                {/* Director Pages */}
        <Route path="/director" element={<ProtectedRoute requiredRole="director"><DirectorLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<DirectorDashboardPage />} />
            <Route path="escuela" element={<SchoolManagementPage />} />
            <Route path="profesores" element={<TeachersPage />} />
            <Route path="estudiantes" element={<StudentsPage />} />
            <Route path="analisis" element={<AcademicAnalysisPage />} />
            <Route path="suscripcion" element={<SubscriptionPage />} />
            <Route index element={<Navigate to="dashboard" />} />
        </Route>

        {/* Admin Pages */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
            <Route path="inicio" element={<AdminHomePage />} />
            {/* Nuevas páginas admin con Supabase */}
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="usuarios-new" element={<AdminUsersPage />} />
            <Route path="escuelas" element={<AdminSchoolsPage />} />
            {/* Páginas admin antiguas */}
            <Route path="usuarios" element={<UsersPage />} />
            <Route path="documentos" element={<DocumentsPage />} />
            <Route path="tutores" element={<TutorsPage />} />
            <Route path="metricas" element={<MetricsPage />} />
            <Route path="correos" element={<EmailsPage />} />
            <Route path="apis" element={<ApisPage />} />
            <Route index element={<Navigate to="inicio" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
}


const App: React.FC = () => {
  console.log('🚀 App component rendering');
  
  return (
    <ErrorBoundary>
      <AppContent />
      <ToastContainer />
    </ErrorBoundary>
  );
};

export default App;