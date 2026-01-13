/**
 * 설정 스키마 - Zod를 사용한 환경 변수 검증
 *
 * CodeCaseDB v2.0: device_id는 shared 패키지에서 자동 관리
 */
import { z } from 'zod';
export const configSchema = z.object({
    // Supabase 설정 (선택적 - 없으면 오프라인 모드)
    supabaseUrl: z
        .string()
        .url('FIXHIVE_SUPABASE_URL must be a valid URL')
        .optional(),
    supabaseKey: z
        .string()
        .min(1, 'FIXHIVE_SUPABASE_KEY cannot be empty')
        .optional(),
    // 로컬 DB 경로
    localDbPath: z.string().default('~/.fixhive/data.db'),
    // 로그 레벨
    logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});
// Supabase 설정 검증 (둘 다 있거나 둘 다 없어야 함)
export const validateSupabaseConfig = (config) => {
    const hasUrl = !!config.supabaseUrl;
    const hasKey = !!config.supabaseKey;
    if (hasUrl !== hasKey) {
        throw new Error('FIXHIVE_SUPABASE_URL and FIXHIVE_SUPABASE_KEY must both be set or both be unset');
    }
    return hasUrl && hasKey;
};
//# sourceMappingURL=schema.js.map