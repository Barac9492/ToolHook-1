import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Tool, Stack } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return '방금 전';
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  if (diffInHours < 72) return `${Math.floor(diffInHours / 24)}일 전`;
  
  return formatDate(date);
}

// 최근 3일 이내에 추가된 툴인지 확인
export function isNewTool(tool: Tool): boolean {
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  return tool.createdAt > threeDaysAgo;
}

// 스택에 포함된 무료 툴 비율 계산
export function getFreeToolsPercentage(stack: Stack, tools: Tool[]): number {
  const stackTools = tools.filter(tool => stack.toolIds.includes(tool.id));
  if (stackTools.length === 0) return 0;
  
  const freeTools = stackTools.filter(tool => tool.isFree);
  return Math.round((freeTools.length / stackTools.length) * 100);
}

// 레벨에 따른 XP 요구치 계산
export function getXpRequiredForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// 사용자 레벨 진행도 계산 (0-100%)
export function getLevelProgress(currentXp: number, level: number): number {
  const requiredXp = getXpRequiredForLevel(level + 1);
  const previousLevelXp = getXpRequiredForLevel(level);
  const levelXpRange = requiredXp - previousLevelXp;
  const userXpInLevel = currentXp - previousLevelXp;
  
  return Math.min(100, Math.floor((userXpInLevel / levelXpRange) * 100));
}

// 스택 ID에서 슬러그 생성
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

// 툴 카테고리별 색상 매핑
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    '텍스트 생성': 'bg-blue-500',
    '이미지 생성': 'bg-purple-500',
    '비디오 편집': 'bg-red-500',
    '코딩 도구': 'bg-green-500',
    '음성 생성': 'bg-yellow-500',
    '데이터 분석': 'bg-indigo-500',
    '자동화': 'bg-orange-500',
  };
  
  return colors[category] || 'bg-gray-500';
}