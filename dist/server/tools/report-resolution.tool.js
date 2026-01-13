/**
 * report_resolution - CodeCaseDB v2.0 해결책 보고
 *
 * 에러 해결 과정을 커뮤니티에 공유합니다.
 * 새 해결책을 등록하거나, 기존 해결책이 도움이 되었음을 보고합니다.
 */
import { z } from 'zod';
import { createCloudClient, filterSensitiveData, sanitizeStackTrace, NORMALIZATION_GUIDE, } from '@the-magic-tower/fixhive-shared';
import { loadConfig, isCloudEnabled } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
export const reportResolutionToolName = 'fixhive_report_resolution';
export const reportResolutionToolSchema = {
    name: reportResolutionToolName,
    description: `Report an error resolution to the FixHive community knowledge base.

Use this tool after resolving an error to share your solution, or to confirm that an existing solution worked.

IMPORTANT: Before calling this tool, normalize the error signature:
${NORMALIZATION_GUIDE}

The resolution will be processed and aggregated with similar cases to help other developers.`,
    inputSchema: {
        type: 'object',
        properties: {
            error_message: {
                type: 'string',
                description: 'The original error message',
            },
            error_signature: {
                type: 'string',
                description: 'Normalized error signature (with placeholders like {class}, {file}, {id})',
            },
            stack_trace: {
                type: 'string',
                description: 'Stack trace (sensitive paths will be sanitized)',
            },
            cause: {
                type: 'string',
                description: 'Root cause of the error',
            },
            solution: {
                type: 'string',
                description: 'How the error was resolved',
            },
            solution_steps: {
                type: 'array',
                items: { type: 'string' },
                description: 'Step-by-step resolution instructions',
            },
            code_diff: {
                type: 'string',
                description: 'Code changes that fixed the issue (optional)',
            },
            language: {
                type: 'string',
                description: 'Programming language',
            },
            framework: {
                type: 'string',
                description: 'Framework',
            },
            packages: {
                type: 'object',
                description: 'Key dependencies with versions',
                additionalProperties: { type: 'string' },
            },
            solved: {
                type: 'boolean',
                description: 'Whether the error was successfully resolved (default: true)',
            },
            used_variant_id: {
                type: 'string',
                description: 'If an existing solution helped, provide its variant ID to increment success count',
            },
            what_was_tried: {
                type: 'string',
                description: 'What approaches were tried (useful even if not solved)',
            },
            time_spent: {
                type: 'number',
                description: 'Minutes spent resolving (optional)',
            },
        },
        required: ['error_message', 'error_signature'],
    },
};
export const reportResolutionInputSchema = z.object({
    error_message: z.string().min(1),
    error_signature: z.string().min(5),
    stack_trace: z.string().optional(),
    cause: z.string().optional(),
    solution: z.string().optional(),
    solution_steps: z.array(z.string()).optional(),
    code_diff: z.string().optional(),
    language: z.string().optional(),
    framework: z.string().optional(),
    packages: z.record(z.string()).optional(),
    solved: z.boolean().optional().default(true),
    used_variant_id: z.string().uuid().optional(),
    what_was_tried: z.string().optional(),
    time_spent: z.number().int().min(0).optional(),
});
export async function handleReportResolution(input) {
    logger.info('Reporting resolution', {
        signature: input.error_signature.slice(0, 100),
        solved: input.solved,
        usedVariant: input.used_variant_id,
    });
    // 클라우드가 비활성화된 경우
    if (!isCloudEnabled()) {
        return JSON.stringify({
            success: false,
            message: 'Cloud mode is disabled. Set FIXHIVE_SUPABASE_URL and FIXHIVE_SUPABASE_KEY to enable.',
            offline: true,
        });
    }
    // 민감 정보 필터링
    const filteredSolution = input.solution
        ? filterSensitiveData(input.solution)
        : undefined;
    const filteredCause = input.cause
        ? filterSensitiveData(input.cause)
        : undefined;
    const sanitizedStackTrace = input.stack_trace
        ? sanitizeStackTrace(input.stack_trace)
        : undefined;
    const filteredDiff = input.code_diff
        ? filterSensitiveData(input.code_diff)
        : undefined;
    // 환경 정보 구성
    const environment = {
        language: input.language || 'unknown',
        framework: input.framework,
        packages: input.packages,
    };
    try {
        const config = loadConfig();
        const client = createCloudClient({
            supabaseUrl: config.supabaseUrl,
            supabaseKey: config.supabaseKey,
            deviceId: config.deviceId,
        });
        // 해결책 보고
        const result = await client.reportResolution({
            error_message: input.error_message,
            error_signature: input.error_signature,
            stack_trace: sanitizedStackTrace,
            cause: filteredCause?.filtered,
            solution: filteredSolution?.filtered,
            solution_steps: input.solution_steps,
            code_diff: filteredDiff?.filtered,
            environment,
            solved: input.solved,
            used_variant_id: input.used_variant_id,
            what_was_tried: input.what_was_tried,
            time_spent: input.time_spent,
        });
        if (!result.success) {
            return JSON.stringify({
                success: false,
                error: result.error || 'Failed to report resolution',
            });
        }
        // 민감 정보 필터링 경고
        const warnings = [];
        if (filteredSolution?.containsSensitive) {
            warnings.push('Some sensitive data was redacted from the solution');
        }
        if (filteredCause?.containsSensitive) {
            warnings.push('Some sensitive data was redacted from the cause');
        }
        return JSON.stringify({
            success: true,
            message: input.used_variant_id
                ? 'Thank you! Success count incremented for the existing solution.'
                : 'Thank you for contributing! Your resolution has been recorded.',
            resolutionId: result.resolution_id,
            groupId: result.group_id,
            variantId: result.variant_id,
            isNewGroup: result.is_new_group,
            isNewVariant: result.is_new_variant,
            warnings: warnings.length > 0 ? warnings : undefined,
        });
    }
    catch (error) {
        logger.error('Report resolution failed', { error });
        return JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Report failed',
        });
    }
}
//# sourceMappingURL=report-resolution.tool.js.map