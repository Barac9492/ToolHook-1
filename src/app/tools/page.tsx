import { Search, Filter, Star, BookmarkPlus } from 'lucide-react';
import Link from 'next/link';
import { getCategoryColor } from '@/lib/utils';

export const revalidate = 3600; // 1시간마다 재검증

// 검색 파라미터 타입 정의
interface SearchParams {
  category?: string;
  price?: 'free' | 'paid' | 'all';
  llm?: string;
  sort?: 'recent' | 'popular';
  q?: string;
}

// 데이터 가져오기 함수
async function getTools(params: SearchParams) {
  try {
    const { category, price, llm, sort, q } = params;
    
    // 쿼리 파라미터 구성
    const queryParams = new URLSearchParams();
    if (category && category !== 'all') queryParams.append('category', category);
    if (price && price !== 'all') queryParams.append('price', price);
    if (llm && llm !== 'all') queryParams.append('llm', llm);
    if (sort) queryParams.append('sort', sort);
    if (q) queryParams.append('q', q);
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/tools/category?${queryParams.toString()}`,
      { next: { revalidate: 3600 } }
    );
    
    if (!res.ok) {
      return [];
    }
    
    const data = await res.json();
    return data.tools || [];
  } catch (error) {
    console.error('Error fetching tools:', error);
    return [];
  }
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // 검색 파라미터 처리
  const category = searchParams.category || 'all';
  const price = searchParams.price || 'all';
  const llm = searchParams.llm || 'all';
  const sort = searchParams.sort || 'recent';
  const query = searchParams.q || '';
  
  // 카테고리 목록
  const categories = [
    '텍스트 생성',
    '이미지 생성',
    '비디오 편집',
    '코딩 도구',
    '음성 생성',
    '데이터 분석',
    '자동화',
  ];
  
  // LLM 종류
  const llmTypes = [
    'GPT-4',
    'Claude',
    'Gemini',
    'Llama',
    'Mistral',
    '기타',
  ];
  
  // 툴 데이터 가져오기
  const tools = await getTools(searchParams);
  
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
              <Link href="/tools" className="text-purple-600 font-semibold">툴 탐색</Link>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔍 전체 툴 탐색</h1>
          <p className="text-gray-600">AI 툴을 찾고, 비교하고, 스택에 추가해보세요</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <form action="/tools" method="GET">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="q"
                  placeholder="툴 이름이나 기능으로 검색..."
                  defaultValue={query}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  name="price" 
                  defaultValue={price}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">전체</option>
                  <option value="free">무료만</option>
                  <option value="paid">유료만</option>
                </select>
                <select 
                  name="llm" 
                  defaultValue={llm}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">모든 LLM</option>
                  {llmTypes.map((llmType) => (
                    <option key={llmType} value={llmType}>{llmType}</option>
                  ))}
                </select>
                <select 
                  name="sort" 
                  defaultValue={sort}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="recent">최신순</option>
                  <option value="popular">인기순</option>
                </select>
                <button type="submit" className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <Filter className="w-4 h-4 mr-2" />
                  필터 적용
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Active Filters */}
        {(category !== 'all' || price !== 'all' || llm !== 'all' || query) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {category !== 'all' && (
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
                카테고리: {category}
                <Link href={`/tools?price=${price}&llm=${llm}&sort=${sort}&q=${query}`} className="ml-2 text-purple-600 hover:text-purple-800">
                  ✕
                </Link>
              </div>
            )}
            {price !== 'all' && (
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                {price === 'free' ? '무료만' : '유료만'}
                <Link href={`/tools?category=${category}&llm=${llm}&sort=${sort}&q=${query}`} className="ml-2 text-green-600 hover:text-green-800">
                  ✕
                </Link>
              </div>
            )}
            {llm !== 'all' && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                LLM: {llm}
                <Link href={`/tools?category=${category}&price=${price}&sort=${sort}&q=${query}`} className="ml-2 text-blue-600 hover:text-blue-800">
                  ✕
                </Link>
              </div>
            )}
            {query && (
              <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center">
                검색: {query}
                <Link href={`/tools?category=${category}&price=${price}&llm=${llm}&sort=${sort}`} className="ml-2 text-gray-600 hover:text-gray-800">
                  ✕
                </Link>
              </div>
            )}
            <Link href="/tools" className="text-purple-600 hover:text-purple-800 text-sm ml-2 self-center">
              모든 필터 초기화
            </Link>
          </div>
        )}

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.length > 0 ? (
            tools.map((tool) => (
              <div key={tool.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${getCategoryColor(tool.category)} rounded-lg flex items-center justify-center text-white text-xl font-bold`}>
                    {tool.name.charAt(0)}
                  </div>
                  <div className="flex items-center space-x-1">
                    {tool.isFree && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">무료</span>
                    )}
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <BookmarkPlus className="w-4 h-4 text-gray-400 hover:text-purple-600" />
                    </button>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-2">{tool.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {tool.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded mr-2">{tool.category}</span>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{tool.llmType}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">{tool.stackCount || 0}개 스택에 포함</span>
                  <Link href={`/tools/${tool.id}`} className="text-purple-600 font-medium text-sm hover:text-purple-700">
                    자세히 보기 →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-500">
              <p className="text-lg mb-2">검색 결과가 없습니다.</p>
              <p>다른 검색어나 필터를 사용해보세요.</p>
            </div>
          )}
        </div>

        {/* Load More */}
        {tools.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-white border border-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 font-medium">
              더 많은 툴 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}