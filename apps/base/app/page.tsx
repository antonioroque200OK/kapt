"use client";

import { useState } from 'react';
import { OccurrenceCard } from '@/components/OccurrenceCard';
import { OTPModal } from '@/components/OTPModal';
import { Navbar } from '@/components/Navbar';
import { MOCK_OCCURRENCES } from '@/mocks/occurrences';

const presentation_title = "Treino Coletivo Litorânea Sunset";
const presentation_images = [
  "https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=600&auto=format",
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format",
  "https://images.unsplash.com/photo-1530143311094-34d807799e8f?q=80&w=600&auto=format",
  "https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=600&auto=format"
];

export default function Page() {
  const [isOTPOpen, setIsOTPOpen] = useState(false);

  const handleAuthSuccess = (token: string) => {
    localStorage.setItem('kapt_token', token);
    setIsOTPOpen(false);
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12">
      <OTPModal
        isOpen={isOTPOpen}
        onClose={() => setIsOTPOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Header Container: Forced alignment via a single flex row with two distinct columns */}
      <header className="mb-20 max-w-7xl mx-auto border-b border-white/10 pb-12 flex flex-row justify-between items-start">

        {/* Left Side: Brand Identity */}
        <h1 className="text-volt text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic shrink-0">
          KAPT
        </h1>

        {/* Right Side: Navigation and Contextual Info - All strictly right-aligned */}
        <div className="flex flex-col items-end text-right flex-1">
          <div className="mb-10">
            <Navbar />
          </div>

          {/* ALIGNMENT FIX: Description is now strictly within the same right-aligned flex column */}
          <p className="text-zinc-400 text-xs md:text-sm font-semibold tracking-widest uppercase mb-1">
            Galerias oficiais de eventos multiesportivos.
          </p>

          <span className="text-3xl md:text-5xl font-medium tracking-[0.25em] text-white uppercase font-mono leading-none mb-6">
            Coberturas
          </span>

          <div className="flex items-center gap-6">
            <span className="text-zinc-500 text-xs font-mono uppercase tracking-[0.2em] hidden md:inline">
              {MOCK_OCCURRENCES.length} {MOCK_OCCURRENCES.length === 1 ? 'ATIVO' : 'ATIVOS'}
            </span>
            <button
              onClick={() => setIsOTPOpen(true)}
              className="bg-volt text-black font-extrabold text-[10px] uppercase tracking-widest px-8 py-3 rounded-sm hover:brightness-110 transition-all shadow-xl shadow-volt/20"
            >
              Entrar
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {MOCK_OCCURRENCES.map((occ) => (
          <OccurrenceCard
            key={occ.id}
            title={presentation_title}
            location={occ.location}
            photoCount={occ.photoCount}
            photographerCount={occ.photographerCount}
            date={occ.data}
            images={presentation_images}
            tag={occ.tag}
          />
        ))}
      </div>
    </main>
  );
}