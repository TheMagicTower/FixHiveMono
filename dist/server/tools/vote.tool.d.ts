/**
 * vote - CodeCaseDB v2.0 투표
 *
 * 해결책의 품질을 평가합니다 (upvote/downvote/report).
 */
import { z } from 'zod';
export declare const voteToolName = "fixhive_vote";
export declare const voteToolSchema: {
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
};
export declare const voteInputSchema: z.ZodObject<{
    variant_id: z.ZodString;
    value: z.ZodEnum<["up", "down", "report"]>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    value: "up" | "down" | "report";
    variant_id: string;
    reason?: string | undefined;
}, {
    value: "up" | "down" | "report";
    variant_id: string;
    reason?: string | undefined;
}>;
export type VoteInput = z.infer<typeof voteInputSchema>;
export declare function handleVote(input: VoteInput): Promise<string>;
//# sourceMappingURL=vote.tool.d.ts.map