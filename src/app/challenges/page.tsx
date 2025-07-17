import { Gamepad2, Trophy, Clock, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 3600; // 1시간마다 재검증

// 데이터 가져오기 함수
async function getChallenges() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/challenges/active?limit=6`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    return data.challenges || [];
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }
}

export default async function ChallengesPage() {
  // 챌린지 데이터 가져오기
  const fetchedChallenges = await getChallenges();
  
  // 임시 데이터 처리 (실제 API 연동 시 제거)
  const challenges = fetchedChallenges.length > 0 ? fetchedChallenges : Array.from({ length: 6 }, (_, i) => ({
    id: `challenge-${i + 1}`,
    stackId: `stack-${i + 1}`,
    title: [
      'AI로 블로그 썸네일 만들기',
      '자동 이메일 응답 시스템 구축',
      '프레젠테이션 슬라이드 자동화',
      '소셜미디어 콘텐츠 일괄 생성',
      '코드 리팩토링 자동화',
      '개인 지식 베이스 구축'
    ][i],
    description: `이 챌린지는 ${['디자인', '자동화', '프레젠테이션', '콘텐츠 제작', '개발', '지식 관리'][i]} 작업을 AI 툴로 효율적으로 수행하는 방법을 배울 수 있습니다.`,
    instructions: [
      '1단계: 필요한 툴 설치하기',
      '2단계: 프롬프트 작성하기',
      '3단계: 결과물 생성하기',
      '4단계: 결과 공유하기'
    ],
    rewardBadge: ['디자인 마스터', '자동화 전문가', '프레젠테이션 고수', '콘텐츠 크리에이터', '코드 닌자', '지식 관리자'][i],
    difficulty: ['beginner', 'intermediate', 'advanced', 'beginner', 'intermediate', 'beginner'][i] as 'beginner' | 'intermediate' | 'advanced',
    estimatedTime: [15, 30, 45, 20, 60, 25][i],
    createdAt: new Date(),
    participantCount: Math.floor(Math.random() * 100) + 10,
    completionRate: Math.floor(Math.random() * 60) + 20,
    stackName: [
      '블로그 콘텐츠 제작 세트',
      '이메일 자동화 스택',
      '프레젠테이션 마스터 세트',
      '소셜미디어 콘텐츠 팩토리',
      '개발자 생산성 스택',
      '지식 관리 시스템'
    ][i],
  }));
  
  // 난이도별 색상 매핑
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };
  
  // 난이도별 텍스트 매핑
  const difficultyText = {
    beginner: '초급',
    intermediate: '중급',
    advanced: '고급',
  };
  
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
              <Link href="/challenges" className="text-purple-600 font-semibold">챌린지</Link>
              <Link href="/mypage" className="text-gray-700 hover:text-purple-600">마이페이지</Link>
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
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Gamepad2 className="w-8 h-8 text-purple-500 mr-2" />
            🎮 챌린지
          </h1>
          <p className="text-gray-600">AI 툴을 실제로 사용해보고 레벨을 올려보세요</p>
        </div>

        {/* Featured Challenge */}
        {challenges.length > 0 && (
          <section className="mb-12">
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm mb-4">
                  이번 주 챌린지
                </span>
                <h2 className="text-3xl font-bold mb-4">{challenges[0].title}</h2>
                <p className="text-white/90 mb-6 max-w-2xl">
                  {challenges[0].description}
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                    <Trophy className="w-4 h-4 mr-1" />
                    <span className="text-sm">{challenges[0].rewardBadge} 뱃지 획득</span>
                  </div>
                  <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">약 {challenges[0].estimatedTime}분 소요</span>
                  </div>
                </div>
                <Link 
                  href={`/challenges/${challenges[0].id}`} 
                  className="inline-flex items-center bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                >
                  챌린지 참여하기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* All Challenges */}
        <section>
          <h2 className="text-2xl font-bold mb-6">모든 챌린지</h2>
          {challenges.length > 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.slice(1).map((challenge) => (
                <div key={challenge.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`${difficultyColors[challenge.difficulty]} px-3 py-1 rounded-full text-xs`}>
                      {difficultyText[challenge.difficulty]}
                    </span>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-1">{challenge.participantCount}명 참여</span>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Star className="w-4 h-4 text-gray-400 hover:text-purple-600" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{challenge.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {challenge.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-gray-700">{challenge.rewardBadge}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-500">{challenge.estimatedTime}분</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-1 flex justify-between">
                      <span>완료율</span>
                      <span>{challenge.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${challenge.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">연결된 스택: {challenge.stackName}</span>
                    <Link 
                      href={`/challenges/${challenge.id}`} 
                      className="text-purple-600 font-medium text-sm hover:text-purple-700"
                    >
                      도전하기 →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-lg mb-2 text-gray-500">현재 진행 중인 챌린지가 없습니다.</p>
              <p className="text-gray-500">곧 새로운 챌린지가 추가될 예정이에요!</p>
            </div>
          )}
        </section>

        {/* My Challenges Section */}
        <section className="mt-12 bg-gray-100 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">내 챌린지 현황</h2>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-gray-600 mb-4">로그인하면 진행 중인 챌린지와 완료한 챌린지를 볼 수 있어요</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              로그인하기
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}