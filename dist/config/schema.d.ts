/**
 * 설정 스키마 - Zod를 사용한 환경 변수 검증
 *
 * CodeCaseDB v2.0: device_id는 shared 패키지에서 자동 관리
 */
import { z } from 'zod';
export declare const configSchema: z.ZodObject<{
    supabaseUrl: z.ZodOptional<z.ZodString>;
    supabaseKey: z.ZodOptional<z.ZodString>;
    localDbPath: z.ZodDefault<z.ZodString>;
    logLevel: z.ZodDefault<z.ZodEnum<["debug", "info", "warn", "error"]>>;
}, "strip", z.ZodTypeAny, {
    localDbPath: string;
    logLevel: "debug" | "info" | "warn" | "error";
    supabaseUrl?: string | undefined;
    supabaseKey?: string | undefined;
}, {
    supabaseUrl?: string | undefined;
    supabaseKey?: string | undefined;
    localDbPath?: string | undefined;
    logLevel?: "debug" | "info" | "warn" | "error" | undefined;
}>;
export type ConfigSchema = z.infer<typeof configSchema>;
export declare const validateSupabaseConfig: (config: ConfigSchema) => boolean;
//# sourceMappingURL=schema.d.ts.map