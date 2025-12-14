import { GoogleGenAI } from "@google/genai";
import { GeneratedContent, ImageData } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to clean up Markdown code blocks if the model returns them despite instructions
const cleanHtmlResponse = (text: string): string => {
  return text.replace(/```html/g, '').replace(/```/g, '').trim();
};

export const generateTeachingPlan = async (topic: string): Promise<GeneratedContent> => {
  if (!apiKey) throw new Error("API Key is missing");

  // Shandong Science and Technology Press (Shandong Keji / Lu Ke Ban) context
  const contextPrompt = `
    你是一名福建省的高中物理教师，拥有丰富的教学经验。你正在使用"山东科学技术出版社"（鲁科版）的高中物理教材进行备课。
    
    请针对知识模块：“${topic}”，利用网络搜索功能，撰写一篇详细的教学重难点分析与解决方案的文章。
    
    文章要求：
    1. **结构清晰**：包含“教材分析”、“教学重点”、“教学难点”、“难点成因分析”、“突破难点的教学策略/方法”五个部分。
    2. **针对性强**：内容必须紧扣“鲁科版”教材的特点（例如该教材重视实验探究、重视物理模型构建等特点）。
    3. **格式要求**：请直接输出语义化的 HTML 字符串（例如使用 <h2>, <p>, <ul>, <li>, <strong> 等标签），不要包含 <html>, <head>, <body> 标签。不要使用 Markdown 格式。
    4. **引用资源**：如果搜索到了具体的网络资源（如教案、论文、优质课），请在文章中提及。
    
    请确保输出的内容适合直接复制粘贴到 Word 文档中。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contextPrompt,
      config: {
        tools: [{ googleSearch: {} }],
        // We instruct the model to think about the search results before writing
        thinkingConfig: { thinkingBudget: 1024 } 
      }
    });

    const text = response.text || "无法生成内容，请重试。";
    
    // Extract sources if available
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((web: any) => web) || [];

    return {
      htmlContent: cleanHtmlResponse(text),
      sources: sources,
      topic: topic
    };

  } catch (error) {
    console.error("Error generating text content:", error);
    throw error;
  }
};

export const generateDiagram = async (topic: string): Promise<ImageData | null> => {
  if (!apiKey) return null;

  try {
    // Generate an illustrative diagram for the physics concept
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `Draw a clear, educational physics diagram explaining the concept of "${topic}". High contrast, white background, textbook style.` }
        ]
      }
    });

    // Check for image parts
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return {
          base64: part.inlineData.data,
          mimeType: part.inlineData.mimeType
        };
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    // Image generation is secondary, so we return null rather than crashing the whole flow
    return null;
  }
};
