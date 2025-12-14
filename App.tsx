import React, { useState } from 'react';
import { AppState, GeneratedContent, ImageData } from './types';
import { generateTeachingPlan, generateDiagram } from './services/geminiService';
import HeroSection from './components/HeroSection';
import ArticleView from './components/ArticleView';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [image, setImage] = useState<ImageData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSearch = async (term: string) => {
    setAppState(AppState.LOADING);
    setErrorMsg('');
    setImage(null);

    try {
      // 1. Generate text content (Critical path)
      const textResult = await generateTeachingPlan(term);
      setContent(textResult);

      // 2. Start image generation in background (Non-critical)
      // We don't await this to show text results faster if we wanted to render immediately, 
      // but for a coherent article load, we'll await both but independently catching errors.
      
      try {
        const imageResult = await generateDiagram(term);
        setImage(imageResult);
      } catch (imgError) {
        console.warn("Image generation failed silently", imgError);
      }

      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error("Workflow failed", err);
      setAppState(AppState.ERROR);
      setErrorMsg(err.message || "生成失败，请检查网络或重试。");
    }
  };

  const handleBack = () => {
    setAppState(AppState.IDLE);
    setContent(null);
    setImage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50 to-transparent pointer-events-none -z-0"></div>
      
      <main className="relative z-10">
        {appState === AppState.IDLE && (
          <HeroSection onSearch={handleSearch} isSearching={false} />
        )}

        {appState === AppState.LOADING && (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="relative w-24 h-24 mb-8">
               <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">正在研读教材与搜索网络...</h2>
            <p className="text-slate-500 animate-pulse">AI正在分析鲁科版物理知识体系</p>
          </div>
        )}

        {appState === AppState.SUCCESS && content && (
          <ArticleView data={content} image={image} onBack={handleBack} />
        )}

        {appState === AppState.ERROR && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="bg-red-50 text-red-600 p-4 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">抱歉，搜索过程中遇到了问题</h3>
            <p className="text-slate-600 mb-8">{errorMsg}</p>
            <button 
              onClick={handleBack}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              返回重试
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
