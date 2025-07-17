import { db, isFirebaseInitialized } from './firebase';
import { Tool, Stack, Challenge, User, ChallengeExecution } from '@/types';
import {
    collection as firestoreCollection,
    query as firestoreQuery,
    where as firestoreWhere,
    orderBy as firestoreOrderBy,
    limit as firestoreLimit,
    getDocs as firestoreGetDocs,
    getDoc as firestoreGetDoc,
    doc as firestoreDoc,
    addDoc as firestoreAddDoc,
    updateDoc as firestoreUpdateDoc,
    Timestamp as FirestoreTimestamp,
    serverTimestamp as firestoreServerTimestamp,
    DocumentData,
    QueryDocumentSnapshot
} from 'firebase/firestore';

// Firebase 함수들 정의
let collection = firestoreCollection;
let query = firestoreQuery;
let where = firestoreWhere;
let orderBy = firestoreOrderBy;
let limit = firestoreLimit;
let getDocs = firestoreGetDocs;
let getDoc = firestoreGetDoc;
let doc = firestoreDoc;
let addDoc = firestoreAddDoc;
let updateDoc = firestoreUpdateDoc;
let Timestamp = FirestoreTimestamp;
let serverTimestamp = firestoreServerTimestamp;

// 임시 데이터 생성 함수 (Firebase가 설정되지 않았을 때 사용)
const createMockTools = (count: number = 5): Tool[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `tool-${i + 1}`,
        name: `AI 툴 ${i + 1}`,
        description: `이 툴은 ${['텍스트 생성', '이미지 편집', '비디오 제작'][i % 3]}에 특화된 AI 도구입니다.`,
        category: ['텍스트 생성', '이미지 생성', '비디오 편집', '코딩 도구', '음성 생성'][i % 5],
        isFree: i % 3 === 0,
        llmType: ['GPT-4', 'Claude', 'Gemini', 'Llama', 'Mistral'][i % 5],
        url: 'https://example.com',
        imageUrl: '',
        createdAt: new Date(Date.now() - i * 86400000), // i일 전
        updatedAt: new Date(Date.now() - i * 86400000),
    }));
};

const createMockStacks = (count: number = 3): Stack[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `stack-${i + 1}`,
        title: [
            '블로그 콘텐츠 제작 세트',
            '이메일 자동화 조합',
            '디자인 워크플로우',
            '개발자 생산성 스택',
            '소셜미디어 콘텐츠 팩토리'
        ][i % 5],
        description: `이 스택은 ${['콘텐츠 제작', '자동화', '디자인', '개발', '마케팅'][i % 5]} 작업을 효율적으로 수행하기 위한 최적의 조합입니다.`,
        toolIds: ['tool-1', 'tool-2', 'tool-3'],
        creatorId: 'user-1',
        isPublic: true,
        isFeatured: i < 3,
        purpose: ['콘텐츠 제작', '자동화', '디자인', '개발', '마케팅'][i % 5],
        steps: [
            '1단계: 아이디어 생성',
            '2단계: 초안 작성',
            '3단계: 시각화'
        ],
        saveCount: 100 - i * 20,
        createdAt: new Date(Date.now() - i * 86400000),
        updatedAt: new Date(Date.now() - i * 86400000),
    }));
};

const createMockChallenges = (count: number = 3): Challenge[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `challenge-${i + 1}`,
        stackId: `stack-${i + 1}`,
        title: [
            'AI로 블로그 썸네일 만들기',
            '자동 이메일 응답 시스템 구축',
            '프레젠테이션 슬라이드 자동화'
        ][i % 3],
        description: `이 챌린지는 ${['디자인', '자동화', '프레젠테이션'][i % 3]} 작업을 AI 툴로 효율적으로 수행하는 방법을 배울 수 있습니다.`,
        instructions: [
            '1단계: 필요한 툴 설치하기',
            '2단계: 프롬프트 작성하기',
            '3단계: 결과물 생성하기'
        ],
        rewardBadge: ['디자인 마스터', '자동화 전문가', '프레젠테이션 고수'][i % 3],
        difficulty: ['beginner', 'intermediate', 'advanced'][i % 3] as 'beginner' | 'intermediate' | 'advanced',
        estimatedTime: [15, 30, 45][i % 3],
        createdAt: new Date(Date.now() - i * 86400000),
    }));
};

// 서버 컴포넌트에서 Firebase 데이터 가져오기 (오류 방지)
const safeFirebaseQuery = async <T>(queryFn: () => Promise<T>, mockData: T): Promise<T> => {
    // Firebase가 초기화되지 않은 경우 즉시 mock 데이터 반환
    if (!db || !isFirebaseInitialized) {
        return mockData;
    }
    
    try {
        return await queryFn();
    } catch (error) {
        // Firebase 오류 발생 시 mock 데이터 반환
        return mockData;
    }
};

// Tools 관련 서비스
export const toolsService = {
    // 최근 추가된 툴 가져오기
    async getRecentTools(days: number = 3, limitCount: number = 5): Promise<Tool[]> {
        return safeFirebaseQuery(async () => {
            const daysAgo = new Date();
            daysAgo.setDate(daysAgo.getDate() - days);

            const q = query(
                collection(db, 'tools'),
                where('createdAt', '>=', Timestamp.fromDate(daysAgo)),
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
                const data = docSnapshot.data();
                return {
                    id: docSnapshot.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date()
                } as Tool;
            });
        }, createMockTools(limitCount));
    },

    // 카테고리별 툴 가져오기
    async getToolsByCategory(category: string): Promise<Tool[]> {
        return safeFirebaseQuery(async () => {
            const q = query(
                collection(db, 'tools'),
                where('category', '==', category),
                orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
                const data = docSnapshot.data();
                return {
                    id: docSnapshot.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date()
                } as Tool;
            });
        }, createMockTools(10).filter(tool => tool.category === category));
    },

    // 무료 툴만 가져오기
    async getFreeTools(limitCount: number = 20): Promise<Tool[]> {
        return safeFirebaseQuery(async () => {
            const q = query(
                collection(db, 'tools'),
                where('isFree', '==', true),
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
                const data = docSnapshot.data();
                return {
                    id: docSnapshot.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date()
                } as Tool;
            });
        }, createMockTools(limitCount).filter(tool => tool.isFree));
    },

    // 툴 상세 정보 가져오기
    async getToolById(id: string): Promise<Tool | null> {
        return safeFirebaseQuery(async () => {
            const docRef = doc(db, 'tools', id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) return null;

            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date()
            } as Tool;
        }, createMockTools(10).find(tool => tool.id === id) || null);
    },

    // 새 툴 추가하기
    async addTool(tool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        return safeFirebaseQuery(async () => {
            const docRef = await addDoc(collection(db, 'tools'), {
                ...tool,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            return docRef.id;
        }, `mock-tool-${Date.now()}`);
    }
};

// Stacks 관련 서비스
export const stacksService = {
    // 인기 스택 가져오기
    async getPopularStacks(limitCount: number = 3): Promise<Stack[]> {
        return safeFirebaseQuery(async () => {
            const q = query(
                collection(db, 'stacks'),
                where('isPublic', '==', true),
                orderBy('saveCount', 'desc'),
                limit(limitCount)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
                const data = docSnapshot.data();
                return {
                    id: docSnapshot.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date()
                } as Stack;
            });
        }, createMockStacks(limitCount));
    },

    // 에디터 추천 스택 가져오기
    async getFeaturedStacks(limitCount: number = 3): Promise<Stack[]> {
        return safeFirebaseQuery(async () => {
            const q = query(
                collection(db, 'stacks'),
                where('isFeatured', '==', true),
                where('isPublic', '==', true),
                limit(limitCount)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
                const data = docSnapshot.data();
                return {
                    id: docSnapshot.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date()
                } as Stack;
            });
        }, createMockStacks(limitCount).filter(stack => stack.isFeatured));
    },

    // 사용자가 만든 스택 가져오기
    async getUserStacks(userId: string): Promise<Stack[]> {
        return safeFirebaseQuery(async () => {
            const q = query(
                collection(db, 'stacks'),
                where('creatorId', '==', userId),
                orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
                const data = docSnapshot.data();
                return {
                    id: docSnapshot.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date()
                } as Stack;
            });
        }, createMockStacks(2));
    },

    // 사용자가 저장한 스택 가져오기
    async getSavedStacks(stackIds: string[]): Promise<Stack[]> {
        return safeFirebaseQuery(async () => {
            if (stackIds.length === 0) return [];

            const stacks: Stack[] = [];

            // Firestore는 'in' 쿼리에서 최대 10개의 값만 허용하므로 배치 처리
            for (let i = 0; i < stackIds.length; i += 10) {
                const batch = stackIds.slice(i, i + 10);
                const q = query(
                    collection(db, 'stacks'),
                    where('id', 'in', batch)
                );

                const snapshot = await getDocs(q);
                stacks.push(...snapshot.docs.map((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
                    const data = docSnapshot.data();
                    return {
                        id: docSnapshot.id,
                        ...data,
                        createdAt: data.createdAt?.toDate() || new Date(),
                        updatedAt: data.updatedAt?.toDate() || new Date()
                    } as Stack;
                }));
            }

            return stacks;
        }, createMockStacks(stackIds.length));
    },

    // 스택 상세 정보 가져오기
    async getStackById(id: string): Promise<Stack | null> {
        return safeFirebaseQuery(async () => {
            const docRef = doc(db, 'stacks', id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) return null;

            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date()
            } as Stack;
        }, createMockStacks(5).find(stack => stack.id === id) || null);
    },

    // 새 스택 추가하기
    async addStack(stack: Omit<Stack, 'id' | 'createdAt' | 'updatedAt' | 'saveCount'>): Promise<string> {
        return safeFirebaseQuery(async () => {
            const docRef = await addDoc(collection(db, 'stacks'), {
                ...stack,
                saveCount: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            return docRef.id;
        }, `mock-stack-${Date.now()}`);
    },

    // 스택 저장 카운트 증가
    async incrementSaveCount(stackId: string): Promise<void> {
        return safeFirebaseQuery(async () => {
            const stackRef = doc(db, 'stacks', stackId);
            await updateDoc(stackRef, {
                saveCount: serverTimestamp()
            });
        }, undefined);
    }
};

// Challenges 관련 서비스
export const challengesService = {
    // 현재 활성화된 챌린지 가져오기
    async getActiveChallenges(limitCount: number = 5): Promise<Challenge[]> {
        return safeFirebaseQuery(async () => {
            const q = query(
                collection(db, 'challenges'),
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
                const data = docSnapshot.data();
                return {
                    id: docSnapshot.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date()
                } as Challenge;
            });
        }, createMockChallenges(limitCount));
    },

    // 스택에 연결된 챌린지 가져오기
    async getChallengesByStackId(stackId: string): Promise<Challenge[]> {
        return safeFirebaseQuery(async () => {
            const q = query(
                collection(db, 'challenges'),
                where('stackId', '==', stackId)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
                const data = docSnapshot.data();
                return {
                    id: docSnapshot.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date()
                } as Challenge;
            });
        }, createMockChallenges(1).filter(challenge => challenge.stackId === stackId));
    },

    // 챌린지 실행 결과 제출하기
    async submitChallengeExecution(execution: Omit<ChallengeExecution, 'id' | 'createdAt'>): Promise<string> {
        return safeFirebaseQuery(async () => {
            const docRef = await addDoc(collection(db, 'executions'), {
                ...execution,
                createdAt: serverTimestamp()
            });

            return docRef.id;
        }, `mock-execution-${Date.now()}`);
    },

    // 사용자의 챌린지 실행 내역 가져오기
    async getUserChallengeExecutions(userId: string): Promise<ChallengeExecution[]> {
        return safeFirebaseQuery(async () => {
            const q = query(
                collection(db, 'executions'),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
                const data = docSnapshot.data();
                return {
                    id: docSnapshot.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    completedAt: data.completedAt?.toDate()
                } as ChallengeExecution;
            });
        }, []);
    }
};

// Users 관련 서비스
export const usersService = {
    // 사용자 정보 가져오기
    async getUserById(userId: string): Promise<User | null> {
        return safeFirebaseQuery(async () => {
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) return null;

            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date()
            } as User;
        }, null);
    },

    // 사용자 스택 저장하기
    async saveStackToUser(userId: string, stackId: string): Promise<void> {
        return safeFirebaseQuery(async () => {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                savedStacks: serverTimestamp()
            });
        }, undefined);
    },

    // 사용자 XP 증가 및 레벨업 처리
    async addUserXp(userId: string, xpAmount: number): Promise<void> {
        return safeFirebaseQuery(async () => {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) return;

            const userData = userSnap.data() as User;
            const newXp = userData.xp + xpAmount;
            let newLevel = userData.level;

            // 레벨업 체크
            while (newXp >= 100 * Math.pow(1.5, newLevel - 1)) {
                newLevel++;
            }

            await updateDoc(userRef, {
                xp: newXp,
                level: newLevel
            });
        }, undefined);
    },

    // 사용자에게 뱃지 추가
    async addBadgeToUser(userId: string, badgeId: string): Promise<void> {
        return safeFirebaseQuery(async () => {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                badges: serverTimestamp()
            });
        }, undefined);
    }
};