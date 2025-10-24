import React, { useState, useEffect } from 'react';
import { Card, PrimaryButton, SecondaryButton } from '../../ui';
import { Clock, CheckCircle, Lightbulb, TrendingUp, AlertTriangle, ChevronsRight, Coffee, Award } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import * as agendaSvc from '../../../services/agenda';
import { useStudyTimer } from '../../../contexts/StudyTimerContext';
import { AgendaEvent } from '../../../types';

interface Props {
  sessionData: any;
  onStartExam: () => void;
  onReturnToDashboard: () => void;
}

const NextStepCard: React.FC = () => {
    const { mode: timerMode, timeLeft, isRunning } = useStudyTimer();
    const [nextEvent, setNextEvent] = useState<AgendaEvent | undefined>(undefined);

    useEffect(() => {
      const fetchNextEvent = async () => {
        const agenda = await agendaSvc.getAgenda();
        setNextEvent(agenda.find(e => !e.completed));
      };
      fetchNextEvent();
    }, []);

    if (timerMode === 'study' && timeLeft <= 0 && !isRunning) {
        return (
             <div className="text-center p-4 bg-purple/10 border border-purple/20 rounded-lg">
                <Coffee size={24} className="mx-auto text-purple mb-2" />
                <h4 className="font-bold text-white">¡Fin del bloque de estudio!</h4>
                <p className="text-sm text-text-secondary">Tómate un merecido descanso de 10 minutos.</p>
            </div>
        )
    }

    if (nextEvent) {
        return (
            <div className="text-center p-4 bg-cyan/10 border border-cyan/20 rounded-lg">
                <ChevronsRight size={24} className="mx-auto text-cyan mb-2" />
                <h4 className="font-bold text-white">Siguiente Paso del Plan</h4>
                <p className="text-sm text-text-secondary">{nextEvent.subTopic}</p>
            </div>
        )
    }
    
    return null;
}

const SessionSummary: React.FC<Props> = ({ sessionData, onStartExam, onReturnToDashboard }) => {
    const totalTimeSec = Math.round(sessionData.results.reduce((sum: number, r: any) => sum + r.timeMs, 0) / 1000);
    const practice = sessionData.results.find((r: any) => r.step === 'practicing');
    const practiceCorrect = practice ? practice.results.filter((r:any) => r.correct).length : 0;
    const practiceTotal = practice ? practice.results.length : 0;
    
    return (
        <div className="flex justify-center items-center h-full">
            <Card className="max-w-xl w-full text-center">
                <h2 className="text-2xl font-bold text-white mb-2">¡Lección Aprendida!</h2>
                <p className="text-text-secondary mb-6">Completaste la fase de aprendizaje de <span className="font-semibold text-cyan">{sessionData.subTopic}</span>. ¡Ahora a probar lo que sabes!</p>
                
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-left my-6">
                    <div className="bg-surface p-3 rounded-lg flex items-center gap-3">
                        <CheckCircle size={20} className="text-green-400" />
                        <div>
                            <div className="font-bold text-lg">{practiceCorrect}/{practiceTotal}</div>
                            <div className="text-xs text-text-secondary">Prácticas Correctas</div>
                        </div>
                    </div>
                     <div className="bg-surface p-3 rounded-lg flex items-center gap-3">
                        <Clock size={20} className="text-purple" />
                        <div>
                            <div className="font-bold text-lg">{`${Math.floor(totalTimeSec/60)}m ${totalTimeSec % 60}s`}</div>
                            <div className="text-xs text-text-secondary">Tiempo de Lección</div>
                        </div>
                    </div>
                    <div className="bg-surface p-3 rounded-lg flex items-center gap-3">
                        <Lightbulb size={20} className="text-yellow-400" />
                        <div>
                            <div className="font-bold text-lg">{practice?.results.reduce((sum: number, r: any) => sum + r.hintsUsed, 0) || 0}</div>
                            <div className="text-xs text-text-secondary">Pistas Usadas</div>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-4 justify-center mt-6 pt-6 border-t border-border">
                    <SecondaryButton onClick={onReturnToDashboard}>Volver a la Ruta</SecondaryButton>
                    <PrimaryButton onClick={onStartExam}>
                        <Award size={16} className="mr-2" />
                        Iniciar Examen del Tema
                    </PrimaryButton>
                </div>
            </Card>
        </div>
    );
};
export default SessionSummary;