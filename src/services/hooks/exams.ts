import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import type { ExamBlueprint } from '../../schemas/item';
import { track } from '../../shared/telemetry';

export const useExamBlueprints = (subjectId: string) => {
  return useQuery({
    queryKey: ['examBlueprints', { subjectId }],
    queryFn: () => {
        track('exam_blueprints_fetch_start', { subjectId });
        return api.exams.listBlueprints(subjectId);
    },
    enabled: !!subjectId,
  });
};

export const useExamBlueprintMutations = () => {
  const queryClient = useQueryClient();

  const saveBlueprintMutation = useMutation({
    mutationFn: (blueprint: ExamBlueprint) => api.exams.saveBlueprint(blueprint),
    onSuccess: (savedBlueprint) => {
      queryClient.invalidateQueries({ queryKey: ['examBlueprints', { subjectId: savedBlueprint.subjectId }] });
    },
    onError: (error) => {
        track('exam_blueprint_save_error', { error: error.message });
    }
  });

  return {
    saveBlueprint: saveBlueprintMutation.mutate,
    isSaving: saveBlueprintMutation.isPending,
  };
};

export const useTopics = (subjectId: string) => {
    return useQuery({
        queryKey: ['topics', { subjectId }],
        queryFn: () => api.getTopics(subjectId),
        enabled: !!subjectId,
    });
};
