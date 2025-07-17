import { User, Star, Award, BookOpen, Settings, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function MyPage() {
  // 로그인 상태 확인 (실제로는 서버 컴포넌트에서 세션 체크)
  const isLoggedIn = false; // 임시로 false로 설정
  
  // 사용자 데이터 (임시)
  const user = {
    id: 'user-1',
    displayName: '홍길동',
    email: 'user@example.com',
    level: 3,
    xp: 250,
    badges: ['텍스트 마스터 Lv.1', '이미지 생성 Lv.2', '자동화 전문가'],
    createdStacks: [
      {
        id: 'stack-1',
        title: '블로그 콘텐츠 제작 세트',
        description: '블로그 글 작성과 이미지 생성을 위한 툴 조합',
        toolCount: 3,
        isPublic: true,
        saveCount: 24,
        createdAt: new Date(),
      },
      {
        id: 'stack-2',
        title: '개인 프로젝트 관리 스택',
        description: '프로젝트 관리와 문서화를 위한 툴 조합',
        toolCount: 4,
        isPublic: false,
        saveCount: 0,
        createdAt: new Date(),
      }
    ],
    savedStacks: [
      {
        id: 'saved-stack-1',
        title: '디자이너가 애정하는 3종 세트',
        description: '디자인 작업을 효율적으로 수행하기 위한 최적의 조합',
        toolCount: 3,
        creatorName: '디자인마스터',
        saveCount: 156,
      },
      {
        id: 'saved-stack-2',
        title: '이메일 자동화 조합',
        description: '이메일 작성과 응답 자동화를 위한 툴 조합',
        toolCount: 3,
        creatorName: '자동화킹',
        saveCount: 89,
      }
    ],
    completedChallenges: [
      {
        id: 'challenge-1',
        title: 'AI로 블로그 썸네일 만들기',
        completedAt: new Date(),
        badge: '디자인 마스터 Lv.1',
        xpEarned: 100,
      }
    ],
    ongoingChallenges: [
      {
        id: 'challenge-2',
        title: '자동 이메일 응답 시스템 구축',
        progress: 50,
        badge: '자동화 전문가',
      }
    ]
  };
  
  // 레벨 진행도 계산
  const levelProgress = 65; // 임시 값
  
  // 다음 레벨까지 필요한 XP
  const xpToNextLevel = 150; // 임시 값
  
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg"></div>
                <span className="text-xl font-bold">툴훅툴훅</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-700 hover:text-purple-600">홈</Link>
                <Link href="/tools" className="text-gray-700 hover:text-purple-600">툴 탐색</Link>
                <Link href="/stacks" className="text-gray-700 hover:text-purple-600">스택</Link>
                <Link href="/challenges" className="text-gray-700 hover:text-purple-600">챌린지</Link>
                <Link href="/mypage" className="text-purple-600 font-semibold">마이페이지</Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
            <p className="text-gray-600 mb-6">
              마이페이지에서 내 스택, 저장한 스택, 챌린지 현황을 확인하려면 로그인해주세요.
            </p>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium">
              로그인하기
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg"></div>
              <span className="text-xl font-bold">툴훅툴훅</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-purple-600">홈</Link>
              <Link href="/tools" className="text-gray-700 hover:text-purple-600">툴 탐색</Link>
              <Link href="/stacks" className="text-gray-700 hover:text-purple-600">스택</Link>
              <Link href="/challenges" className="text-gray-700 hover:text-purple-600">챌린지</Link>
              <Link href="/mypage" className="text-purple-600 font-semibold">마이페이지</Link>
            </nav>
            <div className="md:hidden">
              <button className="p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.displayName.charAt(0)}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-1">{user.displayName}</h1>
              <p className="text-gray-600 mb-4">{user.email}</p>
              
              <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                {user.badges.map((badge, i) => (
                  <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    {badge}
                  </span>
                ))}
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">레벨 {user.level}</span>
                  <span className="text-gray-600">{user.xp} XP / 다음 레벨까지 {xpToNextLevel} XP 필요</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${levelProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <button className="flex items-center text-gray-600 hover:text-purple-600">
              <Settings className="w-5 h-5 mr-1" />
              설정
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button className="py-4 px-6 border-b-2 border-purple-500 text-purple-600 font-medium">
                내 스택
              </button>
              <button className="py-4 px-6 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                저장한 스택
              </button>
              <button className="py-4 px-6 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                챌린지 현황
              </button>
              <button className="py-4 px-6 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                레벨 히스토리
              </button>
            </nav>
          </div>
        </div>
        
        {/* My Stacks */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">내가 만든 스택</h2>
            <Link 
              href="/stacks/create" 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium"
            >
              새 스택 만들기
            </Link>
          </div>
          
          {user.createdStacks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.createdStacks.map((stack) => (
                <div key={stack.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg">{stack.title}</h3>
                    <div className="flex space-x-1">
                      <button className="p-1 hover:bg-gray-100 rounded text-blue-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {stack.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-700">{stack.toolCount}개 툴 조합</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-gray-600">{stack.saveCount}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${stack.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} px-2 py-1 rounded-full`}>
                      {stack.isPublic ? '공개' : '비공개'}
                    </span>
                    <Link 
                      href={`/stacks/${stack.id}`} 
                      className="text-purple-600 font-medium text-sm hover:text-purple-700"
                    >
                      보기 →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">아직 만든 스택이 없어요</h3>
              <p className="text-gray-600 mb-4">
                자주 사용하는 AI 툴 조합을 스택으로 만들어보세요.
              </p>
              <Link 
                href="/stacks/create" 
                className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium"
              >
                첫 스택 만들기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}