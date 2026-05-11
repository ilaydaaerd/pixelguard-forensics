"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";

export default function ForensicDashboard() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "webcam">("upload");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsCameraOn(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setIsAnalyzing(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
      setSelectedImage(null);
      setIsAnalyzing(false);
    } catch {
      alert("Kameraya erişim sağlanamadı.");
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      setSelectedImage(canvas.toDataURL("image/png"));
      setIsAnalyzing(false);
      stopCamera();
    }
  };

  const runAnalysis = () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    // Backend bağlanınca burada API çağrısı yapılacak
  };

  return (
    <div className="h-screen max-h-screen bg-[#0B0F1A] text-slate-300 p-3 md:p-4 flex flex-col overflow-hidden">

      {/* HEADER */}
      <header className="flex flex-row justify-between items-center mb-3 border-b border-slate-800/60 pb-3 shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white italic">
            PIXEL<span className="text-blue-500">GUARD</span>
          </h1>
          <p className="text-slate-500 text-[9px] mt-0.5 uppercase tracking-[0.25em] font-bold hidden sm:block">
            AI-Based Image Authenticity Detection
          </p>
        </div>
        <div className="text-xs text-emerald-500 font-mono flex items-center gap-2 font-bold bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          ACTIVE
        </div>
      </header>

      {/* MAIN */}
      <main className="flex flex-col lg:grid lg:grid-cols-12 gap-3 flex-1 min-h-0">

        {/* LEFT PANEL */}
        <section className="lg:col-span-4 flex flex-col gap-3 min-h-0">

          {/* Tab toggle */}
          <div className="flex gap-1 bg-[#111827] border border-slate-800/50 p-1 rounded-xl shrink-0">
            <button
              onClick={() => { setActiveTab("upload"); stopCamera(); clearImage(); }}
              className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${activeTab === "upload" ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-400"}`}
            >
              📁 Upload
            </button>
            <button
              onClick={() => { setActiveTab("webcam"); clearImage(); }}
              className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${activeTab === "webcam" ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-400"}`}
            >
              📷 Webcam
            </button>
          </div>

          {/* Upload */}
          {activeTab === "upload" && (
            <div className="bg-[#111827] border border-slate-800/50 rounded-2xl p-4 flex-1 flex flex-col min-h-0">
              <h2 className="text-[10px] font-black mb-3 text-slate-500 uppercase tracking-[0.2em] shrink-0">
                Upload Image
              </h2>
              {selectedImage ? (
                <div className="relative flex-1 min-h-0 rounded-xl overflow-hidden border border-slate-800">
                  <img src={selectedImage} alt="preview" className="w-full h-full object-contain" />
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center text-slate-400 hover:text-white border border-slate-700/50 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="group border-2 border-dashed border-slate-800 rounded-2xl flex-1 flex flex-col items-center justify-center text-center hover:border-blue-500/40 hover:bg-blue-500/[0.02] transition-all cursor-pointer px-6 py-8"
                >
                  <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <div className="text-4xl mb-3 opacity-20 group-hover:opacity-100 transition">🖼️</div>
                  <p className="text-sm text-slate-400 italic">Upload image for analysis</p>
                </label>
              )}
            </div>
          )}

          {/* Webcam */}
          {activeTab === "webcam" && (
            <div className="bg-[#111827] border border-slate-800/50 rounded-2xl p-4 flex-1 flex flex-col min-h-0">
              <h2 className="text-[10px] font-black mb-3 text-slate-500 uppercase tracking-[0.2em] shrink-0">
                Live Camera
              </h2>
              <div className="relative flex-1 min-h-0 rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center">
                {!isCameraOn && !selectedImage && (
                  <p className="text-slate-600 italic text-sm">Camera is off</p>
                )}
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover ${isCameraOn ? "block" : "hidden"}`}
                />
                {selectedImage && !isCameraOn && (
                  <>
                    <img src={selectedImage} alt="captured" className="w-full h-full object-contain" />
                    <button
                      onClick={clearImage}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center text-slate-400 hover:text-white border border-slate-700/50 text-sm"
                    >
                      ✕
                    </button>
                  </>
                )}
                {isCameraOn && (
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[9px] text-red-400 uppercase tracking-widest font-black">LIVE</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-3 shrink-0">
                {!isCameraOn && !selectedImage && (
                  <button onClick={startCamera} className="flex-1 bg-blue-600 hover:bg-blue-700 transition rounded-xl py-2.5 text-[10px] font-black uppercase tracking-[0.2em]">
                    Open Camera
                  </button>
                )}
                {isCameraOn && (
                  <>
                    <button onClick={capturePhoto} className="flex-1 bg-emerald-600 hover:bg-emerald-700 transition rounded-xl py-2.5 text-[10px] font-black uppercase tracking-[0.2em]">
                      Capture
                    </button>
                    <button onClick={stopCamera} className="px-4 bg-slate-700 hover:bg-slate-600 transition rounded-xl py-2.5 text-[10px] font-black uppercase tracking-[0.15em]">
                      Stop
                    </button>
                  </>
                )}
                {selectedImage && !isCameraOn && (
                  <button onClick={startCamera} className="flex-1 bg-slate-700 hover:bg-slate-600 transition rounded-xl py-2.5 text-[10px] font-black uppercase tracking-[0.15em]">
                    Retake
                  </button>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </section>

        {/* RIGHT PANEL */}
        <section className="lg:col-span-8 flex flex-col min-h-0">
          <div className="bg-[#111827] rounded-[1.5rem] p-4 md:p-6 border border-slate-800/50 shadow-2xl flex-1 flex flex-col min-h-0">
            <h2 className="text-lg md:text-xl font-bold text-white mb-2 shrink-0">
              Security Analysis Report
            </h2>

            {/* Image Preview */}
            <div className="relative flex-1 bg-[#070B14] rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center mb-4 min-h-0">
              <div className="absolute left-0 w-full h-[2px] bg-blue-500/40 z-10 animate-[scanupdown_8s_ease-in-out_infinite]" />
              {selectedImage ? (
                <img src={selectedImage} alt="preview" className="w-full h-full object-contain" />
              ) : (
                <p className="text-slate-600 italic text-sm">No image selected</p>
              )}
            </div>

            {/* Result + Analyze button */}
            <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
              <div>
                <div className="text-[10px] text-blue-500 uppercase font-black tracking-[0.3em] mb-1">
                  Security Verdict
                </div>
                <div className="text-lg md:text-xl font-bold text-slate-300 uppercase tracking-[0.1em] font-mono italic">
                  {isAnalyzing ? "Analyzing..." : "Waiting for Input"}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-[10px] text-slate-600 uppercase tracking-widest mb-1 font-bold">Safe Score</div>
                  <div className="text-4xl md:text-5xl font-black text-white tracking-tighter italic font-mono">
                    --
                  </div>
                </div>
                <button
                  onClick={runAnalysis}
                  disabled={!selectedImage || isAnalyzing}
                  className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    selectedImage && !isAnalyzing
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "bg-slate-800 text-slate-700 cursor-not-allowed"
                  }`}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        @keyframes scanupdown {
          0%   { top: 0; }
          50%  { top: calc(100% - 2px); }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
}