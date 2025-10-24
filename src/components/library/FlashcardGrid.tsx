import React, { useState, useEffect, useRef } from 'react';
import type { Flashcard } from '../../services/hooks/srs';
import { motion, AnimatePresence } from 'framer-motion';
import MathMarkdown from '../../../components/MathMarkdown';
import { Library } from 'lucide-react';

interface FlashcardGridProps {
    cards: Flashcard[];
    onSelect?: (card: Flashcard) => void;
}

export const FlashcardGrid: React.FC<FlashcardGridProps> = ({ cards, onSelect }) => {
    const [flipped, setFlipped] = useState<Record<string, boolean>>({});
    const [activeIndex, setActiveIndex] = useState(0);
    const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        cardRefs.current = cardRefs.current.slice(0, cards.length);
        if (activeIndex >= cards.length) {
            setActiveIndex(Math.max(0, cards.length - 1));
        }
    }, [cards, activeIndex]);

    useEffect(() => {
        cardRefs.current[activeIndex]?.focus();
    }, [activeIndex]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!cards.length) return;
        const getColumns = () => {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        };

        switch (e.key) {
            case 'j':
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(i => Math.min(i + getColumns(), cards.length - 1));
                break;
            case 'k':
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(i => Math.max(0, i - getColumns()));
                break;
            case 'l':
            case 'ArrowRight':
                e.preventDefault();
                setActiveIndex(i => Math.min(i + 1, cards.length - 1));
                break;
            case 'h':
            case 'ArrowLeft':
                e.preventDefault();
                setActiveIndex(i => Math.max(0, i - 1));
                break;
            case ' ': // Space bar
                e.preventDefault();
                setFlipped(f => ({ ...f, [cards[activeIndex].id]: !f[cards[activeIndex].id] }));
                break;
            case 'Enter':
                e.preventDefault();
                onSelect?.(cards[activeIndex]);
                break;
        }
    };
    
    if (cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary p-8">
                <Library size={48} className="mb-4 text-muted" />
                <h3 className="font-semibold text-text-primary">No se encontraron flashcards</h3>
                <p className="text-sm">Prueba a ajustar los filtros o crea nuevo material de repaso en tus sesiones de tutoría.</p>
            </div>
        );
    }

    return (
        <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1 focus:outline-none" 
            onKeyDown={handleKeyDown} 
            role="grid"
            tabIndex={0}
        >
            {cards.map((card, index) => {
                const isFlipped = flipped[card.id] || false;
                const isActive = index === activeIndex;
                return (
                    <button
                        key={card.id}
                        ref={el => cardRefs.current[index] = el}
                        onClick={() => setActiveIndex(index)}
                        onDoubleClick={() => setFlipped(f => ({ ...f, [card.id]: !f[card.id] }))}
                        className={`relative aspect-[3/2] focus:outline-none rounded-card ${isActive ? 'ring-2 ring-info ring-offset-2 ring-offset-background' : ''}`}
                        style={{ perspective: 1000 }}
                        role="gridcell"
                        aria-label={`Flashcard: ${card.front.substring(0, 30)}...`}
                    >
                        <motion.div
                            className="absolute inset-0 w-full h-full"
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Card Front */}
                            <div className="absolute inset-0 w-full h-full p-4 flex items-center justify-center text-center bg-surface-1 border border-border rounded-card" style={{ backfaceVisibility: 'hidden' }}>
                                <MathMarkdown content={card.front} />
                            </div>
                            {/* Card Back */}
                            <div className="absolute inset-0 w-full h-full p-4 flex items-center justify-center text-center bg-surface-2 border border-border rounded-card" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                <MathMarkdown content={card.back} />
                            </div>
                        </motion.div>
                    </button>
                );
            })}
        </div>
    );
};

export default FlashcardGrid;