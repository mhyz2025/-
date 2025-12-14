import React from 'react';
import { GeneratedContent, ImageData } from '../types';

interface ArticleViewProps {
  data: GeneratedContent;
  image: ImageData | null;
  onBack: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ data, image, onBack }) => {

  const handleDownloadWord = () => {
    // Construct a full HTML document for the Word export
    // We embed the image as Base64 so it works offline in the doc
    const imageHtml = image 
      ? `<div style="text-align:center; margin: 20px 0;"><img src="data:${image.mimeType};base64,${image.base64}" alt="${data.topic} 示意图" style="max-width: 100%; height: auto; border: 1px solid #ddd;" /><br/><small>图：${data.topic} 教学示意图 (AI生成)</small></div>` 
      : '';

    const sourceHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${data.topic} - 教学难点分析</title>
        <style>
          body { font-family: 'SimSun', 'Songti SC', serif; line-height: 1.5; }
          h1 { font-size: 24pt; color: #000; text-align: center; }
          h2 { font-size: 18pt; color: #333; margin-top: 15pt; border-bottom: 1px solid #ccc; padding-bottom: 5pt; }
          p { font-size: 12pt; text-align: justify; }
          ul, ol { margin-bottom: 10pt; }
          li { font-size: 12pt; margin-bottom: 5pt; }
        </style>
      </head>
      <body>
        <h1>${data.topic} - 教学重难点及突破策略</h1>
        <p style="text-align: center; color: #666; font-size: 10pt;">来源：福建省高中物理备课助手 (基于鲁科版教材)</p>
        <hr/>
        ${imageHtml}
        <div class="content">
          ${data.htmlContent}
        </div>
        <hr/>
        <h3>参考来源</h3>
        <ul>
          ${data.sources.map(s => `<li><a href="${s.uri}">${s.title}</a></li>`).join('')}
        </ul>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', sourceHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `鲁科版物理-${data.topic}-备课资料.doc`; // .doc extension opens in Word with HTML content warning (standard web behavior)
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-20">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-slate-500 hover:text-blue-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        返回搜索
      </button>

      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-100">
        {/* Header Section */}
        <div className="bg-slate-50 px-8 py-10 border-b border-slate-200 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
              {data.topic}
            </h1>
            <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">
              鲁科版高中物理 · 教学难点深度解析
            </p>
        </div>

        {/* Content Body */}
        <div className="p-8 md:p-12">
          
          {/* AI Generated Image */}
          {image && (
            <div className="mb-10 float-none md:float-right md:ml-8 md:w-1/3 bg-slate-50 p-2 rounded-lg border border-slate-100 shadow-sm">
              <img 
                src={`data:${image.mimeType};base64,${image.base64}`} 
                alt={data.topic} 
                className="w-full h-auto rounded-md bg-white"
              />
              <p className="mt-2 text-center text-xs text-slate-400 font-mono">
                AI生成的概念示意图
              </p>
            </div>
          )}

          {/* Main Article Text */}
          <div 
            className="article-content text-lg"
            dangerouslySetInnerHTML={{ __html: data.htmlContent }}
          />
          
          <div className="clear-both"></div>
        </div>

        {/* Sources Footer */}
        {data.sources.length > 0 && (
          <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-700 uppercase mb-3">参考网络资源</h4>
            <div className="flex flex-wrap gap-2">
              {data.sources.slice(0, 5).map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <span className="truncate max-w-[150px]">{source.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg rounded-full px-6 py-3 flex items-center gap-4 z-50">
        <button 
          onClick={handleDownloadWord}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-colors shadow-md hover:shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          下载 Word 教案
        </button>
        <span className="text-slate-300">|</span>
        <button 
          onClick={() => window.print()}
          className="text-slate-600 hover:text-slate-900 font-medium px-2"
        >
          打印
        </button>
      </div>
    </div>
  );
};

export default ArticleView;
