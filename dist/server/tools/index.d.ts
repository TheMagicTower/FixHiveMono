/**
 * 도구 등록 배럴 - CodeCaseDB v2.0
 *
 * 3개의 핵심 도구:
 * - search_cases: 에러 솔루션 검색
 * - report_resolution: 해결책 보고
 * - vote: 투표 (upvote/downvote/report)
 */
export declare const toolSchemas: ({
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            error_message: {
                type: string;
                description: string;
            };
            error_signature: {
                type: string;
                description: string;
            };
            language: {
                type: string;
                description: string;
            };
            framework: {
                type: string;
                description: string;
            };
            packages: {
                type: string;
                description: string;
                additionalProperties: {
                    type: string;
                };
            };
            limit: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            error_message: {
                type: string;
                description: string;
            };
            error_signature: {
                type: string;
                description: string;
            };
            stack_trace: {
                type: string;
                description: string;
            };
            cause: {
                type: string;
                description: string;
            };
            solution: {
                type: string;
                description: string;
            };
            solution_steps: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            code_diff: {
                type: string;
                description: string;
            };
            language: {
                type: string;
                description: string;
            };
            framework: {
                type: string;
                description: string;
            };
            packages: {
                type: string;
                description: string;
                additionalProperties: {
                    type: string;
                };
            };
            solved: {
                type: string;
                description: string;
            };
            used_variant_id: {
                type: string;
                description: string;
            };
            what_was_tried: {
                type: string;
                description: string;
            };
            time_spent: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            variant_id: {
                type: string;
                description: string;
            };
            value: {
                type: string;
                enum: string[];
                description: string;
            };
            reason: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
})[];
/**
 * 도구 호출 처리
 */
export declare function handleToolCall(name: string, args: unknown): Promise<{
    content: Array<{
        type: 'text';
        text: string;
    }>;
    isError?: boolean;
}>;
/**
 * 도구 목록 반환
 */
export declare function getToolList(): {
    tools: ({
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                error_message: {
                    type: string;
                    description: string;
                };
                error_signature: {
                    type: string;
                    description: string;
                };
                language: {
                    type: string;
                    description: string;
                };
                framework: {
                    type: string;
                    description: string;
                };
                packages: {
                    type: string;
                    description: string;
                    additionalProperties: {
                        type: string;
                    };
                };
                limit: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                error_message: {
                    type: string;
                    description: string;
                };
                error_signature: {
                    type: string;
                    description: string;
                };
                stack_trace: {
                    type: string;
                    description: string;
                };
                cause: {
                    type: string;
                    description: string;
                };
                solution: {
                    type: string;
                    description: string;
                };
                solution_steps: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
                code_diff: {
                    type: string;
                    description: string;
                };
                language: {
                    type: string;
                    description: string;
                };
                framework: {
                    type: string;
                    description: string;
                };
                packages: {
                    type: string;
                    description: string;
                    additionalProperties: {
                        type: string;
                    };
                };
                solved: {
                    type: string;
                    description: string;
                };
                used_variant_id: {
                    type: string;
                    description: string;
                };
                what_was_tried: {
                    type: string;
                    description: string;
                };
                time_spent: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                variant_id: {
                    type: string;
                    description: string;
                };
                value: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                reason: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    })[];
};
//# sourceMappingURL=index.d.ts.map