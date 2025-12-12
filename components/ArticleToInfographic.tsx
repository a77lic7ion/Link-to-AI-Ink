/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { generateArticleInfographic } from '../services/geminiService';
import { Citation, ArticleHistoryItem, InitialConfig } from '../types';
import { Link, Loader2, Download, Sparkles, AlertCircle, Palette, Globe, ExternalLink, BookOpen, Clock, Maximize, Sliders, RefreshCw, Type, Target } from 'lucide-react';
import { LoadingState } from './LoadingState';
import ImageViewer from './ImageViewer';

interface ArticleToInfographicProps {
    history: ArticleHistoryItem[];
    onAddToHistory: (item: ArticleHistoryItem) => void;
    initialConfig?: InitialConfig | null;
}

const SKETCH_STYLES = [
    "Modern Editorial",
    "Fun & Playful",
    "Clean Minimalist",
    "Dark Mode Tech",
    "Custom"
];

const LANGUAGES = [
  { label: "English (US)", value: "English" },
  { label: "Arabic (Egypt)", value: "Arabic" },
  { label: "German (Germany)", value: "German" },
  { label: "Spanish (Mexico)", value: "Spanish" },
  { label: "French (France)", value: "French" },
  { label: "Hindi (India)", value: "Hindi" },
  { label: "Indonesian (Indonesia)", value: "Indonesian" },
  { label: "Italian (Italy)", value: "Italian" },
  { label: "Japanese (Japan)", value: "Japanese" },
  { label: "Korean (South Korea)", value: "Korean" },
  { label: "Portuguese (Brazil)", value: "Portuguese" },
  { label: "Russian (Russia)", value: "Russian" },
  { label: "Ukrainian (Ukraine)", value: "Ukrainian" },
  { label: "Vietnamese (Vietnam)", value: "Vietnamese" },
  { label: "Chinese (China)", value: "Chinese" },
];

const ArticleToInfographic: React.FC<ArticleToInfographicProps> = ({ history, onAddToHistory, initialConfig }) => {
  const [urlInput, setUrlInput] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(SKETCH_STYLES[0]);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0].value);
  const [customStyle, setCustomStyle] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState('');
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [customName, setCustomName] = useState('');
  const [fullScreenImage, setFullScreenImage] = useState<{src: string, alt: string} | null>(null);

  useEffect(() => {
    if (initialConfig && !imageData && !loading) {
        setUrlInput(initialConfig.url);
        if (initialConfig.customName) setCustomName(initialConfig.customName);
        if (initialConfig.style) {
             if (SKETCH_STYLES.includes(initialConfig.style)) {
                 setSelectedStyle(initialConfig.style);
             } else {
                 setSelectedStyle('Custom');
                 setCustomStyle(initialConfig.style);
             }
        }
        if (initialConfig.focus) {
            setRefinementPrompt(initialConfig.focus);
        }
        setTimeout(() => {
             const form = document.getElementById('article-form') as HTMLFormElement;
             if (form) form.requestSubmit();
        }, 100);
    }
  }, [initialConfig]);

  const addToHistory = (url: string, image: string, cites: Citation[]) => {
      let title = customName || url;
      if (!customName) {
        try { title = new URL(url).hostname; } catch(e) {}
      }
      
      const newItem: ArticleHistoryItem = {
          id: Date.now().toString(),
          title: title,
          url,
          imageData: image,
          citations: cites,
          date: new Date()
      };
      onAddToHistory(newItem);
  };

  const loadFromHistory = (item: ArticleHistoryItem) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setUrlInput(item.url);
      setImageData(item.imageData);
      setCitations(item.citations);
      setCustomName(item.title);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
        setError("Please provide a valid URL.");
        return;
    }
    
    setLoading(true);
    setError(null);
    setImageData(null);
    setCitations([]);
    setLoadingStage('INITIALIZING...');

    try {
      const styleToUse = selectedStyle === 'Custom' ? customStyle : selectedStyle;
      const { imageData: resultImage, citations: resultCitations } = await generateArticleInfographic(
          urlInput, 
          styleToUse, 
          (stage) => { setLoadingStage(stage); }, 
          selectedLanguage,
          customName,
          refinementPrompt
      );
      
      if (resultImage) {
          setImageData(resultImage);
          setCitations(resultCitations);
          addToHistory(urlInput, resultImage, resultCitations);
      } else {
          throw new Error("Failed to generate infographic image. The URL might be inaccessible.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 mb-20">
      
      {fullScreenImage && (
          <ImageViewer 
            src={fullScreenImage.src} 
            alt={fullScreenImage.alt} 
            onClose={() => setFullScreenImage(null)} 
          />
      )}

      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h2 className="text-5xl font-black tracking-tight text-white font-sans">
          Site<span className="text-zinc-500">Sketch</span>.
        </h2>
      </div>

      {/* Input Section */}
      <div className="glass-panel rounded-xl p-2 max-w-xl mx-auto relative z-10">
         <form id="article-form" onSubmit={handleGenerate}>
            <div className="flex items-center">
                 <div className="pl-3 text-zinc-500">
                    <Link className="w-5 h-5" />
                 </div>
                 <input 
                    type="url" 
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/article"
                    className="w-full bg-transparent border-none text-white placeholder:text-zinc-700 focus:ring-0 text-sm px-4 py-2 font-mono"
                 />
                 <div className="pr-2">
                    <button 
                        type="submit"
                        disabled={loading || !urlInput.trim()}
                        className="px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-mono text-xs uppercase tracking-wider"
                    >
                        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "GENERATE"}
                    </button>
                 </div>
            </div>
         </form>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto p-4 border border-red-500/20 bg-red-500/5 rounded-xl flex items-center gap-3 text-red-400 animate-in fade-in font-mono text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <LoadingState message={loadingStage || 'READING_CONTENT'} type="article" />
      )}

      {/* Result Section */}
      {imageData && !loading && (
        <div className="glass-panel rounded-2xl p-0 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-zinc-900/50">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-zinc-400" /> Result
                </h3>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setFullScreenImage({src: `data:image/png;base64,${imageData}`, alt: "Article Sketch"})}
                        className="text-xs flex items-center gap-2 text-zinc-500 hover:text-white transition-colors p-1"
                    >
                        <Maximize className="w-4 h-4" />
                    </button>
                    <a href={`data:image/png;base64,${imageData}`} download="site-sketch.png" className="text-[10px] flex items-center gap-1.5 text-black hover:text-zinc-800 bg-white hover:bg-zinc-200 px-2 py-1 rounded font-bold uppercase tracking-wider transition-colors">
                        <Download className="w-3 h-3" /> PNG
                    </a>
                </div>
            </div>
            <div className="bg-[#eef8fe] relative group min-h-[400px] flex items-center justify-center">
                 {selectedStyle === "Dark Mode Tech" && <div className="absolute inset-0 bg-slate-950 pointer-events-none mix-blend-multiply" />}
                <div className="absolute inset-0 bg-slate-950/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <img src={`data:image/png;base64,${imageData}`} alt="Generated Infographic" className="w-full h-auto object-contain max-h-[800px] mx-auto relative z-10" />
            </div>

            {/* Refinement Station */}
            <div className="bg-[#09090b] p-4 flex flex-col md:flex-row items-center gap-3 border-t border-white/5">
                <div className="flex items-center gap-2 text-zinc-500 shrink-0">
                    <Sliders className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase tracking-wider">Refine</span>
                </div>
                <input 
                    type="text" 
                    value={refinementPrompt}
                    onChange={(e) => setRefinementPrompt(e.target.value)}
                    placeholder="e.g. 'Use more vibrant colors' or 'Simplify the text'"
                    className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-700 focus:ring-1 focus:ring-white/20 font-mono transition-all"
                />
                <button 
                    onClick={handleGenerate}
                    className="px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-lg font-bold transition-all flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider shrink-0"
                >
                    <RefreshCw className="w-3 h-3" /> Regenerate
                </button>
            </div>

             {/* Featured Citations Section */}
            {citations.length > 0 && (
                <div className="px-6 py-6 border-t border-white/5 bg-[#0a0a0a]">
                    <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="w-4 h-4 text-zinc-500" />
                        <h4 className="text-xs font-bold text-zinc-300 tracking-wide font-mono uppercase">
                            Sources
                        </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {citations.map((cite, idx) => {
                            let hostname = cite.uri;
                            try { hostname = new URL(cite.uri).hostname; } catch (e) {}
                            
                            return (
                                <a 
                                    key={idx} 
                                    href={cite.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex flex-col p-3 bg-black border border-white/5 hover:border-white/20 rounded-lg transition-all group"
                                    title={cite.title || cite.uri}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Globe className="w-3 h-3 text-zinc-600 group-hover:text-white transition-colors" />
                                        <p className="text-[10px] text-zinc-500 truncate font-mono group-hover:text-zinc-300">
                                            {hostname}
                                        </p>
                                    </div>
                                    <p className="text-xs font-bold text-zinc-300 group-hover:text-white line-clamp-1 transition-colors">
                                        {cite.title || "Web Source"}
                                    </p>
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
      )}
      
      {/* History Section */}
      {history.length > 0 && (
          <div className="pt-12 border-t border-white/5 animate-in fade-in">
              <div className="flex items-center gap-2 mb-6 text-zinc-500">
                  <Clock className="w-4 h-4" />
                  <h3 className="text-xs font-mono uppercase tracking-wider">History</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {history.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        className="group bg-[#09090b] border border-white/5 hover:border-white/20 rounded-xl overflow-hidden text-left transition-all"
                      >
                          <div className="aspect-video relative overflow-hidden bg-black">
                              <img src={`data:image/png;base64,${item.imageData}`} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="p-3">
                              <p className="text-xs font-bold text-white truncate font-mono">{item.title}</p>
                              <p className="text-[10px] text-zinc-500 mt-1 truncate">{new URL(item.url).hostname}</p>
                          </div>
                      </button>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default ArticleToInfographic;
