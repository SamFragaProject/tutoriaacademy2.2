import React from 'react';
import type { Chunk, LearnContent } from '../../types';
import MathMarkdown from '../MathMarkdown';
import { PrimaryButton } from '../ui';
import DiscreteCitations from './DiscreteCitations';
// FIX: Import CheckCircle from lucide-react.
import { ArrowRight, Target, BookOpen, Layers, Check, Image, CheckCircle } from 'lucide-react';

interface Props {
  content: LearnContent;
  citations: Chunk[];
  onContinue?: () => void;
}

const TutorResponse: React.FC<Props> = ({ content, citations, onContinue }) => {
  return (
    <div className="space-y-6" aria-live="polite">
      {/* Introduction */}
      <div className="p-4 bg-surface rounded-lg border border-border">
          <MathMarkdown content={content.introduction} />
      </div>

      {/* Objectives */}
      <div>
        <h3 className="text-lg font-semibold text-cyan mb-3 flex items-center gap-2"><Target size={20}/> Objetivos de Aprendizaje</h3>
        <ul className="space-y-2">
            {content.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-primary">
                    <CheckCircle size={18} className="text-green-400 mt-0.5 flex-shrink-0"/>
                    <span>{obj}</span>
                </li>
            ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-purple mb-2 flex items-center gap-2"><BookOpen size={20}/> Contenido Principal</h3>
        {content.mainContent.map((section, i) => (
            <div key={i} className="p-4 bg-bg/50 rounded-lg border border-border space-y-3">
                <h4 className="font-bold text-white">{section.title}</h4>
                <div className="prose prose-invert text-text-secondary max-w-none text-sm">
                    <MathMarkdown content={section.text} />
                </div>
                <div className="prose prose-invert text-text-secondary max-w-none text-sm p-3 bg-surface rounded-md border border-border">
                    <MathMarkdown content={section.example} />
                </div>
                {section.visualAidDescription && (
                    <div className="text-xs text-muted italic flex items-center gap-2 p-2 bg-surface/50 rounded-md">
                        <Image size={14} />
                        <span><strong>Visualización:</strong> {section.visualAidDescription}</span>
                    </div>
                )}
            </div>
        ))}
      </div>
      
       {/* Summary */}
      <div>
        <h3 className="text-lg font-semibold text-cyan mb-2 flex items-center gap-2"><Layers size={20}/> Resumen</h3>
        <div className="prose prose-invert text-text-primary max-w-none text-sm">
            <MathMarkdown content={content.summary} />
        </div>
      </div>


      {/* Citations */}
      <DiscreteCitations citations={citations} />
      
      {onContinue && (
        <div className="text-center mt-6 border-t border-border pt-4">
          <PrimaryButton onClick={onContinue} className="ta-btn-next-step">
            Entendido, ¡a practicar!
            <ArrowRight size={16} />
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};

export default TutorResponse;