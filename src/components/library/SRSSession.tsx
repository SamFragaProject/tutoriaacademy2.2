import React, { useState, useEffect, useCallback } from 'react';
import { useSRSQueue, useSRSReviewMutation } from '../../services/hooks/srs';
import type { Flashcard } from '../../services/hooks/srs';
import { Loader2, X, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { track } from '../../shared/telemetry';
import MathMarkdown from '../../../components/MathMarkdown';
import { useAuth } from '../../../hooks/useAuth';
import { PrimaryButton } from '../../../components/ui';
import { NavLink } from 'react-router-dom';

interface SRSSessionProps {
    subjectId?: string;
    onExit: () => void;
}

const SRSSession: React.FC<SRSSessionProps> = ({ subjectId, onExit }) => {
    const { user } = useAuth();
    const { data: dueCards, isLoading, isError } = useSRSQueue(user!.id, subjectId);
    const { mutate: reviewCard } = useSRSReviewMutation(user!.id);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        track('srs_start', { subjectId, count: dueCards?.length });
    }, [subjectId, dueCards]);

    const handleReview = useCallback((outcome: 'again' | 'hard' | 'easy') => {
        if (!dueCards || currentIndex >= dueCards.length) return;
        
        reviewCard({ cardId: dueCards[currentIndex].id, outcome });

        if (currentIndex + 1 >= dueCards.length) {
            setIsComplete(true);
            track('srs_complete', { count: dueCards.length });
        } else {
            setCurrentIndex(i => i + 1);
            setIsFlipped(false);
        }
    }, [dueCards, currentIndex, reviewCard]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isComplete) return;
            if (e.key === ' ') {
                e.preventDefault();
                setIsFlipped(f => !f);
            }
            if (isFlipped) {
                if (e.key === '1') handleReview('again');
                if (e.key === '2') handleReview('hard');
                if (e.key === '3') handleReview('easy');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFlipped, handleReview, isComplete]);

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center"><Loader2 className="animate-spin mx-auto text-primary" size={40} /><p className="mt-4">Buscando tarjetas para repasar...</p></div>;
        }
        if (isError) {
            return <div className="text-center text-red-400">Error al cargar las tarjetas. Intenta de nuevo.</div>;
        }
        if (isComplete) {
            return (
                <div className="text-center flex flex-col items-center gap-4">
                    <CheckCircle size={48} className="text-green-400" />
                    <h2 className="text-2xl font-bold">¡Sesión de Repaso Completa!</h2>
                    <p>Has repasado {dueCards?.length} tarjeta(s). ¡Tu memoria te lo agradecerá!</p>
                     <div className="flex gap-4 mt-4">
                        <PrimaryButton onClick={onExit}>Cerrar</PrimaryButton>
                        <NavLink to="/app/biblioteca" onClick={onExit} className="px-6 py-2.5 font-semibold text-text-primary bg-surface-1 rounded-button border border-border">Ir a la Biblioteca</NavLink>
                    </div>
                </div>
            );
        }
        if (!dueCards || dueCards.length === 0) {
            return (
                 <div className="text-center flex flex-col items-center gap-4">
                    <CheckCircle size={48} className="text-green-400" />
                    <h2 className="text-2xl font-bold">¡Todo al día!</h2>
                    <p>No tienes repasos pendientes por ahora. ¡Excelente trabajo!</p>
                    <PrimaryButton onClick={onExit} className="mt-4">Cerrar</PrimaryButton>
                </div>
            )
        }

        const card = dueCards[currentIndex];
        return (
            <>
                <div className="relative aspect-[3/2] w-full max-w-lg mx-auto" style={{ perspective: 1200 }}>
                    <motion.div 
                        className="w-full h-full"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Front */}
                        <div className="absolute inset-0 w-full h-full p-6 flex items-center justify-center text-center bg-surface-1 border border-border rounded-card" style={{ backfaceVisibility: 'hidden' }}>
                            <MathMarkdown content={card.front} />
                        </div>
                        {/* Back */}
                         <div className="absolute inset-0 w-full h-full p-6 flex items-center justify-center text-center bg-surface-2 border border-border rounded-card" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                            <MathMarkdown content={card.back} />
                        </div>
                    </motion.div>
                </div>

                <div className="mt-6 text-center">
                    {!isFlipped ? (
                        <PrimaryButton onClick={() => setIsFlipped(true)}>Mostrar Respuesta (Espacio)</PrimaryButton>
                    ) : (
                        <div className="flex justify-center items-center gap-2 flex-wrap">
                            <button onClick={() => handleReview('again')} className="px-4 py-2 rounded-button bg-red-500/20 text-red-300 border border-red-500/40">1: Repetir</button>
                            <button onClick={() => handleReview('hard')} className="px-4 py-2 rounded-button bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">2: Difícil</button>
                            <button onClick={() => handleReview('easy')} className="px-4 py-2 rounded-button bg-green-500/20 text-green-300 border border-green-500/40">3: Fácil</button>
                        </div>
                    )}
                </div>
            </>
        );
    };

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex flex-col p-4 sm:p-6 lg:p-8" role="dialog" aria-modal="true">
            <header className="flex justify-between items-center text-text-primary mb-4">
                <div className="font-bold">Sesión de Repaso</div>
                {!isComplete && dueCards && dueCards.length > 0 && (
                    <div className="text-sm text-text-secondary">
                        {currentIndex + 1} / {dueCards.length}
                    </div>
                )}
                <button onClick={onExit} aria-label="Cerrar sesión de repaso"><X/></button>
            </header>
            <main className="flex-grow flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default SRSSession;