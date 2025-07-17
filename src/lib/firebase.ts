// Firebase 관련 타입과 함수들을 조건부로 import
let db: any = null;
let auth: any = null;
let storage: any = null;
let app: any = null;

// Firebase 초기화 함수
const initializeFirebase = () => {
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

    // 동적으로 Firebase 모듈 import
    const { initializeApp, getApps } = require('firebase/app');
    const { getFirestore } = require('firebase/firestore');
    const { getAuth } = require('firebase/auth');
    const { getStorage } = require('firebase/storage');

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    // Firebase 초기화 (중복 초기화 방지)
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    
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