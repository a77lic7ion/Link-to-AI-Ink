/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import RepoAnalyzer from './components/RepoAnalyzer';
import ArticleToInfographic from './components/ArticleToInfographic';
import Home from './components/Home';
import IntroAnimation from './components/IntroAnimation';
import { ViewMode, RepoHistoryItem, ArticleHistoryItem, InitialConfig } from './types';
import { Github, PenTool, GitBranch, FileText, Home as HomeIcon } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.HOME);
  const [showIntro, setShowIntro] = useState(true);
  
  const [repoHistory, setRepoHistory] = useState<RepoHistoryItem[]>([]);
  const [articleHistory, setArticleHistory] = useState<ArticleHistoryItem[]>([]);
  const [initialConfig, setInitialConfig] = useState<InitialConfig | null>(null);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleNavigate = (mode: ViewMode) => {
    setCurrentView(mode);
    setInitialConfig(null); 
  };

  const handleUrlSubmit = (config: InitialConfig) => {
    setInitialConfig(config);
    if (config.url.includes('github.com') && config.url.split('/').length >= 4) {
      setCurrentView(ViewMode.REPO_ANALYZER);
    } else {
      setCurrentView(ViewMode.ARTICLE_INFOGRAPHIC);
    }
  };

  const handleAddRepoHistory = (item: RepoHistoryItem) => {
    setRepoHistory(prev => [item, ...prev]);
  };

  const handleAddArticleHistory = (item: ArticleHistoryItem) => {
    setArticleHistory(prev => [item, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-zinc-300 selection:bg-white/20 selection:text-white">
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}

      {/* Floating Header */}
      <header className="sticky top-6 z-50 mx-auto w-full max-w-2xl px-4">
        <div className="bg-[#09090b]/80 backdrop-blur-xl rounded-full px-4 py-2 flex justify-between items-center shadow-2xl border border-white/10">
          <button 
            onClick={() => setCurrentView(ViewMode.HOME)}
            className="flex items-center gap-3 group transition-all hover:opacity-100 opacity-80"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold shadow-lg shadow-white/10 group-hover:scale-105 transition-transform">
               <PenTool className="w-4 h-4" />
            </div>
            <div className="text-left flex flex-col justify-center h-full">
              <h1 className="text-sm font-bold text-white tracking-wide leading-none flex items-center gap-1.5 font-mono">
                AFFLICTED<span className="text-zinc-500">.AI</span>
              </h1>
            </div>
          </button>
          
          <div className="flex items-center gap-2">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 rounded-full text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col relative z-0">
        {/* Navigation Tabs (Hidden on Home) */}
        {currentView !== ViewMode.HOME && (
            <div className="flex justify-center mb-12 animate-in fade-in slide-in-from-top-4 sticky top-24 z-40">
            <div className="bg-[#09090b]/90 backdrop-blur-xl p-1 rounded-full flex relative shadow-xl border border-white/5">
                <button
                onClick={() => setCurrentView(ViewMode.HOME)}
                className="relative flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm transition-all duration-300 text-zinc-500 hover:text-white hover:bg-white/5"
                title="Home"
                >
                <HomeIcon className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-white/10 my-auto mx-1"></div>
                <button
                onClick={() => setCurrentView(ViewMode.REPO_ANALYZER)}
                className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full font-medium text-xs uppercase tracking-wider transition-all duration-300 font-mono ${
                    currentView === ViewMode.REPO_ANALYZER
                    ? 'text-black bg-white shadow-lg'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                >
                <GitBranch className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">GitFlow</span>
                </button>
                <button
                onClick={() => setCurrentView(ViewMode.ARTICLE_INFOGRAPHIC)}
                className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full font-medium text-xs uppercase tracking-wider transition-all duration-300 font-mono ${
                    currentView === ViewMode.ARTICLE_INFOGRAPHIC
                    ? 'text-black bg-white shadow-lg'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">SiteSketch</span>
                </button>
            </div>
            </div>
        )}

        <div className="flex-1">
            {currentView === ViewMode.HOME && (
                <Home onNavigate={handleNavigate} onUrlSubmit={handleUrlSubmit} />
            )}
            {currentView === ViewMode.REPO_ANALYZER && (
                <div className="animate-in fade-in-30 slide-in-from-bottom-4 duration-500 ease-out">
                    <RepoAnalyzer 
                        onNavigate={handleNavigate} 
                        history={repoHistory} 
                        onAddToHistory={handleAddRepoHistory}
                        initialConfig={initialConfig}
                    />
                </div>
            )}
            {currentView === ViewMode.ARTICLE_INFOGRAPHIC && (
                <div className="animate-in fade-in-30 slide-in-from-bottom-4 duration-500 ease-out">
                    <ArticleToInfographic 
                        history={articleHistory} 
                        onAddToHistory={handleAddArticleHistory}
                        initialConfig={initialConfig}
                    />
                </div>
            )}
        </div>
      </main>

      <footer className="py-8 mt-auto border-t border-white/5 bg-[#020202]">
        <div className="max-w-7xl mx-auto text-center px-4">
          <p className="text-[10px] md:text-xs font-mono text-zinc-600 tracking-widest uppercase opacity-70 hover:opacity-100 transition-opacity">
            @2025 - AfflictedAI - We trying ok.....
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
