/**
 * search_cases - CodeCaseDB v2.0 에러 솔루션 검색
 *
 * 에러 메시지와 환경 정보로 유사 케이스를 검색합니다.
 * pgvector 유사도 + 환경 매칭 + 랭킹 알고리즘으로 최적의 해결책을 반환합니다.
 */
import { z } from 'zod';
export declare const searchCasesToolName = "fixhive_search_cases";
export declare const searchCasesToolSchema: {
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
};
export declare const searchCasesInputSchema: z.ZodObject<{
    error_message: z.ZodString;
    error_signature: z.ZodOptional<z.ZodString>;
    language: z.ZodOptional<z.ZodString>;
    framework: z.ZodOptional<z.ZodString>;
    packages: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    error_message: string;
    limit: number;
    error_signature?: string | undefined;
    language?: string | undefined;
    framework?: string | undefined;
    packages?: Record<string, string> | undefined;
}, {
    error_message: string;
    error_signature?: string | undefined;
    language?: string | undefined;
    framework?: string | undefined;
    packages?: Record<string, string> | undefined;
    limit?: number | undefined;
}>;
export type SearchCasesInput = z.infer<typeof searchCasesInputSchema>;
export declare function handleSearchCases(input: SearchCasesInput): Promise<string>;
//# sourceMappingURL=search-cases.tool.d.ts.map