// 툴 관련 타입
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  isFree: boolean;
  llmType?: string;
  url: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 스택 관련 타입
export interface Stack {
  id: string;
  title: string;
  description: string;
  toolIds: string[];
  creatorId: string;
  isPublic: boolean;
  isFeatured: boolean;
  purpose: string;
  steps?: string[];
  saveCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 챌린지 관련 타입
export interface Challenge {
  id: string;
  stackId: string;
  title: string;
  description: string;
  instructions: string[];
  rewardBadge: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  createdAt: Date;
}

// 사용자 관련 타입
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  level: number;
  xp: number;
  badges: string[];
  savedStacks: string[];
  createdStacks: string[];
  completedChallenges: string[];
  ongoingChallenges: string[];
  createdAt: Date;
}

// 챌린지 실행 관련 타입
export interface ChallengeExecution {
  id: string;
  challengeId: string;
  userId: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  submissionType: 'image' | 'text' | 'link';
  submissionData: string;
  feedback?: string;
  completedAt?: Date;
  createdAt: Date;
}