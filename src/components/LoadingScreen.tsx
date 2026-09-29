import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import portadaImg from '../image/portada.jpg';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Iniciando sistema electoral...');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const steps = [
      { at: 10, text: 'Conectando con la base de datos de Pasco...' },
      { at: 35, text: 'Cargando cédulas de Pasco, D.A. Carrión y Oxapampa...' },
      { at: 65, text: 'Configurando el voto por SOMOS PERÚ...' },
      { at: 88, text: 'Calibrando resolución de simulación...' },
      { at: 100, text: '¡Cédula Oficial Lista!' }
    ];

    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.floor(Math.random() * 6) + 5;
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          setCurrentStep(steps[steps.length - 1].text);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onComplete, 500);
          }, 450);
          return 100;
        }

        const match = steps.slice().reverse().find(s => next >= s.at);
        if (match) {
          setCurrentStep(match.text);
        }
        return next;
      });
    }, 75);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-black text-white select-none overflow-hidden transition-all duration-700 ${
        fadeOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* FULL-SCREEN RESPONSIVE PORTADA ADAPTATION */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        {/* Ambient Blurred Background to fill widescreen borders with matching colors */}
        <img
          src={portadaImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center blur-2xl opacity-40 scale-110"
        />
        <div className="absolute inset-0 bg-slate-950/60" />

        {/* Crisp, Uncropped 100% Adapted Portada Image */}
        <img
          src={portadaImg}
          alt="SOMOS PERU Pasco - Portada Oficial"
          className="relative z-10 max-w-full max-h-[85vh] w-auto h-auto object-contain object-center drop-shadow-[0_0_35px_rgba(220,38,38,0.5)] transition-transform duration-700 hover:scale-[1.01]"
        />

        {/* Subtle Vignette Overlay for Crisp Contrast */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70 pointer-events-none" />
      </div>

      {/* TOP BAR: Badge & Logo Brand */}
      <div className="relative z-10 w-full max-w-5xl mx-auto pt-4 sm:pt-6 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3 bg-slate-950/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-red-500/40 shadow-xl">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl p-1 shadow-md border border-red-500 flex items-center justify-center shrink-0">
            <img
              src="/data/logos/14.png"
              alt="SOMOS PERU"
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://votabien.pe/data/logos/14.png';
              }}
            />
          </div>
          <div>
            <span className="font-black text-white text-sm sm:text-base tracking-tight leading-none block">
              SOMOS PERU
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-red-400 block">
              Región Pasco 2026
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 bg-red-600/80 backdrop-blur-md text-white border border-red-400/60 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: '4s' }} />
          <span>SIMULADOR OFICIAL</span>
        </div>
      </div>

      {/* BOTTOM FLOATING GLASS CONTROL BAR */}
      <div className="relative z-10 w-full max-w-3xl mx-auto pb-6 sm:pb-8 px-4">
        <div className="bg-slate-950/85 backdrop-blur-2xl border-2 border-red-500/50 rounded-3xl p-4 sm:p-6 shadow-[0_0_80px_rgba(220,38,38,0.5)]">
          
          {/* 3 Provinces Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3 sm:mb-4">
            <span className="bg-slate-900/90 border border-slate-700 text-slate-200 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-xl shadow-sm">
              🏛️ Prov. Pasco (13 Dist.)
            </span>
            <span className="bg-slate-900/90 border border-slate-700 text-slate-200 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-xl shadow-sm">
              🏛️ Prov. D.A.C. (8 Dist.)
            </span>
            <span className="bg-slate-900/90 border border-slate-700 text-slate-200 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-xl shadow-sm">
              🏛️ Prov. Oxapampa (8 Dist.)
            </span>
          </div>

          {/* Progress Bar with Current Step Text */}
          <div className="w-full mb-3">
            <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-200 mb-2 px-1">
              <span className="truncate text-left">{currentStep}</span>
              <span className="text-red-400 font-mono font-black text-sm sm:text-base ml-2">{progress}%</span>
            </div>

            <div className="w-full h-3.5 sm:h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-red-500 rounded-full transition-all duration-150 ease-out shadow-[0_0_20px_rgba(239,68,68,0.9)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 text-xs font-bold text-slate-400 border-t border-slate-800/80 pt-3 w-full">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span>29 Distritos Electorales</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Cédulas Oficiales Verificadas</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
