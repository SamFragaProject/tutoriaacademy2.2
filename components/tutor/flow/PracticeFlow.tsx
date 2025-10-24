import React, { useState, useEffect, useCallback } from 'react';
import type { PracticeState } from '../../../types';
import { Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import MathMarkdown from '../../MathMarkdown';
import { PrimaryButton, SecondaryButton } from '../../ui';
import DiscreteCitations from '../DiscreteCitations';

interface PracticeResult {
    correct: boolean;
    confidence: 1 | 2 | 3;
    hintsUsed: number;
    autoExplained: boolean;
}

interface Props {
  items: PracticeState[];
  onComplete: (results: PracticeResult[]) => void;
}

const PracticeFlow: React.FC<Props> = ({ items, onComplete }) => {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<PracticeResult[]>([]);
  
  const [hintIndex, setHintIndex] = useState(-1);
  const [confidence, setConfidence] = useState<1 | 2 | 3 | null>(null);
  const [answer, setAnswer] = useState<'correct' | 'incorrect' | null>(null);
  const [showAutoExplanation, setShowAutoExplanation] = useState(false);
  const [autoExplanationText, setAutoExplanationText] = useState('');
  
  const currentItem = items[index];

  const handleShowHint = () => setHintIndex(prev => Math.min(currentItem.hints.length - 1, prev + 1));

  const submitAnswer = (ans: 'correct' | 'incorrect') => {
      if (!confidence) return;
      
      if (ans === 'incorrect' && confidence === 3) {
          setShowAutoExplanation(true);
      } else {
          setAnswer(ans);
      }
  };

  const handleAutoExplanationSubmit = () => {
      setAnswer('incorrect');
      setShowAutoExplanation(false);
  }

  const handleNext = () => {
    const newResult: PracticeResult = {
        correct: answer === 'correct',
        confidence: confidence!,
        hintsUsed: hintIndex + 1,
        autoExplained: autoExplanationText.length > 5
    };
    const updatedResults = [...results, newResult];
    setResults(updatedResults);

    if (index < items.length - 1) {
      setIndex(i => i + 1);
      // Reset state for next question
      setHintIndex(-1);
      setConfidence(null);
      setAnswer(null);
      setAutoExplanationText('');
    } else {
      onComplete(updatedResults);
    }
  };
  
  const renderContent = () => {
      if (answer) { // Show solution
          const isCorrect = answer === 'correct';
          return (
             <div className="space-y-4">
                <h3 className={`text-xl font-bold flex items-center gap-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {isCorrect ? <CheckCircle /> : <XCircle />}
                    {isCorrect ? "¡Correcto!" : "Revisemos la solución"}
                </h3>
                <div className="prose prose-invert text-text-primary max-w-none p-4 bg-bg/50 rounded-lg border border-border">
                    <MathMarkdown content={currentItem.solution} />
                </div>
                <DiscreteCitations citations={currentItem.citations} />
                <div className="text-center">
                    <PrimaryButton onClick={handleNext}>
                        {index < items.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Práctica'}
                    </PrimaryButton>
                </div>
            </div>
          );
      }
      
      if (showAutoExplanation) {
          return (
              <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan">Explica tu Razonamiento</h3>
                  <p className="text-sm text-text-secondary">Parece que tenías mucha confianza pero la respuesta no fue correcta. Tómate un momento para explicar por qué pensaste que tu respuesta era la correcta. Este es un paso muy útil para aprender.</p>
                  <textarea 
                    value={autoExplanationText}
                    onChange={(e) => setAutoExplanationText(e.target.value)}
                    rows={4}
                    className="w-full bg-surface border border-border rounded-lg p-2 focus:ring-cyan focus:border-cyan"
                    placeholder="Escribe tu razonamiento aquí..."
                  />
                  <PrimaryButton onClick={handleAutoExplanationSubmit} className="w-full">Ver Solución Correcta</PrimaryButton>
              </div>
          );
      }

      // Show question
      return (
          <div className="space-y-6">
              <div className="prose prose-invert text-text-primary max-w-none">
                  <MathMarkdown content={currentItem.question} />
              </div>
              
               {hintIndex >= 0 && (
                  <ul className="space-y-1">
                      {currentItem.hints.slice(0, hintIndex + 1).map((hint, i) => (
                          <li key={i} className="text-xs text-muted p-2 bg-surface/50 rounded-md flex gap-2 items-start">
                              <Lightbulb size={14} className="flex-shrink-0 mt-0.5 text-yellow-300"/>
                              <span>{hint}</span>
                          </li>
                      ))}
                  </ul>
              )}
              
              <div className="space-y-4 pt-4 border-t border-border">
                  <h4 className="text-sm font-semibold text-text-secondary text-center">¿Qué tan seguro estás de tu respuesta?</h4>
                  <div className="flex justify-center gap-2">
                      {[1, 2, 3].map(level => (
                          <button key={level} onClick={() => setConfidence(level as 1|2|3)} className={`px-4 py-2 rounded-pill border transition-colors ${confidence === level ? 'bg-purple/30 border-purple' : 'bg-surface border-border hover:border-purple'}`}>{level}</button>
                      ))}
                  </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                  <SecondaryButton onClick={handleShowHint} disabled={!confidence || hintIndex >= currentItem.hints.length - 1}>
                      <Lightbulb size={16} /> Pista
                  </SecondaryButton>
                  <button onClick={() => submitAnswer('incorrect')} disabled={!confidence} className="ta-btn ta-btn--ghost disabled:opacity-50">Estaba equivocado</button>
                  <button onClick={() => submitAnswer('correct')} disabled={!confidence} className="ta-btn ta-btn--pri disabled:opacity-50">¡La tengo!</button>
              </div>
              <DiscreteCitations citations={currentItem.citations} />
          </div>
      )
  }

  return (
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Práctica (Pregunta {index + 1} de {items.length})</h3>
        {renderContent()}
    </div>
  )
};

export default PracticeFlow;