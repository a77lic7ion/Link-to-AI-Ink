/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import RepoAnalyzer from './components/RepoAnalyzer';
import ArticleToInfographic from './components/ArticleToInfographic';
import Home from './components/Home';
import IntroAnimation from './components/IntroAnimation';
import { ViewMode, RepoHistoryItem, ArticleHistoryItem } from './types';
import { Github, PenTool, GitBranch, FileText, Home as HomeIcon } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.HOME);
  const [showIntro, setShowIntro] = useState(true);
  
  // Lifted History State for Persistence
  const [repoHistory, setRepoHistory] = useState<RepoHistoryItem[]>([]);
  const [articleHistory, setArticleHistory] = useState<ArticleHistoryItem[]>([]);
  const [targetUrl, setTargetUrl] = useState<string>('');

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleNavigate = (mode: ViewMode) => {
    setCurrentView(mode);
    setTargetUrl(''); // Clear target on manual nav
  };

  const handleUrlSubmit = (url: string) => {
    setTargetUrl(url);
    // Basic detection for GitHub URLs
    if (url.includes('github.com') && url.split('/').length >= 4) {
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
    <div className="min-h-screen flex flex-col font-sans text-slate-300 selection:bg-fuchsia-500/30 selection:text-fuchsia-100">
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}

      <header className="sticky top-4 z-50 mx-auto w-[calc(100%-1rem)] md:w-[calc(100%-2rem)] max-w-[1400px]">
        <div className="glass-panel rounded-full px-5 py-3 flex justify-between items-center shadow-2xl border border-white/5 bg-[#0a0a0a]/60 backdrop-blur-xl">
          <button 
            onClick={() => setCurrentView(ViewMode.HOME)}
            className="flex items-center gap-3 group transition-all hover:opacity-100 opacity-90"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/20 border border-white/10 group-hover:border-violet-500/50 transition-all shadow-inner">
               <PenTool className="w-5 h-5 text-violet-200" />
            </div>
            <div className="text-left flex flex-col justify-center h-full">
              <h1 className="text-lg font-bold text-white tracking-tight leading-none flex items-center gap-2">
                AFFLICTED<span className="text-violet-500">.AI</span>
              </h1>
              <span className="text-[10px] font-mono text-slate-500 tracking-[0.2em] uppercase leading-none mt-1">Studio</span>
            </div>
          </button>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2.5 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-violet-500/30 transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {/* Navigation Tabs (Hidden on Home, visible on tools) */}
        {currentView !== ViewMode.HOME && (
            <div className="flex justify-center mb-12 animate-in fade-in slide-in-from-top-4 sticky top-24 z-40">
            <div className="glass-panel p-1.5 rounded-full flex relative shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
                <button
                onClick={() => setCurrentView(ViewMode.HOME)}
                className="relative flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm transition-all duration-300 font-mono text-slate-500 hover:text-white hover:bg-white/10"
                title="Home"
                >
                <HomeIcon className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-white/10 my-auto mx-1"></div>
                <button
                onClick={() => setCurrentView(ViewMode.REPO_ANALYZER)}
                className={`relative flex items-center gap-2 px-5 py-2 rounded-full font-medium text-xs uppercase tracking-wider transition-all duration-300 font-mono ${
                    currentView === ViewMode.REPO_ANALYZER
                    ? 'text-white bg-violet-600/10 shadow-[inset_0_0_10px_rgba(139,92,246,0.2)] border border-violet-500/20'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                >
                <GitBranch className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">GitFlow</span>
                </button>
                <button
                onClick={() => setCurrentView(ViewMode.ARTICLE_INFOGRAPHIC)}
                className={`relative flex items-center gap-2 px-5 py-2 rounded-full font-medium text-xs uppercase tracking-wider transition-all duration-300 font-mono ${
                    currentView === ViewMode.ARTICLE_INFOGRAPHIC
                    ? 'text-emerald-100 bg-emerald-500/10 shadow-[inset_0_0_10px_rgba(16,185,129,0.2)] border border-emerald-500/20'
                    : 'text-slate-500 hover:text-slate-300'
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
                        initialUrl={targetUrl}
                    />
                </div>
            )}
            {currentView === ViewMode.ARTICLE_INFOGRAPHIC && (
                <div className="animate-in fade-in-30 slide-in-from-bottom-4 duration-500 ease-out">
                    <ArticleToInfographic 
                        history={articleHistory} 
                        onAddToHistory={handleAddArticleHistory}
                        initialUrl={targetUrl}
                    />
                </div>
            )}
        </div>
      </main>

      <footer className="py-8 mt-auto border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto text-center px-4">
          <p className="text-[10px] md:text-xs font-mono text-slate-600 tracking-widest uppercase opacity-70 hover:opacity-100 transition-opacity">
            @2025 - AfflictedAI - We trying ok.....
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
