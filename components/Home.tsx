/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { ViewMode, InitialConfig } from '../types';
import { Sparkles, Link, ArrowRight, Search, Zap, Code2, Globe, Type, Palette, Target } from 'lucide-react';

interface HomeProps {
  onNavigate: (mode: ViewMode) => void;
  onUrlSubmit: (config: InitialConfig) => void;
}

const STYLES = ["Modern Data Flow", "Neon Cyberpunk", "Corporate Minimal", "Hand-Drawn Blueprint"];

const Home: React.FC<HomeProps> = ({ onNavigate, onUrlSubmit }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [customName, setCustomName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [focusArea, setFocusArea] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onUrlSubmit({
          url: inputUrl.trim(),
          customName: customName.trim(),
          style: selectedStyle,
          focus: focusArea.trim()
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-24 mb-20">
      {/* Hero Section */}
      <div className="text-center space-y-8 pt-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Minimal Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            System Online
        </div>
        
        {/* Title - Clean & Huge */}
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white font-sans leading-[0.8]">
          LINK
          <span className="text-zinc-700">2</span>
          INK
        </h1>
        
        <p className="text-zinc-400 text-lg font-normal max-w-lg mx-auto leading-relaxed pt-2">
          Turn URLs into structured visual blueprints.
        </p>

        {/* High Contrast Input Section */}
        <div className="w-full max-w-2xl mx-auto pt-12 relative z-10 group">
            <div className="absolute -inset-0.5 bg-gradient-to-b from-white/20 to-transparent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            <form onSubmit={handleSubmit} className="relative space-y-3">
                {/* Main Bar */}
                <div className="relative bg-[#050505] rounded-xl p-2 pl-4 flex items-center ring-1 ring-white/10 focus-within:ring-white/30 transition-all shadow-2xl">
                    <Link className="w-5 h-5 text-zinc-600 mr-4" />
                    <input 
                        type="url" 
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="Paste Repository or Article URL..."
                        className="w-full bg-transparent border-none text-white placeholder:text-zinc-700 focus:ring-0 text-base py-3 font-mono tracking-tight"
                        required
                    />
                    <button 
                        type="submit"
                        className="px-6 py-3 bg-white hover:bg-zinc-200 text-black rounded-lg font-bold transition-all flex items-center gap-2 font-mono uppercase tracking-wider text-[11px] shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    >
                        INITIALIZE <ArrowRight className="w-3 h-3" />
                    </button>
                </div>

                {/* Additional Controls - Carbon Style */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Name */}
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-lg p-3 flex flex-col gap-1.5 group/item focus-within:border-white/20 transition-colors">
                        <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider flex items-center gap-1.5">
                           <Type className="w-3 h-3" /> Name
                        </label>
                        <input 
                           type="text"
                           value={customName}
                           onChange={(e) => setCustomName(e.target.value)}
                           placeholder="Optional Project Name"
                           className="bg-transparent border-none p-0 text-xs text-white placeholder:text-zinc-800 focus:ring-0 font-mono w-full"
                        />
                    </div>

                    {/* Style */}
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-lg p-3 flex flex-col gap-1.5 group/item focus-within:border-white/20 transition-colors relative">
                        <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider flex items-center gap-1.5">
                           <Palette className="w-3 h-3" /> Style
                        </label>
                        <select
                           value={selectedStyle}
                           onChange={(e) => setSelectedStyle(e.target.value)}
                           className="bg-transparent border-none p-0 text-xs text-white focus:ring-0 font-mono w-full appearance-none cursor-pointer relative z-10"
                        >
                           {STYLES.map(s => <option key={s} value={s} className="bg-black">{s}</option>)}
                           <option value="Custom" className="bg-black">Custom</option>
                        </select>
                        <div className="absolute right-3 bottom-3 pointer-events-none text-zinc-700">
                           <ArrowRight className="w-3 h-3 rotate-90" />
                        </div>
                    </div>

                    {/* Focus */}
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-lg p-3 flex flex-col gap-1.5 group/item focus-within:border-white/20 transition-colors">
                        <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider flex items-center gap-1.5">
                           <Target className="w-3 h-3" /> Focus
                        </label>
                        <input 
                           type="text"
                           value={focusArea}
                           onChange={(e) => setFocusArea(e.target.value)}
                           placeholder="e.g. Auth flow"
                           className="bg-transparent border-none p-0 text-xs text-white placeholder:text-zinc-800 focus:ring-0 font-mono w-full"
                        />
                    </div>
                </div>
            </form>
            
            <div className="flex justify-center mt-6 opacity-40 hover:opacity-80 transition-opacity gap-8">
               <span className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest"><Code2 className="w-3 h-3" /> Git Repos</span>
               <span className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest"><Globe className="w-3 h-3" /> Web Articles</span>
            </div>
        </div>
      </div>

      {/* Feature Grid - Minimal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/5 relative">
         {[
             { title: "Analysis", desc: "Code tree scanning.", icon: Search },
             { title: "Synthesis", desc: "Logic to visual metaphor.", icon: Zap },
             { title: "Render", desc: "High-fidelity generation.", icon: Sparkles }
         ].map((item, i) => (
             <div key={i} className="group p-6 rounded-xl bg-[#09090b] border border-white/5 hover:border-white/10 transition-all">
                 <div className="mb-4 w-8 h-8 rounded bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                     <item.icon className="w-4 h-4" />
                 </div>
                 <h3 className="text-sm font-bold text-zinc-200 font-mono mb-1">{item.title}</h3>
                 <p className="text-xs text-zinc-500 font-sans">{item.desc}</p>
             </div>
         ))}
      </div>
    </div>
  );
};

export default Home;
