import React from 'react';
import { Card, SecondaryButton } from '../../ui';
import { HelpCircle } from 'lucide-react';

const GUIDE_STEPS = ['Diagnóstico', 'Aprender', 'Practicar', 'Evaluar', 'Cierre'];
const GUIDE_TIPS = [
    "Responde honestamente para evaluar tu nivel inicial en este tema.", "Lee con atención la explicación y el ejemplo. Anota tus dudas.", "Intenta resolver sin pistas. Usa tu nivel de confianza para medir tu seguridad.", "Aplica lo aprendido. Estas preguntas miden tu comprensión final de la sesión.", "Revisa tu progreso y los temas recomendados para tu próxima sesión."
];

interface GuidePanelProps {
  currentStepIndex: number;
}

const GuidePanel: React.FC<GuidePanelProps> = ({ currentStepIndex }) => {
    const [showTip, setShowTip] = React.useState(false);
    return (
        <Card className="p-4 space-y-4 flex flex-col">
            <div>
                <h3 className="text-sm font-semibold text-text-secondary mb-3">Pasos de la Sesión</h3>
                <ol className="space-y-2.5">
                    {GUIDE_STEPS.map((step, index) => (
                        <li key={step} className={`flex items-center gap-3 text-sm transition-opacity ${index > currentStepIndex ? 'opacity-50' : ''}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border-2 ${index < currentStepIndex ? 'bg-cyan border-cyan text-bg' : index === currentStepIndex ? 'border-cyan text-cyan' : 'border-border bg-surface text-text-secondary'}`}>
                                {index < currentStepIndex ? '✓' : index + 1}
                            </div>
                            <span className={index === currentStepIndex ? 'font-bold text-white' : 'text-text-secondary'}>{step}</span>
                        </li>
                    ))}
                </ol>
            </div>
            <div className="border-t border-border pt-4 mt-auto">
                <h3 className="text-sm font-semibold text-text-secondary">Progreso: Paso {currentStepIndex + 1}/{GUIDE_STEPS.length}</h3>
                <SecondaryButton onClick={() => setShowTip(!showTip)} className="mt-4 w-full text-sm">
                    <HelpCircle size={16} /> Necesito Ayuda
                </SecondaryButton>
                {showTip && (
                    <div className="mt-2 p-3 bg-bg/50 rounded-lg text-xs text-text-secondary border border-border">
                        {GUIDE_TIPS[currentStepIndex]}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default GuidePanel;
