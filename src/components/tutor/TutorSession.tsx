import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, PrimaryButton, SecondaryButton } from '../../../components/ui';
import { Loader2, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import MathMarkdown from '../../../components/MathMarkdown';
import ErrorBanner from '../../../components/ErrorBanner';
import TutorControls from './TutorControls';
import SourcesPlaceholder from './SourcesPlaceholder';

import { getLLMClientForSubject } from '../../services/llm';
import * as prompts from '../../services/tutor/promptTemplates';
import type { TopicInfo } from '../../services/tutor/promptTemplates';
import { track } from '../../shared/telemetry';
import { Type } from '@google/genai';

type SessionStep = 'explain' | 'workedExample' | 'practice' | 'check' | 'reflect';
const STEPS: { name: string, id: SessionStep }[] = [
    { name: 'Explicación', id: 'explain' },
    { name: 'Ejemplo Guiado', id: 'workedExample' },
    { name: 'Práctica', id: 'practice' },
    { name: 'Verificación', id: 'check' },
    { name: 'Reflexión', id: 'reflect' },
];

const practiceQuestionSchema = {
  type: Type.OBJECT,
  properties: {
    questionText: { type: Type.STRING },
    options: { type: Type.ARRAY, items: { type: Type.STRING } },
    correctIndex: { type: Type.INTEGER },
    explanation: { type: Type.STRING }
  },
  required: ["questionText", "options", "correctIndex", "explanation"]
};

interface PracticeQuestion {
    questionText: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

interface SessionContent {
    explanation?: string;
    workedExample?: string;
    practiceQuestion?: PracticeQuestion;
    checkQuestion?: any; // Placeholder
    reflection?: string;
    hint?: string;
}

interface TutorSessionProps {
    topicInfo: TopicInfo;
    onEndSession: () => void;
}

const TutorSession: React.FC<TutorSessionProps> = ({ topicInfo, onEndSession }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [content, setContent] = useState<SessionContent>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [practiceAnswer, setPracticeAnswer] = useState<{ selected: number | null, isCorrect: boolean | null }>({ selected: null, isCorrect: null });
    
    const llmClient = getLLMClientForSubject(topicInfo.subject);

    const fetchContent = useCallback(async (step: SessionStep, context?: any) => {
        setIsLoading(true);
        setError(null);
        track('tutor_fetch_start', { step });
        try {
            let newContent: string | object | null = null;
            switch (step) {
                case 'explain':
                    newContent = await llmClient.generateJson(prompts.getExplanationPrompt(topicInfo), { systemInstruction: 'Eres un tutor experto.', schema: { type: Type.STRING } });
                    setContent(c => ({ ...c, explanation: newContent as string }));
                    break;
                case 'workedExample':
                    newContent = await llmClient.generateJson(prompts.getWorkedExamplePrompt(topicInfo, context.explanation), { systemInstruction: 'Eres un tutor experto que crea ejemplos prácticos.', schema: { type: Type.STRING } });
                    setContent(c => ({ ...c, workedExample: newContent as string }));
                    break;
                case 'practice':
                    newContent = await llmClient.generateJson<PracticeQuestion>(prompts.getPracticeQuestionPrompt(topicInfo), { systemInstruction: 'Eres un creador de preguntas de práctica.', schema: practiceQuestionSchema });
                    setContent(c => ({ ...c, practiceQuestion: newContent as PracticeQuestion }));
                    break;
                // 'check' and 'reflect' would be implemented similarly
                default:
                    console.warn(`Step ${step} not implemented.`);
            }
            track('tutor_fetch_success', { step });
        } catch (err) {
            console.error(err);
            setError(`No se pudo generar el contenido para: ${step}. Por favor, intenta de nuevo.`);
            track('tutor_fetch_error', { step, error: (err as Error).message });
        } finally {
            setIsLoading(false);
        }
    }, [llmClient, topicInfo]);

    useEffect(() => {
        fetchContent('explain');
    }, [fetchContent]);

    const handleNextStep = () => {
        if (currentStepIndex < STEPS.length - 1) {
            const nextStepIndex = currentStepIndex + 1;
            setCurrentStepIndex(nextStepIndex);
            const nextStepId = STEPS[nextStepIndex].id;
            track('tutor_step_next', { from: STEPS[currentStepIndex].id, to: nextStepId });
            
            // Fetch content for the new step if it doesn't exist
            if (!content[nextStepId as keyof SessionContent]) {
                 fetchContent(nextStepId, { explanation: content.explanation });
            }
        } else {
            onEndSession();
        }
    };
    
    const handlePracticeSelection = (selectedIndex: number) => {
        if (practiceAnswer.selected !== null) return; // Already answered
        const isCorrect = selectedIndex === content.practiceQuestion?.correctIndex;
        setPracticeAnswer({ selected: selectedIndex, isCorrect });
        track('tutor_practice_answer', { correct: isCorrect });
    };

    const renderStepContent = () => {
        const currentStep = STEPS[currentStepIndex].id;

        if (isLoading) {
            return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>;
        }
        if (error) {
            return <ErrorBanner message={error} onRetry={() => fetchContent(currentStep, { explanation: content.explanation })} />;
        }

        switch (currentStep) {
            case 'explain':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Explicación</h2>
                        <MathMarkdown content={content.explanation || ''} />
                        <SourcesPlaceholder />
                    </div>
                );
            case 'workedExample':
                 return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Ejemplo Guiado</h2>
                        <MathMarkdown content={content.workedExample || ''} />
                    </div>
                );
            case 'practice':
                const pq = content.practiceQuestion;
                if (!pq) return null;
                return (
                     <div>
                        <h2 className="text-xl font-bold mb-4">Pregunta de Práctica</h2>
                        <MathMarkdown content={pq.questionText} />
                        <div className="space-y-3 mt-4">
                            {pq.options.map((opt, i) => {
                                let stateClass = 'border-border bg-surface-2 hover:border-primary/80';
                                if (practiceAnswer.selected !== null) {
                                    if (i === pq.correctIndex) stateClass = 'border-green-500 bg-green-500/10';
                                    else if (i === practiceAnswer.selected) stateClass = 'border-red-500 bg-red-500/10';
                                    else stateClass = 'opacity-60';
                                }
                                return (
                                    <button key={i} onClick={() => handlePracticeSelection(i)} className={`w-full text-left p-3 border-2 rounded-lg transition-all ${stateClass}`}>
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                        {practiceAnswer.isCorrect !== null && (
                            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="mt-4 p-3 bg-surface-2 rounded-lg text-sm">
                                <p className={`font-semibold ${practiceAnswer.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                    {practiceAnswer.isCorrect ? '¡Correcto!' : 'Respuesta incorrecta.'}
                                </p>
                                <p className="text-text-secondary">{pq.explanation}</p>
                            </motion.div>
                        )}
                    </div>
                );
            default:
                return <div className="text-center text-muted p-8">Paso "{STEPS[currentStepIndex].name}" no implementado.</div>;
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
                <SecondaryButton onClick={onEndSession} className="p-2 h-10 w-10 !rounded-full shrink-0"><ArrowLeft/></SecondaryButton>
                <div>
                    <h1 className="text-2xl font-bold leading-tight">Sesión: {topicInfo.subTopic}</h1>
                    <p className="text-text-secondary text-sm">{topicInfo.subject} / {topicInfo.mainTopic}</p>
                </div>
            </div>
            
            <Card className="flex-grow flex flex-col p-6">
                {/* Stepper */}
                <div className="flex items-center gap-2 mb-6">
                    {STEPS.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${index <= currentStepIndex ? 'border-primary bg-primary/10 text-primary' : 'border-border text-text-secondary'}`}>
                                    {index < currentStepIndex ? <CheckCircle size={16}/> : index + 1}
                                </div>
                                <span className={`text-xs mt-1 ${index <= currentStepIndex ? 'text-text-primary' : 'text-text-secondary'}`}>{step.name}</span>
                            </div>
                            {index < STEPS.length - 1 && <div className={`flex-1 h-0.5 mt-[-1rem] ${index < currentStepIndex ? 'bg-primary' : 'bg-border'}`} />}
                        </React.Fragment>
                    ))}
                </div>

                <div className="flex-grow overflow-y-auto pr-2">
                    <AnimatePresence mode="wait">
                        <motion.div key={currentStepIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            {renderStepContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <TutorControls 
                    step={STEPS[currentStepIndex].id}
                    isLoading={isLoading}
                    onHint={() => {}}
                    onAnotherExample={() => {}}
                    onExplainDifferently={() => {}}
                    onShowSteps={() => {}}
                />

                <div className="mt-6 pt-6 border-t border-border text-right">
                    <PrimaryButton onClick={handleNextStep}>
                        {currentStepIndex === STEPS.length - 1 ? 'Finalizar Sesión' : 'Siguiente Paso'}
                    </PrimaryButton>
                </div>
            </Card>
        </div>
    );
};

export default TutorSession;