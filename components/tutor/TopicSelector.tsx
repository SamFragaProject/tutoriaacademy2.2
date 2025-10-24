import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import type { Subject } from '../../types';
import * as docSvc from '../../services/documents';
import { FileText, AlertTriangle, PlusCircle } from 'lucide-react';

interface Props {
  onTopicSelect: (subject: Subject, topic: string, subTopic: string) => void;
  initialSubject?: Subject;
}

const TopicSelector: React.FC<Props> = ({ onTopicSelect, initialSubject = 'Matemáticas' }) => {
  const [subject, setSubject] = useState<Subject>(initialSubject);
  const [topic, setTopic] = useState('');
  const [subTopic, setSubTopic] = useState('');
  const [topicList, setTopicList] = useState<{ topic: string, subTopics: string[] }[]>([]);
  const [chunkCount, setChunkCount] = useState(0);

  useEffect(() => {
    setSubject(initialSubject);
  }, [initialSubject]);

  useEffect(() => {
    const list = docSvc.getTopicsForSubject(subject);
    setTopicList(list);
    const firstTopic = list[0]?.topic || '';
    const firstSubTopic = list[0]?.subTopics[0] || '';
    setTopic(firstTopic);
    setSubTopic(firstSubTopic);
  }, [subject]);
  
  // Effect to report selection changes upwards
  useEffect(() => {
    if(subject && topic && subTopic) {
        const count = docSvc.countChunksForSubTopic(subTopic);
        setChunkCount(count);
        onTopicSelect(subject, topic, subTopic);
    }
  }, [subject, topic, subTopic, onTopicSelect]);


  const handleSubTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [selectedTopic, selectedSubTopic] = e.target.value.split('__');
    setTopic(selectedTopic);
    setSubTopic(selectedSubTopic);
  };
  
  return (
    <div className="space-y-3">
        <div className="flex gap-1 p-1 bg-surface-2 rounded-button border border-border">
            <button onClick={() => setSubject('Matemáticas')} className={`w-full px-3 py-1 text-sm font-semibold rounded-button ${subject === 'Matemáticas' ? 'bg-primary text-white' : 'text-text-secondary'}`}>Matemáticas</button>
            <button onClick={() => setSubject('Lengua')} className={`w-full px-3 py-1 text-sm font-semibold rounded-button ${subject === 'Lengua' ? 'bg-primary text-white' : 'text-text-secondary'}`}>Lengua</button>
        </div>
        
        <select value={`${topic}__${subTopic}`} onChange={handleSubTopicChange} className="w-full bg-surface-1 border border-border rounded-input px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
          {topicList.map(t => (
            <optgroup key={t.topic} label={t.topic}>
              {t.subTopics.map(st => (
                <option key={st} value={`${t.topic}__${st}`}>{st}</option>
              ))}
            </optgroup>
          ))}
        </select>
        
        <div className="flex justify-between items-center text-sm">
            <div className="px-3 py-1.5 font-semibold bg-surface-2 border-border text-text-secondary rounded-button flex items-center gap-2">
                <FileText size={16} />
                <span>Fuentes: {chunkCount}</span>
            </div>
             {chunkCount === 0 && (
              <NavLink to="/admin/documentos" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                <PlusCircle size={14} />
                Agregar
              </NavLink>
            )}
        </div>
    </div>
  );
};


export default TopicSelector;