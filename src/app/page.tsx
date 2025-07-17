import { Sparkles, TrendingUp, Brain, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { getRelativeTime } from '@/lib/utils';

export const revalidate = 3600; // 1시간마다 재검증

// 데이터 가져오기 함수들
async function getRecentTools() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/tools/recent?days=3&limit=3`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    return data.tools || [];
  } catch (error) {
    console.error('Error fetching recent tools:', error);
    return [];
  }
}

async function getPopularStacks() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stacks/popular?limit=3`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    return data.stacks || [];
  } catch (error) {
    console.error('Error fetching popular stacks:', error);
    return [];
  }
}

async function getFeaturedStacks() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stacks/featured?limit=3`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    return data.stacks || [];
  } catch (error) {
    console.error('Error fetching featured stacks:', error);
    return [];
  }
}

async function getActiveChallenges() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/challenges/active?limit=1`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    return data.challenges || [];
  } catch (error) {
    console.error('Error fetching active challenges:', error);
    return [];
  }
}

export default async function Home() {
  // 데이터 가져오기
  const [recentTools, popularStacks, featuredStacks, activeChallenges] = await Promise.all([
    getRecentTools(),
    getPopularStacks(),
    getFeaturedStacks(),
    getActiveChallenges()
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg"></div>
              <span className="text-xl font-bold">툴훅툴훅</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-purple-600 font-semibold">홈</Link>
              <Link href="/tools" className="text-gray-700 hover:text-purple-600">툴 탐색</Link>
              <Link href="/stacks" className="text-gray-700 hover:text-purple-600">스택</Link>
              <Link href="/challenges" className="text-gray-700 hover:text-purple-600">챌린지</Link>
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

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI 툴을 <span className="text-purple-600">발견</span>하고,
            <br />
            <span className="text-blue-600">조합</span>하고, <span className="text-green-600">실행</span>하세요
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            단순한 툴 목록이 아닌, 실제로 사용해보고 성장하는 행동 중심 플랫폼
          </p>
          <Link href="/tools" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all inline-block">
            지금 시작하기
          </Link>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* 오늘 새 툴 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold">🆕 오늘 새 툴</h2>
            </div>
            <div className="space-y-4">
              {recentTools.length > 0 ? (
                recentTools.map((tool) => (
                  <div key={tool.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <h3 className="font-semibold">{tool.name}</h3>
                      <p className="text-sm text-gray-600">{tool.description?.substring(0, 60)}...</p>
                      <p className="text-xs text-gray-500 mt-1">{getRelativeTime(new Date(tool.createdAt))}</p>
                    </div>
                    {tool.isFree && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">무료</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  최근 추가된 툴이 없습니다.
                </div>
              )}
              <div className="text-center pt-2">
                <Link href="/tools" className="text-purple-600 text-sm font-medium hover:text-purple-800">
                  모든 툴 보기 →
                </Link>
              </div>
            </div>
          </section>

          {/* 이번 주 인기 스택 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-6 h-6 text-red-500 mr-2" />
              <h2 className="text-2xl font-bold">💡 이번 주 인기 스택</h2>
            </div>
            <div className="space-y-4">
              {popularStacks.length > 0 ? (
                popularStacks.map((stack) => (
                  <div key={stack.id} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg hover:from-purple-100 hover:to-blue-100 transition-colors">
                    <h3 className="font-semibold mb-2">{stack.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{stack.toolIds?.length || 0}개 툴 조합 • {stack.saveCount || 0}명이 저장</p>
                    <Link href={`/stacks/${stack.id}`} className="text-purple-600 text-sm font-medium hover:text-purple-800">
                      따라하기 →
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  인기 스택이 없습니다.
                </div>
              )}
              <div className="text-center pt-2">
                <Link href="/stacks" className="text-purple-600 text-sm font-medium hover:text-purple-800">
                  모든 스택 보기 →
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* 에디터 추천 */}
        <section className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <div className="flex items-center mb-6">
            <Brain className="w-6 h-6 text-purple-500 mr-2" />
            <h2 className="text-2xl font-bold">🧠 에디터 추천</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredStacks.length > 0 ? (
              featuredStacks.map((stack) => (
                <div key={stack.id} className="p-6 border-2 border-dashed border-gray-200 rounded-lg text-center hover:border-purple-300 transition-colors">
                  <h3 className="font-semibold mb-2">{stack.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{stack.description}</p>
                  <Link href={`/stacks/${stack.id}`} className="text-purple-600 font-medium hover:text-purple-800">
                    자세히 보기
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-4 text-gray-500">
                추천 스택이 없습니다.
              </div>
            )}
          </div>
        </section>

        {/* 챌린지 배너 */}
        {activeChallenges.length > 0 && (
          <section className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white text-center">
            <div className="flex items-center justify-center mb-4">
              <Gamepad2 className="w-8 h-8 mr-3" />
              <h2 className="text-3xl font-bold">🎮 이번 주 챌린지</h2>
            </div>
            <p className="text-xl mb-6">{activeChallenges[0].title}</p>
            <Link href={`/challenges/${activeChallenges[0].id}`} className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all inline-block">
              챌린지 참여하기
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}