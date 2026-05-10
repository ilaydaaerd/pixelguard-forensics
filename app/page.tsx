"use client";

import React, { useRef, useState } from "react";

export default function ForensicDashboard() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [safeScore, setSafeScore] = useState<number | null>(null);
  const [verdict, setVerdict] = useState("Waiting for Input");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Upload image
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      setSelectedImage(imageUrl);

      // DEMO ANALYSIS
      const randomScore = Math.floor(Math.random() * 40) + 60;
      setSafeScore(randomScore);

      if (randomScore > 85) {
        setVerdict("Likely Authentic");
      } else if (randomScore > 70) {
        setVerdict("Suspicious");
      } else {
        setVerdict("Likely Manipulated");
      }
    }
  };

  // Start webcam
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  // Capture photo
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context?.drawImage(video, 0, 0);

      const imageData = canvas.toDataURL("image/png");

      setSelectedImage(imageData);

      // DEMO ANALYSIS
      const randomScore = Math.floor(Math.random() * 40) + 60;
      setSafeScore(randomScore);

      if (randomScore > 85) {
        setVerdict("Likely Authentic");
      } else if (randomScore > 70) {
        setVerdict("Suspicious");
      } else {
        setVerdict("Likely Manipulated");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-300 p-4 md:p-6 flex flex-col">

      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-slate-800/60 pb-5 gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black tracking-tight text-white italic">
            PIXEL<span className="text-blue-500">GUARD</span>
          </h1>

          <p className="text-slate-500 text-xs mt-1 uppercase tracking-[0.25em] font-bold">
            AI-Based Image Authenticity Detection
          </p>
        </div>

        <div className="text-sm text-emerald-500 font-mono flex items-center gap-3 font-bold bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          SYSTEM ACTIVE
        </div>
      </header>

      {/* MAIN */}
      <main className="flex flex-col lg:grid lg:grid-cols-12 gap-6 flex-1">

        {/* LEFT PANEL */}
        <section className="lg:col-span-4 flex flex-col gap-6">

          {/* Upload */}
          <div className="bg-[#111827] border border-slate-800/50 rounded-2xl p-6 shadow-2xl">

            <h2 className="text-xs font-black mb-6 text-slate-500 uppercase tracking-[0.2em]">
              Upload Image
            </h2>

            <label
              htmlFor="image-upload"
              className="group border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center hover:border-blue-500/40 hover:bg-blue-500/[0.02] transition-all duration-300 cursor-pointer px-6 py-12"
            >
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="text-5xl mb-5 opacity-20 group-hover:opacity-100 transition">
                🖼️
              </div>

              <p className="text-sm text-slate-400 italic">
                Upload image for authenticity analysis
              </p>
            </label>
          </div>

          {/* Webcam */}
          <div className="bg-[#111827] border border-slate-800/50 rounded-2xl p-6 shadow-2xl">

            <h2 className="text-xs font-black mb-6 text-slate-500 uppercase tracking-[0.2em]">
              Live Camera Capture
            </h2>

            <video
              ref={videoRef}
              autoPlay
              className="w-full rounded-xl border border-slate-800 bg-black"
            />

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={startCamera}
                className="bg-blue-600 hover:bg-blue-700 transition rounded-xl py-3 font-bold"
              >
                Open Camera
              </button>

              <button
                onClick={capturePhoto}
                className="bg-emerald-600 hover:bg-emerald-700 transition rounded-xl py-3 font-bold"
              >
                Capture
              </button>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="lg:col-span-8">

          <div className="bg-[#111827] rounded-[2rem] p-8 border border-slate-800/50 shadow-2xl h-full flex flex-col">

            <h2 className="text-2xl font-bold text-white mb-8">
              Security Analysis Report
            </h2>

            {/* Image Preview */}
            <div className="flex-1 bg-[#070B14] rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center mb-8">

              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-slate-600 italic">
                  No image selected
                </p>
              )}
            </div>

            {/* Result */}
            <div className="bg-[#070B14] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">

              <div>
                <div className="text-[11px] text-blue-500 uppercase font-black tracking-[0.3em] mb-2">
                  Security Verdict
                </div>

                <div className="text-2xl font-bold text-slate-300 uppercase tracking-[0.1em] font-mono italic">
                  {verdict}
                </div>
              </div>

              <div className="text-center md:text-right">
                <div className="text-[11px] text-slate-600 uppercase tracking-widest mb-1 font-bold">
                  Safe Score
                </div>

                <div className="text-6xl font-black text-white tracking-tighter italic font-mono">
                  {safeScore !== null ? `${safeScore}%` : "--"}
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}