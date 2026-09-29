import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Split, Shield, BookOpen, Clock, FileCheck } from 'lucide-react';

export const VotingGuide: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-8 px-3 sm:px-6 pb-24 sm:pb-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full mb-2.5">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guía Cívica del Elector</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          ¿Cómo emitir un voto válido?
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Aprende las reglas oficiales de la ONPE para que tu voto cuente en Pasco.
        </p>
      </div>

      {/* 3 Types of Votes: Valid, Null, White */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
        
        {/* Voto Válido */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-emerald-400 p-4 sm:p-6 shadow-sm flex flex-col">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 mb-1.5">1. Voto Válido</h2>
          <p className="text-xs text-slate-600 leading-relaxed mb-3 flex-1">
            Se produce cuando el elector marca con una <strong>cruz (+)</strong> o un <strong>aspa (✕)</strong> sobre el símbolo del partido.
          </p>

          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-[11px] text-emerald-900 font-medium space-y-1">
            <div className="font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>Regla de Oro:</span>
            </div>
            <p>La intersección de las dos líneas debe estar <strong>DENTRO</strong> del recuadro del símbolo.</p>
          </div>
        </div>

        {/* Voto Nulo / Viciado */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-red-300 p-4 sm:p-6 shadow-sm flex flex-col">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-3">
            <XCircle className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 mb-1.5">2. Voto Nulo / Viciado</h2>
          <p className="text-xs text-slate-600 leading-relaxed mb-3 flex-1">
            Se anula cuando la cédula presenta marcas indebidas, signos ajenos o dobles marcas en una misma sección.
          </p>

          <div className="bg-red-50 rounded-xl p-3 border border-red-200 text-[11px] text-red-900 font-medium space-y-0.5">
            <div className="font-bold">Motivos de anulación:</div>
            <ul className="list-disc list-inside space-y-0.5 text-[10px]">
              <li>Marcar dos partidos distintos en la misma sección.</li>
              <li>Escribir frases, firmas o dibujos.</li>
              <li>Usar checks (✓) o círculos en lugar de (+) o (✕).</li>
            </ul>
          </div>
        </div>

        {/* Voto en Blanco */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-amber-300 p-4 sm:p-6 shadow-sm flex flex-col">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 mb-1.5">3. Voto en Blanco</h2>
          <p className="text-xs text-slate-600 leading-relaxed mb-3 flex-1">
            Ocurre cuando el elector decide no realizar ninguna marca dentro de una columna de la cédula.
          </p>

          <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-[11px] text-amber-900 font-medium space-y-1">
            <div className="font-bold">Efecto:</div>
            <p>Los votos en blanco no se suman a ningún candidato.</p>
          </div>
        </div>

      </div>

      {/* Voto Cruzado Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-8 sm:mb-12 shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg">
            <Split className="w-7 h-7 sm:w-10 sm:h-10" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-black uppercase text-emerald-400 tracking-wider">
              Libertad de Elección
            </span>
            <h2 className="text-lg sm:text-2xl font-black mt-0.5 mb-2">
              ¿Puedo hacer "Voto Cruzado"?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong>¡SÍ, ES TOTALMENTE VÁLIDO!</strong> Cada sección de la cédula es independiente. Puedes votar por un partido distinto en cada cuerpo de la cédula.
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Recomendaciones para el día de votación</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <Clock className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Horario de Votación</span>
              <span className="text-slate-600">De 07:00 a 17:00 horas según el dígito de tu DNI.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <FileCheck className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Documento DNI</span>
              <span className="text-slate-600">Presenta tu DNI físico (azul, amarillo o electrónico).</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
