import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Opportunity } from '../../types';
import { Card } from '../ui';
import { TrendingUp, BookOpen, Brain, ArrowRight } from 'lucide-react';

interface ActionableOpportunitiesCardProps {
    opportunities: Opportunity[];
}

const ActionableOpportunitiesCard: React.FC<ActionableOpportunitiesCardProps> = ({ opportunities }) => {
    const navigate = useNavigate();

    if (opportunities.length === 0) {
        return (
            <Card>
                <h3 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                    <TrendingUp size={18} className="text-accent" /> Áreas de Oportunidad
                </h3>
                <p className="text-sm text-text-secondary text-center py-4">
                    ¡Excelente trabajo! No hemos detectado áreas de oportunidad significativas por ahora.
                </p>
            </Card>
        );
    }
    
    return (
        <Card>
            <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-accent" /> Tus 3 Principales Áreas de Oportunidad
            </h3>
            <div className="space-y-4">
                {opportunities.map((op) => (
                    <div key={op.area} className="p-3 bg-surface/50 rounded-lg border border-border">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-text-primary capitalize">{op.area}</p>
                            <span className="text-sm font-bold text-yellow-400">
                                {Math.round(op.accuracy)}% Precisión
                            </span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 mt-3">
                            {op.recommendedActions.map(action => (
                                <button
                                    key={action.label}
                                    onClick={() => navigate(action.path, { state: action.state })}
                                    className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold p-2 bg-surface border border-border rounded-md hover:bg-cyan hover:text-bg transition-colors"
                                >
                                    {action.type === 'learn' ? <BookOpen size={14}/> : <Brain size={14} />}
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default ActionableOpportunitiesCard;