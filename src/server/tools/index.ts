/**
 * 도구 등록 배럴 - CodeCaseDB v2.0
 *
 * 3개의 핵심 도구:
 * - search_cases: 에러 솔루션 검색
 * - report_resolution: 해결책 보고
 * - vote: 투표 (upvote/downvote/report)
 */

import { handleToolError } from '../../utils/errors.js';

// 도구 임포트
import {
  searchCasesToolName,
  searchCasesToolSchema,
  searchCasesInputSchema,
  handleSearchCases,
} from './search-cases.tool.js';

import {
  reportResolutionToolName,
  reportResolutionToolSchema,
  reportResolutionInputSchema,
  handleReportResolution,
} from './report-resolution.tool.js';

import {
  voteToolName,
  voteToolSchema,
  voteInputSchema,
  handleVote,
} from './vote.tool.js';

// 모든 도구 스키마 내보내기
export const toolSchemas = [
  searchCasesToolSchema,
  reportResolutionToolSchema,
  voteToolSchema,
];

// 도구 핸들러 맵
type ToolHandler = (args: unknown) => Promise<string>;

const toolHandlers: Record<string, { schema: unknown; handler: ToolHandler }> = {
  [searchCasesToolName]: {
    schema: searchCasesInputSchema,
    handler: async (args) => handleSearchCases(searchCasesInputSchema.parse(args)),
  },
  [reportResolutionToolName]: {
    schema: reportResolutionInputSchema,
    handler: async (args) =>
      handleReportResolution(reportResolutionInputSchema.parse(args)),
  },
  [voteToolName]: {
    schema: voteInputSchema,
    handler: async (args) => handleVote(voteInputSchema.parse(args)),
  },
};

/**
 * 도구 호출 처리
 */
export async function handleToolCall(
  name: string,
  args: unknown
): Promise<{
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}> {
  const tool = toolHandlers[name];

  if (!tool) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: `Unknown tool: ${name}` }),
        },
      ],
    };
  }

  try {
    const result = await tool.handler(args);
    return {
      content: [{ type: 'text', text: result }],
    };
  } catch (error) {
    return handleToolError(error);
  }
}

/**
 * 도구 목록 반환
 */
export function getToolList() {
  return {
    tools: toolSchemas,
  };
}
