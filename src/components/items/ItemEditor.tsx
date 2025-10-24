import React, { useState, useEffect, useMemo } from 'react';
import { ItemSchema, Item, ItemType, CognitiveLevels, Difficulties } from '../../schemas/item';
// FIX: `useTopics` is exported from `hooks/exams`, not `hooks/items`.
import { useItemMutations } from '../../services/hooks/items';
import { useTopics } from '../../services/hooks/exams';
import { Card, PrimaryButton, SecondaryButton, Chip } from '../../../components/ui';
import { Save, X, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { track } from '../../shared/telemetry';
import MathMarkdown from '../../../components/MathMarkdown';
// FIX: Import 'ZodIssue' type from 'zod' to resolve 'Cannot find name' error.
import type { ZodIssue } from 'zod';

interface ItemEditorProps {
  subjectId: string;
  initialItem?: Partial<Item> | null;
  onCancel: () => void;
  onSaved: (item: Item) => void;
}

type Errors = Record<string, string | undefined>;

export const ItemEditor: React.FC<ItemEditorProps> = ({ subjectId, initialItem, onCancel, onSaved }) => {
  const { data: topics } = useTopics(subjectId);
  const { upsertItem, isSaving } = useItemMutations();

  const getInitialState = (): Partial<Item> => ({
    subjectId,
    topicId: topics?.[0]?.id || '',
    type: 'single',
    statement: '',
    choices: [{id: `c_${Date.now()}_0`, text:'', correct: true}, {id: `c_${Date.now()}_1`, text:'', correct: false}],
    difficulty: 'medium',
    cognitiveLevel: 'apply',
    timeExpectedSec: 60,
    tags: [],
    ...initialItem,
  });

  const [item, setItem] = useState<Partial<Item>>(getInitialState());
  const [errors, setErrors] = useState<Errors>({});
  
  useEffect(() => {
    setItem(getInitialState());
    setErrors({});
  }, [initialItem, subjectId, topics]);

  const handleChange = (field: keyof Item, value: any) => {
    setItem(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: undefined }));
    }
  };
  
  const handleTypeChange = (type: ItemType) => {
    const changes: Partial<Item> = { type };
    if (type === 'open') {
      changes.choices = undefined;
      changes.answer = '';
    } else {
      changes.answer = undefined;
      changes.choices = item.choices && item.choices.length >=2 ? item.choices : [{id: `c_${Date.now()}_0`, text:'', correct: true}, {id: `c_${Date.now()}_1`, text:'', correct: false}];
      if(type === 'single') {
        let hasCorrect = false;
        changes.choices = changes.choices!.map(c => {
            if(c.correct && !hasCorrect) { hasCorrect = true; return c; }
            return {...c, correct: false};
        });
        if (!hasCorrect) changes.choices[0].correct = true;
      }
    }
    setItem(prev => ({ ...prev, ...changes }));
  };

  const handleChoiceChange = (index: number, field: 'text' | 'correct', value: string | boolean) => {
    let newChoices = [...(item.choices || [])];
    if (field === 'correct') {
        if (item.type === 'single') {
            newChoices = newChoices.map((c, i) => ({ ...c, correct: i === index }));
        } else {
            newChoices[index] = { ...newChoices[index], correct: value as boolean };
        }
    } else {
        newChoices[index] = { ...newChoices[index], text: value as string };
    }
    setItem(prev => ({ ...prev, choices: newChoices }));
  };
  
  const addChoice = () => {
    const newChoice = { id: `c_${Date.now()}`, text: '', correct: false };
    setItem(prev => ({ ...prev, choices: [...(prev.choices || []), newChoice]}));
  };

  const removeChoice = (index: number) => {
    if ((item.choices?.length || 0) <= 2) return;
    let newChoices = item.choices?.filter((_, i) => i !== index) || [];
    if(item.type === 'single' && !newChoices.some(c => c.correct)) {
        newChoices[0].correct = true;
    }
    setItem(prev => ({ ...prev, choices: newChoices }));
  };

  const validateAndSave = () => {
    const result = ItemSchema.safeParse(item);
    if (!result.success) {
      const newErrors: Errors = {};
      result.error.issues.forEach((issue: ZodIssue) => {
        newErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(newErrors);
      track('item_validation_failed', { errors: result.error.flatten() });
      return;
    }
    
    upsertItem(result.data, {
        onSuccess: (savedItem) => {
            onSaved(savedItem);
        }
    });
  };

  const ErrorMessage: React.FC<{ field: string }> = ({ field }) =>
    errors[field] ? <div className="flex items-center gap-1 text-red-400 text-xs mt-1"><AlertCircle size={14}/>{errors[field]}</div> : null;


  return (
    <Card className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{item.id ? 'Editar Ítem' : 'Nuevo Ítem'}</h2>
        <SecondaryButton onClick={onCancel} className="!p-2 h-8 w-8 !rounded-full"><X size={16} /></SecondaryButton>
      </div>
      
      <div className="flex-grow overflow-y-auto pr-2 -mr-4 space-y-4">
        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium">Materia</label>
                <input type="text" value={subjectId} disabled className="mt-1 w-full bg-surface-2 rounded-input p-2 opacity-70"/>
            </div>
            <div>
                <label className="text-sm font-medium">Tema</label>
                <select value={item.topicId} onChange={e => handleChange('topicId', e.target.value)} className="mt-1 w-full bg-surface-1 border-border rounded-input p-2">
                    {topics?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
            </div>
        </div>
        
        {/* Statement */}
        <div>
            <label className="text-sm font-medium">Enunciado (soporta Markdown y KaTeX)</label>
            <textarea value={item.statement} onChange={e => handleChange('statement', e.target.value)} rows={4} className="mt-1 w-full bg-surface-1 border-border rounded-input p-2 font-mono text-sm"/>
            <ErrorMessage field="statement" />
            <details className="text-xs mt-1"><summary className="cursor-pointer text-text-secondary">Vista Previa</summary><div className="p-2 border border-dashed border-border rounded-lg mt-1"><MathMarkdown content={item.statement || '...'} /></div></details>
        </div>

        {/* Type and Options */}
        <div>
            <label className="text-sm font-medium">Tipo de Pregunta</label>
            <div className="flex gap-1 p-1 bg-surface-2 rounded-button border border-border mt-1">
                <button onClick={() => handleTypeChange('single')} className={`flex-1 py-1 text-sm rounded-md ${item.type === 'single' ? 'bg-primary text-white' : ''}`}>Única</button>
                <button onClick={() => handleTypeChange('multiple')} className={`flex-1 py-1 text-sm rounded-md ${item.type === 'multiple' ? 'bg-primary text-white' : ''}`}>Múltiple</button>
                <button onClick={() => handleTypeChange('open')} className={`flex-1 py-1 text-sm rounded-md ${item.type === 'open' ? 'bg-primary text-white' : ''}`}>Abierta</button>
            </div>
             <ErrorMessage field="type" />
        </div>

        {item.type === 'open' ? (
            <div>
                <label className="text-sm font-medium">Respuesta Correcta</label>
                <input type="text" value={item.answer || ''} onChange={e => handleChange('answer', e.target.value)} className="mt-1 w-full bg-surface-1 border-border rounded-input p-2"/>
            </div>
        ) : (
            <div>
                 <label className="text-sm font-medium">Opciones de Respuesta</label>
                 <ErrorMessage field="choices" />
                 <div className="space-y-2 mt-1">
                    {item.choices?.map((choice, i) => (
                        <div key={choice.id} className="flex items-center gap-2">
                            <input type={item.type === 'single' ? 'radio' : 'checkbox'} name="correctChoice" checked={choice.correct} onChange={(e) => handleChoiceChange(i, 'correct', e.target.checked)} className="h-5 w-5"/>
                            <input type="text" value={choice.text} onChange={e => handleChoiceChange(i, 'text', e.target.value)} className="flex-grow bg-surface-1 border-border rounded-input p-2"/>
                            <button onClick={() => removeChoice(i)} disabled={(item.choices?.length || 0) <= 2} className="p-2 text-red-400 disabled:opacity-40"><Trash2 size={16}/></button>
                        </div>
                    ))}
                    <SecondaryButton onClick={addChoice} className="text-xs"><Plus size={14} className="mr-1"/> Añadir Opción</SecondaryButton>
                 </div>
            </div>
        )}
        
        {/* Attributes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="text-sm font-medium">Dificultad</label>
                <select value={item.difficulty} onChange={e => handleChange('difficulty', e.target.value)} className="mt-1 w-full bg-surface-1 border-border rounded-input p-2">
                    {Difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>
            <div>
                <label className="text-sm font-medium">Nivel Cognitivo</label>
                 <select value={item.cognitiveLevel} onChange={e => handleChange('cognitiveLevel', e.target.value)} className="mt-1 w-full bg-surface-1 border-border rounded-input p-2">
                    {CognitiveLevels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
            </div>
             <div>
                <label className="text-sm font-medium">Tiempo Esperado (seg)</label>
                <input type="number" value={item.timeExpectedSec || ''} onChange={e => handleChange('timeExpectedSec', parseInt(e.target.value, 10) || 0)} className="mt-1 w-full bg-surface-1 border-border rounded-input p-2"/>
                <ErrorMessage field="timeExpectedSec" />
            </div>
        </div>

      </div>

      <div className="mt-6 pt-4 border-t border-border flex justify-end gap-2">
        <SecondaryButton onClick={onCancel}>Cancelar</SecondaryButton>
        <PrimaryButton onClick={validateAndSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin mr-2"/> : <Save size={16} className="mr-2"/>}
            Guardar Ítem
        </PrimaryButton>
      </div>
    </Card>
  );
};

export default ItemEditor;