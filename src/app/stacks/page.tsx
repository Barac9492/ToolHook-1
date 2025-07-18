import { Brain, Plus, Filter, Star } from 'lucide-react';
import Link from 'next/link';
import { mockStacks } from '@/lib/mockData';
import { Stack } from '@/types';

export const revalidate = 3600; // 1시간마다 재검증

// 검색 파라미터 타입 정의
interface SearchParams {
  category?: string;
  sort?: 'recent' | 'popular';
  free?: 'yes' | 'no' | 'all';
  q?: string;
}

const useMock = process.env.USE_MOCK_DATA === 'true';

// 데이터 가져오기 함수들
async function getFeaturedStacks(): Promise<Stack[]> {
  if (useMock) return mockStacks.filter((s: Stack) => s.isFeatured);
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

async function getPopularStacks(params: SearchParams): Promise<Stack[]> {
  if (useMock) return mockStacks;
  try {
    const { category, free, sort, q } = params;
    
    // 쿼리 파라미터 구성
    const queryParams = new URLSearchParams();
    if (category && category !== 'all') queryParams.append('category', category);
    if (free && free !== 'all') queryParams.append('free', free);
    if (sort) queryParams.append('sort', sort);
    if (q) queryParams.append('q', q);
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stacks/popular?${queryParams.toString()}&limit=6`,
      { next: { revalidate: 3600 } }
    );
    
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

export default async function StacksPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // 검색 파라미터 처리
  const category = searchParams.category || 'all';
  const sort = searchParams.sort || 'popular';
  const free = searchParams.free || 'all';
  const query = searchParams.q || '';
  
  // 카테고리 목록
  const categories = [
    '콘텐츠 제작',
    '이메일 자동화',
    '디자인',
    '개발',
    '마케팅',
    '생산성',
    '학습',
  ];
  
  // 스택 데이터 가져오기
  const [featuredStacks, popularStacks] = await Promise.all([
    getFeaturedStacks(),
    getPopularStacks(searchParams)
  ]);
  
  // 임시 데이터 처리 (실제 API 연동 시 제거)
  const processedFeaturedStacks = featuredStacks.map((stack: Stack, i: number) => ({
    ...stack,
    freePercentage: [100, 66, 33][i % 3],
    toolCount: stack.toolIds?.length || 3,
    category: stack.category || categories[i % categories.length],
  }));
  
  const processedPopularStacks = popularStacks.map((stack: Stack, i: number) => ({
    ...stack,
    freePercentage: [100, 75, 50, 25, 0][i % 5],
    toolCount: stack.toolIds?.length || (3 + (i % 2)),
    category: stack.category || categories[i % categories.length],
  }));
  
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
              <Link href="/stacks" className="text-purple-600 font-semibold">스택</Link>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🧩 스택</h1>
            <p className="text-gray-600">목적에 맞는 AI 툴 조합을 찾고 만들어보세요</p>
          </div>
          <Link 
            href="/stacks/create" 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            나만의 스택 만들기
          </Link>
        </div>

        {/* Featured Stacks */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Brain className="w-6 h-6 text-purple-500 mr-2" />
            💎 Featured 스택
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {processedFeaturedStacks.length > 0 ? (
              processedFeaturedStacks.map((stack: Stack) => (
                <div key={stack.id} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-purple-100">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs">
                      {stack.category}
                    </span>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-1">{stack.saveCount || 0}명 저장</span>
                      <button className="p-1 hover:bg-purple-100 rounded">
                        <Star className="w-4 h-4 text-gray-400 hover:text-purple-600" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{stack.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {stack.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700">{stack.toolCount}개 툴 조합</span>
                      {stack.freePercentage === 100 && (
                        <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">전체 무료</span>
                      )}
                      {stack.freePercentage > 0 && stack.freePercentage < 100 && (
                        <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">{stack.freePercentage}% 무료</span>
                      )}
                    </div>
                  </div>
                  
                  <Link 
                    href={`/stacks/${stack.id}`} 
                    className="block w-full bg-white text-purple-600 border border-purple-200 rounded-lg py-2 text-center font-medium hover:bg-purple-50 transition-colors"
                  >
                    따라하기
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                <p className="text-lg mb-2">추천 스택이 없습니다.</p>
                <p>나만의 스택을 만들어보세요!</p>
              </div>
            )}
          </div>
        </section>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <form action="/stacks" method="GET">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  name="q"
                  placeholder="스택 이름이나 목적으로 검색..."
                  defaultValue={query}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <select 
                  name="category" 
                  defaultValue={category}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">모든 카테고리</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select 
                  name="free" 
                  defaultValue={free}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">전체</option>
                  <option value="yes">무료 툴만</option>
                  <option value="no">유료 포함</option>
                </select>
                <select 
                  name="sort" 
                  defaultValue={sort}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="popular">인기순</option>
                  <option value="recent">최신순</option>
                </select>
                <button type="submit" className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <Filter className="w-4 h-4 mr-2" />
                  필터 적용
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Popular Stacks */}
        <section>
          <h2 className="text-2xl font-bold mb-6">인기 스택</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedPopularStacks.length > 0 ? (
              processedPopularStacks.map((stack: Stack) => (
                <div key={stack.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs">
                      {stack.category}
                    </span>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-1">{stack.saveCount || 0}명 저장</span>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Star className="w-4 h-4 text-gray-400 hover:text-purple-600" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{stack.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {stack.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700">{stack.toolCount}개 툴 조합</span>
                      {stack.freePercentage === 100 && (
                        <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">전체 무료</span>
                      )}
                      {stack.freePercentage > 0 && stack.freePercentage < 100 && (
                        <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">{stack.freePercentage}% 무료</span>
                      )}
                    </div>
                  </div>
                  
                  <Link 
                    href={`/stacks/${stack.id}`} 
                    className="block w-full bg-white text-purple-600 border border-purple-200 rounded-lg py-2 text-center font-medium hover:bg-purple-50 transition-colors"
                  >
                    따라하기
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                <p className="text-lg mb-2">검색 결과가 없습니다.</p>
                <p>다른 검색어나 필터를 사용해보세요.</p>
              </div>
            )}
          </div>
        </section>

        {/* Load More */}
        {processedPopularStacks.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-white border border-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 font-medium">
              더 많은 스택 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}