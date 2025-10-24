import React from 'react';
import type { DashboardInsights } from '../../types';
import { Card } from '../ui';
import { BrainCircuit, Star, Calendar, MessageSquare } from 'lucide-react';

interface KeyInsightsCardProps {
    data: DashboardInsights['keyInsights'];
    userName: string;
}

const KeyInsightsCard: React.FC<KeyInsightsCardProps> = ({ data, userName }) => {
    return (
        <Card className="flex flex-col justify-between">
            <div>
                <h2 className="text-3xl font-bold text-white">¡Hola de nuevo, {userName}!</h2>
                <p className="text-text-secondary mt-2">“Un viaje de mil millas comienza con un solo paso.”</p>
            </div>
            <div className="mt-4 border-t border-border pt-4">
                 <h3 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                    <BrainCircuit size={18} className="text-purple" /> Análisis de la IA
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-surface p-3 rounded-lg">
                        <Star className="mx-auto text-accent mb-1" size={20} />
                        <p className="text-xl font-bold text-white">{data.topicsMastered}</p>
                        <p className="text-xs text-text-secondary">Temas Dominados</p>
                    </div>
                     <div className="bg-surface p-3 rounded-lg">
                        <Calendar className="mx-auto text-accent mb-1" size={20} />
                        <p className="text-xl font-bold text-white">{data.bestDay}</p>
                        <p className="text-xs text-text-secondary">Día más Productivo</p>
                    </div>
                    <div className="bg-surface p-3 rounded-lg sm:col-span-3">
                         <MessageSquare className="mx-auto text-accent mb-1" size={20} />
                         <p className="text-xs text-text-primary">{data.personalizedTip}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default KeyInsightsCard;