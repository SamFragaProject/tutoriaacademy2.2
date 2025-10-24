import React from 'react';
import type { MainTopic, SubTopic } from '../../types';
import { Card } from '../ui';
import { CheckCircle, Circle } from 'lucide-react';

interface SyllabusSidebarProps {
  mainTopic: MainTopic;
  completedIds: Set<string>;
  onSubTopicClick: (subTopic: SubTopic) => void;
}

const SyllabusSidebar: React.FC<SyllabusSidebarProps> = ({ mainTopic, completedIds, onSubTopicClick }) => {
  return (
    <Card className="p-4 h-full flex flex-col no-scrollbar">
      <h3 className="text-lg font-bold text-text-primary mb-1">{mainTopic.name}</h3>
      <p className="text-sm text-text-secondary mb-4">Sigue tu progreso en este bloque.</p>
      
      <div className="flex-grow overflow-y-auto pr-2 -mr-2 no-scrollbar">
          <ul className="space-y-2">
            {mainTopic.subTopics.map((subTopic) => {
              const isCompleted = completedIds.has(subTopic.id);
              return (
                <li key={subTopic.id}>
                  <button
                    onClick={() => onSubTopicClick(subTopic)}
                    className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-colors
                      ${isCompleted 
                        ? 'bg-green-500/10 text-text-secondary' 
                        : 'bg-surface-2 hover:bg-surface-1'
                      }`}
                  >
                    {isCompleted ? (
                      <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
                    ) : (
                      <Circle size={18} className="text-muted flex-shrink-0" />
                    )}
                    <span className={`text-sm ${isCompleted ? 'line-through' : 'text-text-primary'}`}>
                      {subTopic.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
      </div>

       <div className="text-xs text-text-secondary text-center mt-4 border-t border-border/40 pt-3">
            Haz clic en un tema para que el tutor te lo explique.
       </div>
    </Card>
  );
};

export default SyllabusSidebar;