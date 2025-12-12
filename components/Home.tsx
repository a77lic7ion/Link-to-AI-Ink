/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { ViewMode } from '../types';
import { Sparkles, Link, ArrowRight, Search, Zap, Code2, Globe } from 'lucide-react';

interface HomeProps {
  onNavigate: (mode: ViewMode) => void;
  onUrlSubmit: (url: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onUrlSubmit }) => {
  const [inputUrl, setInputUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onUrlSubmit(inputUrl.trim());
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-24 mb-20">
      {/* Hero Section */}
      <div className="text-center space-y-8 pt-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F172A] border border-violet-500/20 text-[10px] font-mono text-violet-300 uppercase tracking-widest shadow-[0_0_15px_rgba(139,92,246,0.15)] mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            System Online: Gemini 2.5 Flash
        </div>
        
        {/* Title */}
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-600 font-sans leading-[0.85] select-none">
          LINK<br/>
          <span className="text-stroke-thin opacity-20">TO</span><br/>
          INK
        </h1>
        
        <p className="text-slate-400 text-lg font-mono font-light max-w-xl mx-auto leading-relaxed pt-4">
          Visual Intelligence for <span className="text-white font-bold">Developers</span> & <span className="text-white font-bold">Designers</span>.
          <br/>Turn URL inputs into structured visual data.
        </p>

        {/* Unified Input Section */}
        <div className="w-full max-w-3xl mx-auto pt-10 relative z-10 group">
            {/* Glow effect behind input */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative bg-[#050505] rounded-xl p-2 flex items-center ring-1 ring-white/10 focus-within:ring-violet-500/50 transition-all shadow-2xl">
                    <div className="pl-5 pr-4 text-slate-500">
                        <Link className="w-5 h-5" />
                    </div>
                    <input 
                        type="url" 
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="https://github.com/user/repo  or  https://site.com/article"
                        className="w-full bg-transparent border-none text-slate-200 placeholder:text-slate-600 focus:ring-0 text-base py-4 font-mono tracking-tight"
                        required
                    />
                    <button 
                        type="submit"
                        className="px-8 py-4 bg-white text-black hover:bg-slate-200 rounded-lg font-bold transition-all flex items-center gap-2 font-mono uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        INITIALIZE <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
            </form>
            
            {/* Input helpers */}
            <div className="flex justify-between mt-4 px-4 opacity-60">
                <div className="flex gap-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Code2 className="w-3 h-3" /> Repositories</span>
                    <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> Web Articles</span>
                </div>
                <p className="text-[10px] text-emerald-500 font-mono uppercase tracking-widest flex items-center gap-1.5">
                    <Zap className="w-3 h-3" /> Free Tier Ready
                </p>
            </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/5 relative">
         {[
             { title: "Analysis", desc: "Deep structural scanning of code trees and DOM elements.", icon: Search, color: "text-violet-400", border: "group-hover:border-violet-500/30" },
             { title: "Synthesis", desc: "LLM-driven conversion of logic into visual metaphors.", icon: Zap, color: "text-fuchsia-400", border: "group-hover:border-fuchsia-500/30" },
             { title: "Render", desc: "High-fidelity generation of blueprints and infographics.", icon: Sparkles, color: "text-emerald-400", border: "group-hover:border-emerald-500/30" }
         ].map((item, i) => (
             <div key={i} className={`group p-8 rounded-2xl bg-[#080808] border border-white/5 hover:bg-[#0c0c0c] transition-all duration-300 ${item.border}`}>
                 <div className="mb-6 w-10 h-10 rounded-lg bg-black border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <item.icon className={`w-5 h-5 ${item.color}`} />
                 </div>
                 <h3 className="text-lg font-bold text-slate-200 font-sans mb-2 group-hover:text-white transition-colors">{item.title}</h3>
                 <p className="text-sm text-slate-500 font-mono leading-relaxed">{item.desc}</p>
             </div>
         ))}
      </div>
    </div>
  );
};

export default Home;
