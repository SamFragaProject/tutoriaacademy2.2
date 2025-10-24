import React, { useState, useEffect, useMemo } from 'react';
import type { ExamBlueprint } from '../../schemas/item';
import { ExamBlueprintSchema, CognitiveLevels } from '../../schemas/item';
import { useExamBlueprintMutations } from '../../services/hooks/exams';
import { Card, PrimaryButton, SecondaryButton, Chip } from '../../../components/ui';
import { Save, X, Loader2, AlertCircle } from 'lucide-react';

interface ExamBlueprintEditorProps {
  subjectId: string;
  topics: { id: string; name: string }[];
  initialBlueprint?: Partial<ExamBlueprint> | null;
  onCancel: () => void;
  onSaved: (blueprint: ExamBlueprint) => void;
}

type Errors = Record<string, string | undefined>;

// Distributes items based on weights, handling rounding errors
function distributeItems(total: number, weights: number[]): number[] {
    if (total <= 0) return weights.map(() => 0);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (totalWeight === 0) return weights.map(() => 0);

    const exact = weights.map(w => (w / totalWeight) * total);
    const rounded = exact.map(Math.floor);
    let currentSum = rounded.reduce((sum, r) => sum + r, 0);
    const remainders = exact.map((e, i) => e - rounded[i]);
    
    while(currentSum < total) {
        let maxRemainder = -1;
        let maxIndex = -1;
        for(let i = 0; i < remainders.length; i++) {
            if(remainders[i] > maxRemainder) {
                maxRemainder = remainders[i];
                maxIndex = i;
            }
        }
        rounded[maxIndex]++;
        remainders[maxIndex] = -1; // Mark as used
        currentSum++;
    }
    return rounded;
}


export const ExamBlueprintEditor: React.FC<ExamBlueprintEditorProps> = ({ subjectId, topics, initialBlueprint, onCancel, onSaved }) => {
  const { saveBlueprint, isSaving } = useExamBlueprintMutations();

  const getInitialState = (): Partial<ExamBlueprint> => ({
    subjectId,
    totalItems: 20,
    timeLimitMin: 60,
    topicWeights: topics.map(t => ({ topicId: t.id, weight: 10 })),
    cognitiveWeights: CognitiveLevels.map(level => ({ level, weight: level === 'apply' ? 20 : 10 })),
    ...initialBlueprint,
  });

  const [blueprint, setBlueprint] = useState<Partial<ExamBlueprint>>(getInitialState());
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    setBlueprint(getInitialState());
  }, [initialBlueprint, subjectId, topics]);

  const handleChange = (field: keyof ExamBlueprint, value: any) => {
    setBlueprint(prev => ({ ...prev, [field]: value }));
  };

  const handleWeightChange = (type: 'topic' | 'cognitive', index: number, value: number) => {
    if (type === 'topic') {
        const newWeights = [...(blueprint.topicWeights || [])];
        newWeights[index].weight = value;
        handleChange('topicWeights', newWeights);
    } else {
        const newWeights = [...(blueprint.cognitiveWeights || [])];
        newWeights[index].weight = value;
        handleChange('cognitiveWeights', newWeights);
    }
  };

  const validateAndSave = () => {
    const result = ExamBlueprintSchema.safeParse(blueprint);
    if (!result.success) {
      const newErrors: Errors = {};
      result.error.issues.forEach(issue => {
        newErrors[issue.path.join('.')] = issue.message;
      });
      setErrors(newErrors);
      return;
    }
    saveBlueprint(result.data, { onSuccess: onSaved });
  };
  
  const { topicDistribution, cognitiveDistribution } = useMemo(() => {
    const total = blueprint.totalItems || 0;
    const topicW = blueprint.topicWeights?.map(t => t.weight) || [];
    const cognitiveW = blueprint.cognitiveWeights?.map(c => c.weight) || [];
    return {
        topicDistribution: distributeItems(total, topicW),
        cognitiveDistribution: distributeItems(total, cognitiveW),
    };
  }, [blueprint.totalItems, blueprint.topicWeights, blueprint.cognitiveWeights]);


  return (
    <Card className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{blueprint.id ? 'Editar Plantilla' : 'Nueva Plantilla de Examen'}</h2>
        <SecondaryButton onClick={onCancel} className="!p-2 h-8 w-8 !rounded-full"><X size={16} /></SecondaryButton>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 -mr-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Total de Ítems</label>
                    <input type="number" value={blueprint.totalItems || ''} onChange={e => handleChange('totalItems', parseInt(e.target.value) || 0)} className="mt-1 w-full bg-surface-1 border-border rounded-input p-2"/>
                    {errors.totalItems && <span className="text-xs text-red-400">{errors.totalItems}</span>}
                </div>
                 <div>
                    <label className="text-sm font-medium">Tiempo Límite (min)</label>
                    <input type="number" value={blueprint.timeLimitMin || ''} onChange={e => handleChange('timeLimitMin', parseInt(e.target.value) || 0)} className="mt-1 w-full bg-surface-1 border-border rounded-input p-2"/>
                    {errors.timeLimitMin && <span className="text-xs text-red-400">{errors.timeLimitMin}</span>}
                </div>
            </div>
            
            <div>
                <h3 className="font-semibold mb-2">Distribución por Tema</h3>
                <div className="space-y-3">
                    {blueprint.topicWeights?.map((tw, i) => (
                        <div key={tw.topicId}>
                            <label className="text-xs text-text-secondary">{topics.find(t=>t.id===tw.topicId)?.name}</label>
                            <div className="flex items-center gap-2">
                                <input type="range" min="0" max="100" value={tw.weight} onChange={e => handleWeightChange('topic', i, parseInt(e.target.value))} className="w-full h-2 bg-surface-2 rounded-lg appearance-none cursor-pointer"/>
                                <span className="w-8 text-right text-sm font-mono">{tw.weight}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
             <div>
                <h3 className="font-semibold mb-2">Distribución por Nivel Cognitivo</h3>
                <div className="space-y-3">
                    {blueprint.cognitiveWeights?.map((cw, i) => (
                        <div key={cw.level}>
                            <label className="text-xs text-text-secondary capitalize">{cw.level}</label>
                            <div className="flex items-center gap-2">
                                <input type="range" min="0" max="100" value={cw.weight} onChange={e => handleWeightChange('cognitive', i, parseInt(e.target.value))} className="w-full h-2 bg-surface-2 rounded-lg appearance-none cursor-pointer"/>
                                <span className="w-8 text-right text-sm font-mono">{cw.weight}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Preview */}
        <div className="space-y-4 p-4 bg-surface-2 rounded-lg border border-border">
            <h3 className="text-lg font-bold">Previsualización de Estructura</h3>
            <p className="text-xs text-text-secondary">Tiempo estimado: {Math.round((blueprint.totalItems || 0) * 1.5)} min</p>
            <div>
                <h4 className="font-semibold text-sm mb-2">Ítems por Tema</h4>
                <div className="text-xs space-y-1">
                    {blueprint.topicWeights?.map((tw, i) => (
                        <div key={tw.topicId} className="flex justify-between">
                            <span>{topics.find(t=>t.id===tw.topicId)?.name}</span>
                            <span className="font-bold">{topicDistribution[i]} ítems</span>
                        </div>
                    ))}
                </div>
            </div>
             <div>
                <h4 className="font-semibold text-sm mb-2">Ítems por Nivel Cognitivo</h4>
                <div className="text-xs space-y-1">
                    {blueprint.cognitiveWeights?.map((cw, i) => (
                        <div key={cw.level} className="flex justify-between">
                            <span className="capitalize">{cw.level}</span>
                            <span className="font-bold">{cognitiveDistribution[i]} ítems</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
      
       <div className="mt-6 pt-4 border-t border-border flex justify-end gap-2">
        <SecondaryButton onClick={onCancel}>Cancelar</SecondaryButton>
        <PrimaryButton onClick={validateAndSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin mr-2"/> : <Save size={16} className="mr-2"/>}
            Guardar Plantilla
        </PrimaryButton>
      </div>
    </Card>
  );
};

export default ExamBlueprintEditor;