import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { track } from '../../shared/telemetry';

export type Flashcard = {
    id: string;
    subjectId: string;
    topicId: string;
    front: string;
    back: string;
    tags?: string[];
};

export type ReviewOutcome = 'again' | 'hard' | 'easy';

export const useSRSQueue = (userId: string, subjectId?: string) => {
    return useQuery({
        queryKey: ['srs', 'due', { userId, subjectId }],
        queryFn: () => {
            track('srs_queue_fetch_start', { subjectId });
            return api.srs.getDue(userId, subjectId);
        },
        enabled: !!userId,
    });
};

export const useSRSStats = (userId: string) => {
    return useQuery({
        queryKey: ['srs', 'stats', { userId }],
        queryFn: () => {
             track('srs_stats_fetch_start', { userId });
            return api.srs.stats(userId);
        },
        enabled: !!userId,
    });
};

export const useSRSReviewMutation = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cardId, outcome }: { cardId: string, outcome: ReviewOutcome }) => {
            track('srs_review', { userId, cardId, outcome });
            return api.srs.review(userId, cardId, outcome);
        },
        onSuccess: () => {
            // Invalidate all SRS queries to refetch queue and stats
            queryClient.invalidateQueries({ queryKey: ['srs'] });
        },
        onError: (error) => {
            track('srs_review_error', { error: (error as Error).message });
        }
    });
};