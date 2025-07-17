import { ArrowLeft, Plus, Trash2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CreateStackPage() {
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
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <Link href="/stacks" className="flex items-center text-gray-600 hover:text-purple-600 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            스택 목록으로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">✍️ 나만의 스택 만들기</h1>
          <p className="text-gray-600">자주 사용하는 AI 툴 조합을 만들고 공유해보세요</p>
        </div>

        {/* Create Stack Form */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <form>
            {/* Stack Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                스택 이름
              </label>
              <input
                type="text"
                id="title"
                placeholder="예: 블로그 콘텐츠 제작 세트"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Stack Purpose */}
            <div className="mb-6">
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                스택 목적
              </label>
              <input
                type="text"
                id="purpose"
                placeholder="예: 블로그 글 작성과 이미지 생성 자동화"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Stack Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                스택 설명
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="이 스택을 어떤 목적으로 사용하는지 설명해주세요..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              ></textarea>
            </div>

            {/* Tool Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                툴 선택 (3-5개)
              </label>
              
              {/* Selected Tools */}
              <div className="space-y-3 mb-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                        T{i}
                      </div>
                      <div>
                        <h4 className="font-medium">샘플 툴 {i}</h4>
                        <p className="text-xs text-gray-500">텍스트 생성 • 무료</p>
                      </div>
                    </div>
                    <button type="button" className="text-red-500 hover:bg-red-50 p-1 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Add Tool Button */}
              <button
                type="button"
                className="w-full flex items-center justify-center py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                툴 추가하기
              </button>
            </div>

            {/* Usage Steps */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                사용 순서 안내
              </label>
              
              <div className="space-y-3 mb-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {i}
                    </span>
                    <input
                      type="text"
                      placeholder={`${i}단계: 어떤 작업을 하나요?`}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
                      defaultValue={i === 1 ? "프롬프트 작성" : i === 2 ? "텍스트 복사" : "Canva로 시각화"}
                    />
                    <button type="button" className="text-red-500 hover:bg-red-50 p-1 rounded ml-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                className="w-full flex items-center justify-center py-2 border border-gray-200 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                단계 추가
              </button>
            </div>

            {/* Options */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="freeOnly"
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="freeOnly" className="ml-2 text-sm text-gray-700">
                  무료 툴만 선택하기
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  defaultChecked
                />
                <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                  공개 스택으로 설정 (다른 사용자에게 보이기)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoGenerate"
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  defaultChecked
                />
                <label htmlFor="autoGenerate" className="ml-2 text-sm text-gray-700 flex items-center">
                  AI로 스택 설명 자동 생성
                  <Sparkles className="w-4 h-4 text-yellow-500 ml-1" />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium"
              >
                스택 만들기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}