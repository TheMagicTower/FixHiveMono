#!/usr/bin/env node
/**
 * PostToolUse Hook Handler - 도구 출력에서 에러 자동 감지
 *
 * Claude Code의 PostToolUse 훅에서 호출됩니다.
 * CodeCaseDB v2.0: 간소화된 버전 (로컬 저장 없이 감지만)
 *
 * TODO: 로컬 캐싱 레이어 추가
 */
import { logger } from '../utils/logger.js';
/**
 * 에러 패턴 감지 (간소화 버전)
 */
function hasError(output) {
    const errorPatterns = [
        /error:/i,
        /exception:/i,
        /traceback/i,
        /failed:/i,
        /fatal:/i,
        /cannot find/i,
        /undefined is not/i,
        /is not defined/i,
        /syntaxerror/i,
        /typeerror/i,
        /referenceerror/i,
    ];
    return errorPatterns.some((pattern) => pattern.test(output));
}
async function main() {
    // stdin에서 입력 읽기
    const chunks = [];
    for await (const chunk of process.stdin) {
        chunks.push(chunk);
    }
    const input = Buffer.concat(chunks).toString('utf-8');
    if (!input.trim()) {
        process.exit(0);
    }
    let hookInput;
    try {
        hookInput = JSON.parse(input);
    }
    catch {
        // JSON 파싱 실패 - 무시
        process.exit(0);
    }
    const { tool_name, tool_output } = hookInput;
    // 에러가 없으면 빠르게 종료
    if (!hasError(tool_output)) {
        process.exit(0);
    }
    logger.info('Potential error detected', {
        toolName: tool_name,
    });
    // 사용자에게 알림 출력 (stdout)
    console.log(JSON.stringify({
        fixhive: {
            detected: true,
            message: 'FixHive detected a potential error. Use fixhive_search_cases to find solutions.',
            hint: 'Normalize the error message before searching for better results.',
        },
    }));
}
main().catch((error) => {
    logger.error('Hook handler error', { error });
    process.exit(1);
});
//# sourceMappingURL=post-tool-handler.js.map