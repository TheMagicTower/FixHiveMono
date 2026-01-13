/**
 * FixHive TypeScript 타입 정의
 *
 * CodeCaseDB v2.0: 공유 타입 재사용
 */
export type { Device, CaseGroup, CaseVariant, Resolution, Vote, Environment, SearchCasesInput, SearchCasesResult, SearchCasesOutput, ReportResolutionInput, ReportResolutionOutput, VoteInput, VoteOutput, RankedVariant, FilterResult, } from '@the-magic-tower/fixhive-shared';
export interface FixHiveConfig {
    supabaseUrl?: string;
    supabaseKey?: string;
    deviceId: string;
    localDbPath: string;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
}
export interface LocalCachedCase {
    groupId: string;
    errorSignature: string;
    errorSignatureHash: string;
    language: string;
    framework?: string;
    cachedAt: Date;
    expiresAt: Date;
}
export interface LocalCachedVariant {
    id: string;
    groupId: string;
    environment: string;
    cause?: string;
    solution?: string;
    solutionSteps?: string;
    successRate: number;
    score: number;
    cachedAt: Date;
}
export interface LocalPendingResolution {
    id: string;
    errorMessage: string;
    errorSignature: string;
    environment: string;
    cause?: string;
    solution?: string;
    solved: boolean;
    createdAt: Date;
    syncedAt?: Date;
}
//# sourceMappingURL=index.d.ts.map