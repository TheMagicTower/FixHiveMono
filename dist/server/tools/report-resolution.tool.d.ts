/**
 * report_resolution - CodeCaseDB v2.0 해결책 보고
 *
 * 에러 해결 과정을 커뮤니티에 공유합니다.
 * 새 해결책을 등록하거나, 기존 해결책이 도움이 되었음을 보고합니다.
 */
import { z } from 'zod';
export declare const reportResolutionToolName = "fixhive_report_resolution";
export declare const reportResolutionToolSchema: {
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
};
export declare const reportResolutionInputSchema: z.ZodObject<{
    error_message: z.ZodString;
    error_signature: z.ZodString;
    stack_trace: z.ZodOptional<z.ZodString>;
    cause: z.ZodOptional<z.ZodString>;
    solution: z.ZodOptional<z.ZodString>;
    solution_steps: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    code_diff: z.ZodOptional<z.ZodString>;
    language: z.ZodOptional<z.ZodString>;
    framework: z.ZodOptional<z.ZodString>;
    packages: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    solved: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    used_variant_id: z.ZodOptional<z.ZodString>;
    what_was_tried: z.ZodOptional<z.ZodString>;
    time_spent: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    error_message: string;
    error_signature: string;
    solved: boolean;
    language?: string | undefined;
    framework?: string | undefined;
    packages?: Record<string, string> | undefined;
    stack_trace?: string | undefined;
    cause?: string | undefined;
    solution?: string | undefined;
    solution_steps?: string[] | undefined;
    code_diff?: string | undefined;
    used_variant_id?: string | undefined;
    what_was_tried?: string | undefined;
    time_spent?: number | undefined;
}, {
    error_message: string;
    error_signature: string;
    language?: string | undefined;
    framework?: string | undefined;
    packages?: Record<string, string> | undefined;
    stack_trace?: string | undefined;
    cause?: string | undefined;
    solution?: string | undefined;
    solution_steps?: string[] | undefined;
    code_diff?: string | undefined;
    solved?: boolean | undefined;
    used_variant_id?: string | undefined;
    what_was_tried?: string | undefined;
    time_spent?: number | undefined;
}>;
export type ReportResolutionInput = z.infer<typeof reportResolutionInputSchema>;
export declare function handleReportResolution(input: ReportResolutionInput): Promise<string>;
//# sourceMappingURL=report-resolution.tool.d.ts.map