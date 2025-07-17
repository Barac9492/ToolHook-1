import { FirebaseApp, initializeApp, getApps } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Auth, getAuth } from 'firebase/auth';
import { FirebaseStorage, getStorage } from 'firebase/storage';

// Firebase 관련 타입과 함수들 정의
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;
let app: FirebaseApp | null = null;

// Firebase 초기화 함수
const initializeFirebase = (): boolean => {
  try {
    // 환경 변수가 설정되어 있고 유효한 경우에만 Firebase 초기화
    const hasValidConfig = 
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "temp-api-key" &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "temp-project";

    if (!hasValidConfig) {
      console.log('Firebase config not found, using mock data');
      return false;
    }

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    // Firebase 초기화 (중복 초기화 방지)
    const apps = getApps();
    app = apps.length ? apps[0] : initializeApp(firebaseConfig);
    
    // Firebase 서비스 초기화
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);

    return true;
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
    return false;
  }
};

// Firebase 초기화 시도
const isFirebaseInitialized = initializeFirebase();

export { db, auth, storage, isFirebaseInitialized };
export default app;