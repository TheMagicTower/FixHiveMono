/**
 * vote - CodeCaseDB v2.0 투표
 *
 * 해결책의 품질을 평가합니다 (upvote/downvote/report).
 */
import { z } from 'zod';
import { createCloudClient } from '@the-magic-tower/fixhive-shared';
import { loadConfig, isCloudEnabled } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
export const voteToolName = 'fixhive_vote';
export const voteToolSchema = {
    name: voteToolName,
    description: `Vote on a solution's quality or report inappropriate content.

Use this after trying a solution to help the community identify the best solutions.
- up: The solution was helpful
- down: The solution was not helpful or incorrect
- report: The content is inappropriate, spam, or harmful (requires reason)`,
    inputSchema: {
        type: 'object',
        properties: {
            variant_id: {
                type: 'string',
                description: 'The variant ID to vote on (from search_cases results)',
            },
            value: {
                type: 'string',
                enum: ['up', 'down', 'report'],
                description: 'Vote type: up (helpful), down (not helpful), or report (inappropriate)',
            },
            reason: {
                type: 'string',
                description: 'Required when reporting: explain why the content is inappropriate',
            },
        },
        required: ['variant_id', 'value'],
    },
};
export const voteInputSchema = z.object({
    variant_id: z.string().uuid(),
    value: z.enum(['up', 'down', 'report']),
    reason: z.string().optional(),
});
export async function handleVote(input) {
    logger.info('Processing vote', {
        variantId: input.variant_id,
        value: input.value,
    });
    // report인 경우 reason 필수
    if (input.value === 'report' && !input.reason) {
        return JSON.stringify({
            success: false,
            error: 'Reason is required when reporting content',
        });
    }
    // 클라우드가 비활성화된 경우
    if (!isCloudEnabled()) {
        return JSON.stringify({
            success: false,
            message: 'Cloud mode is disabled. Set FIXHIVE_SUPABASE_URL and FIXHIVE_SUPABASE_KEY to enable.',
            offline: true,
        });
    }
    try {
        const config = loadConfig();
        const client = createCloudClient({
            supabaseUrl: config.supabaseUrl,
            supabaseKey: config.supabaseKey,
            deviceId: config.deviceId,
        });
        const result = await client.vote({
            variant_id: input.variant_id,
            value: input.value,
            reason: input.reason,
        });
        if (!result.success) {
            return JSON.stringify({
                success: false,
                error: result.error || 'Vote failed',
            });
        }
        const messages = {
            up: 'Thank you for your upvote! This helps other developers find useful solutions.',
            down: 'Thank you for your feedback. This helps improve solution quality.',
            report: 'Thank you for reporting. Our team will review this content.',
        };
        return JSON.stringify({
            success: true,
            message: messages[input.value],
            voteId: result.vote_id,
            previousVote: result.previous_vote,
            currentScore: result.current_score,
        });
    }
    catch (error) {
        logger.error('Vote failed', { error });
        return JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Vote failed',
        });
    }
}
//# sourceMappingURL=vote.tool.js.map