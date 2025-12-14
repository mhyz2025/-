import React, { useState } from 'react';

interface HeroSectionProps {
  onSearch: (term: string) => void;
  isSearching: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, isSearching }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center max-w-4xl mx-auto">
      <div className="mb-8 space-y-4">
        <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold tracking-wide mb-2">
          福建省高中物理 • 鲁科版
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          物理教学难点<br className="md:hidden" />智能备课助手
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          输入鲁科版教材的知识模块，快速获取网络教研资源、难点深度解析及针对性教学策略。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-white rounded-lg shadow-xl">
          <input
            type="text"
            className="w-full px-6 py-4 text-lg text-slate-700 placeholder-slate-400 bg-transparent border-none rounded-l-lg focus:ring-0 focus:outline-none"
            placeholder="例如：牛顿第二定律、带电粒子在磁场中的运动..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSearching}
          />
          <button
            type="submit"
            disabled={isSearching || !input.trim()}
            className={`px-8 py-4 text-lg font-medium text-white transition-all duration-200 bg-blue-600 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSearching ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isSearching ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                搜索中
              </span>
            ) : (
              '开始备课'
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 flex gap-4 text-sm text-slate-500">
        <span>热门搜索：</span>
        <button onClick={() => onSearch("平抛运动")} className="hover:text-blue-600 underline decoration-dotted">平抛运动</button>
        <button onClick={() => onSearch("楞次定律")} className="hover:text-blue-600 underline decoration-dotted">楞次定律</button>
        <button onClick={() => onSearch("动量守恒")} className="hover:text-blue-600 underline decoration-dotted">动量守恒</button>
      </div>
    </div>
  );
};

export default HeroSection;
