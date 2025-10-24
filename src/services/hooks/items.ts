import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import type { Item } from '../../schemas/item';
import { track } from '../../shared/telemetry';

export const useItems = (subjectId?: string) => {
  return useQuery({
    queryKey: ['items', { subjectId }],
    queryFn: () => {
      track('items_fetch_start', { subjectId });
      return api.items.list(subjectId);
    },
    enabled: !!subjectId,
  });
};

export const useItemMutations = () => {
  const queryClient = useQueryClient();

  const upsertItemMutation = useMutation({
    mutationFn: (item: Item) => api.items.upsert(item),
    onSuccess: (savedItem) => {
      queryClient.invalidateQueries({ queryKey: ['items', { subjectId: savedItem.subjectId }] });
      // Optionally, update the specific item in the cache
      // queryClient.setQueryData(['items', { subjectId: savedItem.subjectId }], (oldData: Item[] | undefined) => { ... });
    },
    onError: (error) => {
      track('item_upsert_error', { error: error.message });
    }
  });

  const removeItemMutation = useMutation({
    mutationFn: (item: Item) => api.items.remove(item.id!),
    onSuccess: (_, removedItem) => {
      queryClient.invalidateQueries({ queryKey: ['items', { subjectId: removedItem.subjectId }] });
    },
    onError: (error) => {
      track('item_remove_error', { error: error.message });
    }
  });

  return {
    upsertItem: upsertItemMutation.mutate,
    isSaving: upsertItemMutation.isPending,
    removeItem: removeItemMutation.mutate,
    isRemoving: removeItemMutation.isPending,
  };
};
