import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Tool, Stack, Challenge, User, ChallengeExecution } from '@/types';

// Tools 관련 서비스
export const toolsService = {
  // 최근 추가된 툴 가져오기
  async getRecentTools(days: number = 3, limitCount: number = 5): Promise<Tool[]> {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    
    const q = query(
      collection(db, 'tools'),
      where('createdAt', '>=', Timestamp.fromDate(daysAgo)),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    } as Tool));
  },
  
  // 카테고리별 툴 가져오기
  async getToolsByCategory(category: string): Promise<Tool[]> {
    const q = query(
      collection(db, 'tools'),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    } as Tool));
  },
  
  // 무료 툴만 가져오기
  async getFreeTools(limitCount: number = 20): Promise<Tool[]> {
    const q = query(
      collection(db, 'tools'),
      where('isFree', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    } as Tool));
  },
  
  // 툴 상세 정보 가져오기
  async getToolById(id: string): Promise<Tool | null> {
    const docRef = doc(db, 'tools', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt.toDate(),
      updatedAt: docSnap.data().updatedAt.toDate()
    } as Tool;
  },
  
  // 새 툴 추가하기
  async addTool(tool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'tools'), {
      ...tool,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  }
};

// Stacks 관련 서비스
export const stacksService = {
  // 인기 스택 가져오기
  async getPopularStacks(limitCount: number = 3): Promise<Stack[]> {
    const q = query(
      collection(db, 'stacks'),
      where('isPublic', '==', true),
      orderBy('saveCount', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    } as Stack));
  },
  
  // 에디터 추천 스택 가져오기
  async getFeaturedStacks(limitCount: number = 3): Promise<Stack[]> {
    const q = query(
      collection(db, 'stacks'),
      where('isFeatured', '==', true),
      where('isPublic', '==', true),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    } as Stack));
  },
  
  // 사용자가 만든 스택 가져오기
  async getUserStacks(userId: string): Promise<Stack[]> {
    const q = query(
      collection(db, 'stacks'),
      where('creatorId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    } as Stack));
  },
  
  // 사용자가 저장한 스택 가져오기
  async getSavedStacks(stackIds: string[]): Promise<Stack[]> {
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
      stacks.push(...snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      } as Stack)));
    }
    
    return stacks;
  },
  
  // 스택 상세 정보 가져오기
  async getStackById(id: string): Promise<Stack | null> {
    const docRef = doc(db, 'stacks', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt.toDate(),
      updatedAt: docSnap.data().updatedAt.toDate()
    } as Stack;
  },
  
  // 새 스택 추가하기
  async addStack(stack: Omit<Stack, 'id' | 'createdAt' | 'updatedAt' | 'saveCount'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'stacks'), {
      ...stack,
      saveCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  },
  
  // 스택 저장 카운트 증가
  async incrementSaveCount(stackId: string): Promise<void> {
    const stackRef = doc(db, 'stacks', stackId);
    await updateDoc(stackRef, {
      saveCount: serverTimestamp()
    });
  }
};

// Challenges 관련 서비스
export const challengesService = {
  // 현재 활성화된 챌린지 가져오기
  async getActiveChallenges(limitCount: number = 5): Promise<Challenge[]> {
    const q = query(
      collection(db, 'challenges'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    } as Challenge));
  },
  
  // 스택에 연결된 챌린지 가져오기
  async getChallengesByStackId(stackId: string): Promise<Challenge[]> {
    const q = query(
      collection(db, 'challenges'),
      where('stackId', '==', stackId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    } as Challenge));
  },
  
  // 챌린지 실행 결과 제출하기
  async submitChallengeExecution(execution: Omit<ChallengeExecution, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'executions'), {
      ...execution,
      createdAt: serverTimestamp()
    });
    
    return docRef.id;
  },
  
  // 사용자의 챌린지 실행 내역 가져오기
  async getUserChallengeExecutions(userId: string): Promise<ChallengeExecution[]> {
    const q = query(
      collection(db, 'executions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      completedAt: doc.data().completedAt?.toDate()
    } as ChallengeExecution));
  }
};

// Users 관련 서비스
export const usersService = {
  // 사용자 정보 가져오기
  async getUserById(userId: string): Promise<User | null> {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt.toDate()
    } as User;
  },
  
  // 사용자 스택 저장하기
  async saveStackToUser(userId: string, stackId: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      savedStacks: serverTimestamp()
    });
  },
  
  // 사용자 XP 증가 및 레벨업 처리
  async addUserXp(userId: string, xpAmount: number): Promise<void> {
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
  },
  
  // 사용자에게 뱃지 추가
  async addBadgeToUser(userId: string, badge: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      badges: serverTimestamp()
    });
  }
};