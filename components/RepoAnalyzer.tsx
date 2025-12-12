/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { fetchRepoFileTree } from '../services/githubService';
import { generateInfographic } from '../services/geminiService';
import { RepoFileTree, ViewMode, RepoHistoryItem, InitialConfig } from '../types';
import { AlertCircle, Loader2, Layers, Box, Download, Sparkles, Command, Palette, Globe, Clock, Maximize, RefreshCw, Sliders } from 'lucide-react';
import { LoadingState } from './LoadingState';
import ImageViewer from './ImageViewer';

interface RepoAnalyzerProps {
  onNavigate: (mode: ViewMode, data?: any) => void;
  history: RepoHistoryItem[];
  onAddToHistory: (item: RepoHistoryItem) => void;
  initialConfig?: InitialConfig | null;
}

const FLOW_STYLES = [
    "Modern Data Flow",
    "Hand-Drawn Blueprint",
    "Corporate Minimal",
    "Neon Cyberpunk",
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

const RepoAnalyzer: React.FC<RepoAnalyzerProps> = ({ onNavigate, history, onAddToHistory, initialConfig }) => {
  const [repoInput, setRepoInput] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(FLOW_STYLES[0]);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0].value);
  const [customStyle, setCustomStyle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [customName, setCustomName] = useState('');
  const [infographicData, setInfographicData] = useState<string | null>(null);
  const [infographic3DData, setInfographic3DData] = useState<string | null>(null);
  const [generating3D, setGenerating3D] = useState(false);
  const [currentFileTree, setCurrentFileTree] = useState<RepoFileTree[] | null>(null);
  const [currentRepoName, setCurrentRepoName] = useState<string>('');
  const [fullScreenImage, setFullScreenImage] = useState<{src: string, alt: string} | null>(null);

  useEffect(() => {
    if (initialConfig && !infographicData && !loading) {
        setRepoInput(initialConfig.url);
        if (initialConfig.customName) setCustomName(initialConfig.customName);
        if (initialConfig.style) {
             if (FLOW_STYLES.includes(initialConfig.style)) {
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
            const form = document.getElementById('repo-form') as HTMLFormElement;
            if (form) form.requestSubmit();
        }, 100);
    }
  }, [initialConfig]);

  const parseRepoInput = (input: string): { owner: string, repo: string } | null => {
    const cleanInput = input.trim().replace(/\/$/, '');
    try {
      const url = new URL(cleanInput);
      if (url.hostname === 'github.com') {
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length >= 2) return { owner: parts[0], repo: parts[1] };
      }
    } catch (e) { }
    const parts = cleanInput.split('/');
    if (parts.length === 2 && parts[0] && parts[1]) return { owner: parts[0], repo: parts[1] };
    return null;
  };

  const addToHistory = (repoName: string, imageData: string, is3D: boolean, style: string) => {
     const newItem: RepoHistoryItem = {
         id: Date.now().toString(),
         repoName,
         imageData,
         is3D,
         style,
         date: new Date()
     };
     onAddToHistory(newItem);
  };

  const handleApiError = (err: any) => {
      setError(err.message || 'An unexpected error occurred during analysis.');
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfographicData(null);
    setInfographic3DData(null);
    setCurrentFileTree(null);

    const repoDetails = parseRepoInput(repoInput);
    if (!repoDetails) {
      setError('Invalid format. Use "owner/repo" or a full GitHub URL.');
      return;
    }

    setLoading(true);
    setCurrentRepoName(repoDetails.repo);
    try {
      setLoadingStage('CONNECTING TO GITHUB');
      const fileTree = await fetchRepoFileTree(repoDetails.owner, repoDetails.repo);

      if (fileTree.length === 0) throw new Error('No relevant code files found in this repository.');
      setCurrentFileTree(fileTree);

      setLoadingStage('ANALYZING STRUCTURE & GENERATING');
      
      const styleToUse = selectedStyle === 'Custom' ? customStyle : selectedStyle;
      const titleToUse = customName || repoDetails.repo;

      const infographicBase64 = await generateInfographic(
          repoDetails.repo, 
          fileTree, 
          styleToUse, 
          false, 
          selectedLanguage,
          titleToUse,
          refinementPrompt
      );
      
      if (infographicBase64) {
        setInfographicData(infographicBase64);
        addToHistory(titleToUse, infographicBase64, false, styleToUse);
      } else {
          throw new Error("Failed to generate visual.");
      }

    } catch (err: any) {
      handleApiError(err);
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  };

  const handleRegenerate = async () => {
     if (!currentFileTree || !currentRepoName) return;
     setLoading(true);
     setLoadingStage('REFINING & REGENERATING');
     try {
        const styleToUse = selectedStyle === 'Custom' ? customStyle : selectedStyle;
        const titleToUse = customName || currentRepoName;
        const infographicBase64 = await generateInfographic(currentRepoName, currentFileTree, styleToUse, false, selectedLanguage, titleToUse, refinementPrompt);
        if (infographicBase64) {
            setInfographicData(infographicBase64);
            addToHistory(titleToUse, infographicBase64, false, styleToUse);
        }
     } catch (err: any) {
         handleApiError(err);
     } finally {
         setLoading(false);
         setLoadingStage('');
     }
  };

  const handleGenerate3D = async () => {
    if (!currentFileTree || !currentRepoName) return;
    setGenerating3D(true);
    try {
      const styleToUse = selectedStyle === 'Custom' ? customStyle : selectedStyle;
      const titleToUse = customName || currentRepoName;
      const data = await generateInfographic(currentRepoName, currentFileTree, styleToUse, true, selectedLanguage, titleToUse, refinementPrompt);
      if (data) {
          setInfographic3DData(data);
          addToHistory(titleToUse, data, true, styleToUse);
      }
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setGenerating3D(false);
    }
  };

  const loadFromHistory = (item: RepoHistoryItem) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentRepoName(item.repoName);
      if (item.is3D) {
          setInfographic3DData(item.imageData);
      } else {
          setInfographicData(item.imageData);
          setInfographic3DData(null); 
      }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 mb-20">
      
      {fullScreenImage && (
          <ImageViewer 
            src={fullScreenImage.src} 
            alt={fullScreenImage.alt} 
            onClose={() => setFullScreenImage(null)} 
          />
      )}

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white font-sans">
          Codebase <span className="text-zinc-500">Intelligence</span>.
        </h2>
      </div>

      {/* Input Section */}
      <div className="max-w-xl mx-auto relative z-10">
        <form id="repo-form" onSubmit={handleAnalyze} className="glass-panel rounded-xl p-2 transition-all focus-within:border-white/20">
          <div className="flex items-center">
             <div className="pl-3 text-zinc-500">
                <Command className="w-5 h-5" />
             </div>
             <input
                type="text"
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                placeholder="owner/repository"
                className="w-full bg-transparent border-none text-white placeholder:text-zinc-700 focus:ring-0 text-sm px-4 py-2 font-mono"
              />
              <div className="pr-2">
                <button
                type="submit"
                disabled={loading || !repoInput.trim()}
                className="px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-mono text-xs uppercase tracking-wider"
                >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "RUN_ANALYSIS"}
                </button>
             </div>
          </div>
        </form>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto p-4 border border-red-500/20 bg-red-500/5 rounded-xl flex items-center gap-3 text-red-400 animate-in fade-in slide-in-from-top-2 font-mono text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="flex-1">{error}</p>
        </div>
      )}

      {loading && (
        <LoadingState message={loadingStage} type="repo" />
      )}

      {/* Results Section */}
      {infographicData && !loading && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 2D Infographic Card */}
              <div className="glass-panel rounded-2xl p-0 overflow-hidden">
                 <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-zinc-900/50">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                      <Layers className="w-3 h-3 text-zinc-400" /> Flow_Diagram
                    </h3>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setFullScreenImage({src: `data:image/png;base64,${infographicData}`, alt: `${currentRepoName} 2D`})}
                        className="text-xs flex items-center gap-2 text-zinc-500 hover:text-white transition-colors p-1"
                        title="Full Screen"
                      >
                        <Maximize className="w-4 h-4" />
                      </button>
                      <a href={`data:image/png;base64,${infographicData}`} download={`${currentRepoName}-infographic-2d.png`} className="text-[10px] flex items-center gap-1.5 text-black hover:text-zinc-800 bg-white hover:bg-zinc-200 px-2 py-1 rounded font-bold uppercase tracking-wider transition-colors">
                        <Download className="w-3 h-3" /> PNG
                      </a>
                    </div>
                </div>
                <div className="bg-[#eef8fe] relative group min-h-[300px] flex items-center justify-center">
                    <img src={`data:image/png;base64,${infographicData}`} alt="Repository Flow Diagram" className="w-full h-auto object-cover transition-opacity relative z-10" />
                </div>
              </div>

              {/* 3D Infographic Card */}
              <div className="glass-panel rounded-2xl p-0 overflow-hidden flex flex-col">
                 <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-zinc-900/50">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                      <Box className="w-3 h-3 text-zinc-400" /> Holographic_Model
                    </h3>
                    {infographic3DData && (
                      <div className="flex items-center gap-2 animate-in fade-in">
                        <button 
                            onClick={() => setFullScreenImage({src: `data:image/png;base64,${infographic3DData}`, alt: `${currentRepoName} 3D`})}
                            className="text-xs flex items-center gap-2 text-zinc-500 hover:text-white transition-colors p-1"
                        >
                            <Maximize className="w-4 h-4" />
                        </button>
                        <a href={`data:image/png;base64,${infographic3DData}`} download={`${currentRepoName}-infographic-3d.png`} className="text-[10px] flex items-center gap-1.5 text-black hover:text-zinc-800 bg-white hover:bg-zinc-200 px-2 py-1 rounded font-bold uppercase tracking-wider transition-colors">
                          <Download className="w-3 h-3" /> PNG
                        </a>
                      </div>
                    )}
                </div>
                
                <div className="flex-1 bg-black relative flex items-center justify-center min-h-[300px] group">
                  {infographic3DData ? (
                      <img src={`data:image/png;base64,${infographic3DData}`} alt="Repository 3D Flow Diagram" className="w-full h-full object-cover animate-in fade-in transition-opacity" />
                  ) : generating3D ? (
                    <div className="flex flex-col items-center justify-center gap-4 p-6 text-center animate-in fade-in">
                         <Loader2 className="w-6 h-6 animate-spin text-zinc-600" />
                         <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Rendering...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
                        <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Tabletop View</p>
                        <button 
                          onClick={handleGenerate3D}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg font-medium transition-all flex items-center gap-2 font-mono text-xs uppercase tracking-wider"
                        >
                          <Sparkles className="w-3 h-3" /> Generate
                        </button>
                    </div>
                  )}
                </div>
              </div>
          </div>

          {/* Refinement Station */}
          <div className="bg-[#09090b] rounded-xl p-3 flex flex-col md:flex-row items-center gap-3 border border-white/5">
             <div className="flex items-center gap-2 text-zinc-500 shrink-0">
                 <Sliders className="w-4 h-4" />
                 <span className="text-[10px] font-mono uppercase tracking-wider">Refine</span>
             </div>
             <input 
                type="text" 
                value={refinementPrompt}
                onChange={(e) => setRefinementPrompt(e.target.value)}
                placeholder="e.g. 'Focus on the authentication flow' or 'Make it darker'"
                className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-700 focus:ring-1 focus:ring-white/20 font-mono transition-all"
             />
             <button 
                onClick={handleRegenerate}
                className="px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-lg font-bold transition-all flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider shrink-0"
             >
                 <RefreshCw className="w-3 h-3" /> Regenerate
             </button>
          </div>

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
                              <img src={`data:image/png;base64,${item.imageData}`} alt={item.repoName} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                              {item.is3D && (
                                  <div className="absolute top-2 right-2 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/10">3D</div>
                              )}
                          </div>
                          <div className="p-3">
                              <p className="text-xs font-bold text-white truncate font-mono">{item.repoName}</p>
                              <p className="text-[10px] text-zinc-500 mt-1">{item.style}</p>
                          </div>
                      </button>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default RepoAnalyzer;
