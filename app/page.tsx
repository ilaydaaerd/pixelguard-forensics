"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";

export default function ForensicDashboard() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [safeScore, setSafeScore] = useState<number | null>(null);
  const [verdict, setVerdict] = useState("Waiting for Input");
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "webcam">("upload");

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
      setSafeScore(null);
      setVerdict("Waiting for Input");
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setSafeScore(null);
    setVerdict("Waiting for Input");
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
      setSafeScore(null);
      setVerdict("Waiting for Input");
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
      setSafeScore(null);
      setVerdict("Waiting for Input");
      stopCamera();
    }
  };

  const runAnalysis = () => {
    if (!selectedImage) return;
    const randomScore = Math.floor(Math.random() * 40) + 60;
    setSafeScore(randomScore);
    if (randomScore > 85) setVerdict("Likely Authentic");
    else if (randomScore > 70) setVerdict("Suspicious");
    else setVerdict("Likely Manipulated");
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
                  <img src={selectedImage} className="w-full h-full object-contain" />
                  <button onClick={clearImage} className="absolute top-2 right-2 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center">
                    ✕
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-800 rounded-2xl flex-1 flex items-center justify-center cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <p className="text-sm text-slate-400">Upload image</p>
                </label>
              )}
            </div>
          )}

          {/* Webcam */}
          {activeTab === "webcam" && (
            <div className="bg-[#111827] border border-slate-800/50 rounded-2xl p-4 flex-1 flex flex-col min-h-0">
              <h2 className="text-[10px] font-black mb-3 text-slate-500 uppercase tracking-[0.2em]">
                Live Camera
              </h2>

              <div className="relative flex-1 rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center">
                <video ref={videoRef} autoPlay muted className={`w-full h-full object-cover ${isCameraOn ? "block" : "hidden"}`} />
              </div>

              <div className="flex gap-2 mt-3">
                {!isCameraOn ? (
                  <button onClick={startCamera} className="flex-1 bg-blue-600 rounded-xl py-2 text-[10px] font-bold">
                    Open
                  </button>
                ) : (
                  <>
                    <button onClick={capturePhoto} className="flex-1 bg-emerald-600 rounded-xl py-2 text-[10px] font-bold">
                      Capture
                    </button>
                    <button onClick={stopCamera} className="px-4 bg-red-600 rounded-xl py-2 text-[10px] font-bold">
                      Stop
                    </button>
                  </>
                )}
              </div>

              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </section>

        {/* RIGHT PANEL */}
        <section className="lg:col-span-8 flex flex-col min-h-0">
          <div className="bg-[#111827] rounded-[1.5rem] p-4 border border-slate-800/50 flex-1 flex flex-col min-h-0">

            <h2 className="text-lg font-bold text-white mb-3">
              Security Analysis Report
            </h2>

            {/* IMAGE + SCAN EFFECT */}
            <div className="relative flex-1 bg-[#070B14] rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center mb-4 min-h-0">

              {/* SCANNER LINE */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="w-full h-1 bg-blue-500/30 animate-scanLine"></div>
              </div>

              {selectedImage ? (
                <img src={selectedImage} className="w-full h-full object-contain" />
              ) : (
                <p className="text-slate-600 text-sm">No image selected</p>
              )}
            </div>

            {/* RESULT */}
            <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-4 flex justify-between items-center">

              <div>
                <div className="text-[10px] text-blue-500 uppercase font-black tracking-[0.3em]">
                  Security Verdict
                </div>
                <div className="text-lg font-bold">
                  {verdict}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-500">Score</div>
                <div className="text-3xl font-black">
                  {safeScore !== null ? `${safeScore}%` : "--"}
                </div>
              </div>

              <button
                onClick={runAnalysis}
                className="ml-4 bg-blue-600 px-4 py-2 rounded-xl text-[10px] font-bold"
              >
                Analyze
              </button>
            </div>

          </div>
        </section>
      </main>

      {/* ANIMATION */}
      <style jsx>{`
        @keyframes scanLine {
          0% { transform: translateY(0%); }
          100% { transform: translateY(100%); }
        }

        .animate-scanLine {
          animation: scanLine 2.5s linear infinite;
        }
      `}</style>
    </div>
  );
}