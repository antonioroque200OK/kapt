"use client";

import { Calendar, Camera, MapPin, Users } from 'lucide-react';

interface OccurrenceCardProps {
    title: string;
    location: string;
    photoCount: number;
    photographerCount: number;
    date: string;
    images: string[];
    tag?: string;
}

export function OccurrenceCard({
    title,
    location,
    photoCount,
    photographerCount,
    date,
    images,
    tag
}: OccurrenceCardProps) {
    return (
        <div className="bg-zinc-900/50 ring-2 ring-zinc-400 rounded-xl overflow-hidden hover:ring-[3px] hover:ring-volt transition-all group">
            <div className="grid grid-cols-2 gap-0.5 h-48 relative">
                {tag && (
                    <span className="absolute top-3 left-3 z-10 bg-volt text-black text-[10px] font-black px-2 py-1 rounded-sm uppercase italic">
                        {tag}
                    </span>
                )}
                {images.slice(0, 4).map((img, i) => (
                    <div key={i} className="bg-zinc-800 w-full h-full overflow-hidden">
                        <img src={img} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider leading-relaxed">
                        {title}
                    </h3>
                    <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded text-[11px] font-mono font-bold text-white shrink-0">
                        <Calendar size={11} className="text-volt" />
                        {date}
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-zinc-200 text-[10px] mb-3 uppercase tracking-widest font-medium">
                    <MapPin size={10} className="text-volt" />
                    {location}
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-3 mb-4">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-volt text-[8px] uppercase font-bold tracking-widest">
                            <Camera size={10} /> Fotos
                        </div>
                        <span className="text-base font-black text-white">{photoCount.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-volt text-[8px] uppercase font-bold tracking-widest">
                            <Users size={10} /> Creators
                        </div>
                        <span className="text-base font-black text-white">{photographerCount}</span>
                    </div>
                </div>

                <button className="w-full bg-zinc-800 text-zinc-300 font-bold text-[9px] uppercase tracking-widest py-3 rounded hover:bg-zinc-700 transition-colors">
                    Ver Galeria
                </button>
            </div>
        </div>
    );
}