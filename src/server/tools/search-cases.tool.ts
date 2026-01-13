/**
 * search_cases - CodeCaseDB v2.0 에러 솔루션 검색
 *
 * 에러 메시지와 환경 정보로 유사 케이스를 검색합니다.
 * pgvector 유사도 + 환경 매칭 + 랭킹 알고리즘으로 최적의 해결책을 반환합니다.
 */

import { z } from 'zod';
import {
  createCloudClient,
  hashSignature,
  NORMALIZATION_GUIDE,
} from '@the-magic-tower/fixhive-shared';
import type { Environment, SearchCasesOutput } from '@the-magic-tower/fixhive-shared';
import { loadConfig, isCloudEnabled } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

export const searchCasesToolName = 'fixhive_search_cases';

export const searchCasesToolSchema = {
  name: searchCasesToolName,
  description: `Search the FixHive knowledge base for error solutions.

IMPORTANT: Before calling this tool, normalize the error message:
${NORMALIZATION_GUIDE}

Returns ranked solutions based on similarity, environment match, and community votes.`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      error_message: {
        type: 'string',
        description: 'The original error message',
      },
      error_signature: {
        type: 'string',
        description:
          'Normalized error signature (with placeholders like {class}, {file}, {id})',
      },
      language: {
        type: 'string',
        description: 'Programming language (typescript, python, php, etc.)',
      },
      framework: {
        type: 'string',
        description: 'Framework (react, nextjs, laravel, django, etc.)',
      },
      packages: {
        type: 'object',
        description:
          'Key dependencies with versions (e.g., {"react": "18.2.0", "next": "14.0.0"})',
        additionalProperties: { type: 'string' },
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results (default: 5)',
      },
    },
    required: ['error_message'],
  },
};

export const searchCasesInputSchema = z.object({
  error_message: z.string().min(1),
  error_signature: z.string().optional(),
  language: z.string().optional(),
  framework: z.string().optional(),
  packages: z.record(z.string()).optional(),
  limit: z.number().int().min(1).max(20).optional().default(5),
});

export type SearchCasesInput = z.infer<typeof searchCasesInputSchema>;

export async function handleSearchCases(
  input: SearchCasesInput
): Promise<string> {
  logger.info('Searching for error solutions', {
    errorMessage: input.error_message.slice(0, 100),
    signature: input.error_signature?.slice(0, 100),
    language: input.language,
    framework: input.framework,
  });

  // 환경 정보 구성
  const environment: Environment = {
    language: input.language || 'unknown',
    framework: input.framework,
    packages: input.packages,
  };

  // 시그니처 해시 계산
  const signatureHash = input.error_signature
    ? hashSignature(input.error_signature)
    : undefined;

  // 클라우드가 비활성화된 경우
  if (!isCloudEnabled()) {
    return JSON.stringify({
      found: false,
      message:
        'Cloud mode is disabled. Set FIXHIVE_SUPABASE_URL and FIXHIVE_SUPABASE_KEY to enable.',
      offline: true,
    });
  }

  try {
    const config = loadConfig();
    const client = createCloudClient({
      supabaseUrl: config.supabaseUrl!,
      supabaseKey: config.supabaseKey!,
      deviceId: config.deviceId,
    });

    // 클라우드 검색
    const result: SearchCasesOutput = await client.searchCases({
      error_message: input.error_message,
      error_signature: input.error_signature,
      environment,
      signature_hash: signatureHash,
      limit: input.limit,
    });

    if (!result.group || result.variants.length === 0) {
      return JSON.stringify({
        found: false,
        message: 'No similar errors found in the knowledge base.',
        suggestions: [
          'Try normalizing the error message with placeholders',
          'Check if the error message is complete',
          'After resolving, use fixhive_report_resolution to contribute',
        ],
      });
    }

    // 결과 포맷팅 (단일 그룹)
    const formattedResult = {
      groupId: result.group.id,
      errorSignature: result.group.error_signature,
      totalReports: result.group.total_reports,
      variantCount: result.variants.length,
      solutions: result.variants.map((v) => ({
        rank: v.rank,
        variantId: v.id,
        solution: v.solution,
        cause: v.cause,
        matchScore: Math.round(v.environment_match * 100) + '%',
        matchReason: v.match_reason,
        successRate: Math.round(v.success_rate * 100) + '%',
        votes: v.score,
        solutionSteps: v.solution_steps,
      })),
    };

    return JSON.stringify({
      found: true,
      result: formattedResult,
      hint: 'Use fixhive_report_resolution to report whether a solution worked, or fixhive_vote to upvote/downvote.',
    });
  } catch (error) {
    logger.error('Search failed', { error });
    return JSON.stringify({
      found: false,
      error: error instanceof Error ? error.message : 'Search failed',
    });
  }
}
