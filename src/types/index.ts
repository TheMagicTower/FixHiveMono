/**
 * FixHive TypeScript 타입 정의
 *
 * CodeCaseDB v2.0: 공유 타입 재사용
 */

// 공유 패키지에서 타입 재export
export type {
  Device,
  CaseGroup,
  CaseVariant,
  Resolution,
  Vote,
  Environment,
  SearchCasesInput,
  SearchCasesResult,
  SearchCasesOutput,
  ReportResolutionInput,
  ReportResolutionOutput,
  VoteInput,
  VoteOutput,
  RankedVariant,
  FilterResult,
} from '@the-magic-tower/fixhive-shared';

// 설정
export interface FixHiveConfig {
  supabaseUrl?: string;
  supabaseKey?: string;
  deviceId: string;
  localDbPath: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// 로컬 캐시용 타입
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
  environment: string; // JSON
  cause?: string;
  solution?: string;
  solutionSteps?: string; // JSON
  successRate: number;
  score: number;
  cachedAt: Date;
}

export interface LocalPendingResolution {
  id: string;
  errorMessage: string;
  errorSignature: string;
  environment: string; // JSON
  cause?: string;
  solution?: string;
  solved: boolean;
  createdAt: Date;
  syncedAt?: Date;
}
