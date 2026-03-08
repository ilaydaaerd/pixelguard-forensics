"use client";

import React, { useState } from 'react';

export default function ForensicDashboard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    // h-screen yerine min-h-screen yaptık ki mobilde içerik uzarsa sayfa kesilmesin
    <div className="min-h-screen bg-[#0B0F1A] text-slate-300 font-sans p-4 md:p-6 selection:bg-blue-500/30 flex flex-col">
      
      {/* HEADER: Mobilde ortaladık (text-center) */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-slate-800/60 pb-5 gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black tracking-tight text-white italic">
            PIXEL<span className="text-blue-500">GUARD</span>
          </h1>
          <p className="text-slate-500 text-[10px] md:text-xs mt-1 uppercase tracking-[0.25em] font-bold">
            AI-Based Real-Time Image Forgery Detection
          </p>
        </div>
        <div className="text-center md:text-right">
          <div className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-1">System Status</div>
          <div className="text-sm text-emerald-500 font-mono flex items-center gap-3 font-bold bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            ACTIVE
          </div>
        </div>
      </header>

      {/* ANA PANEL: col-span yerine flex-col kullanarak mobilde alt alta gelmesini sağladık */}
      <main className="flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-8 flex-1 pb-4">
        
        {/* SOL PANEL: Upload alanı */}
        <section className="lg:col-span-4 flex flex-col min-h-[400px]">
          <div className="bg-[#111827] border border-slate-800/50 rounded-2xl p-6 md:p-8 shadow-2xl flex-1 flex flex-col">
            <h2 className="text-xs font-black mb-6 text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span> 
              Content Upload
            </h2>
            
            <label htmlFor="video-upload" className="group relative border-2 border-dashed border-slate-800/80 rounded-2xl flex-1 flex flex-col items-center justify-center text-center hover:border-blue-500/40 hover:bg-blue-500/[0.02] transition-all duration-300 cursor-pointer overflow-hidden px-6 py-10">
              <input id="video-upload" type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
              <div className="text-5xl md:text-6xl mb-6 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">📱</div>
              <p className="text-sm md:text-base text-slate-400 font-medium italic leading-relaxed">
                {selectedFile ? selectedFile.name : "Select photo or video to verify authenticity..."}
              </p>
              <p className="mt-4 text-[9px] md:text-[10px] text-slate-600 uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Supported: JPG, PNG, MP4, MOV
              </p>
            </label>
            
            <div className="mt-8 pt-6 border-t border-slate-800/50">
              <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed italic text-center px-2">
                "PixelGuard uses advanced neural networks to identify traces of digital manipulation in real-time."
              </p>
            </div>
          </div>
        </section>

        {/* SAĞ PANEL: Analiz ekranları */}
        <section className="lg:col-span-8 flex flex-col">
          <div className="bg-[#111827] rounded-[2rem] p-6 md:p-8 border border-slate-800/50 shadow-2xl relative flex-1 flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-8 tracking-tight">Security Analysis Report</h2>
            
            {/* Kartlar mobilde alt alta, tablette yan yana */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 flex-1">
              <div className="group relative aspect-video bg-[#070B14] rounded-2xl flex items-center justify-center border border-slate-800/50 hover:border-blue-500/20 transition-all duration-500">
                <div className="text-center px-6">
                  <span className="block text-slate-300 font-bold text-xs md:text-sm uppercase tracking-[0.15em] mb-2 group-hover:text-blue-400 transition-colors">Deep Scan Analysis</span>
                  <span className="block text-slate-600 text-[9px] md:text-[10px] italic font-medium">Tracing digital fingerprints and artifacts</span>
                </div>
              </div>
              
              <div className="relative aspect-video bg-black rounded-2xl flex items-center justify-center border border-slate-800 shadow-inner overflow-hidden group">
                <div className="text-center px-6">
                  <span className="block text-blue-500/80 font-bold text-xs md:text-sm uppercase tracking-[0.15em] mb-2 group-hover:text-blue-400 transition-colors">Fake Area Detection</span>
                  <span className="block text-slate-700 text-[9px] md:text-[10px] italic font-medium">Mapping localized pixel inconsistencies</span>
                </div>
                <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500/40 shadow-[0_0_20px_blue] animate-[scan_5s_linear_infinite]"></div>
              </div>
            </div>

            {/* Karar Mekanizması: Mobilde dikey, tablette yatay düzen */}
            <div className="mt-8 p-6 md:p-8 bg-[#070B14] border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-center shadow-inner gap-6 text-center sm:text-left">
              <div>
                <div className="text-[10px] md:text-[11px] text-blue-500 uppercase font-black tracking-[0.3em] mb-2">Security Verdict</div>
                <div className="text-xl md:text-2xl font-bold text-slate-400 uppercase tracking-[0.1em] font-mono italic">
                  {selectedFile ? "Scanning Content..." : "Waiting for Input"}
                </div>
              </div>
              <div className="sm:text-right">
                <div className="text-[10px] md:text-[11px] text-slate-600 uppercase tracking-widest mb-1 font-bold">Safe Score</div>
                <div className="text-4xl md:text-6xl font-black text-slate-800 tabular-nums tracking-tighter italic font-mono">
                  00<span className="text-2xl md:text-3xl opacity-20 text-white">.0%</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(300px); }
        }
      `}</style>
    </div>
  );
}