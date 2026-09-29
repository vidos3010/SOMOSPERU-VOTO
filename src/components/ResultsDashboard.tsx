import React, { useState } from 'react';
import type { VoteSimulationRecord } from '../data/pascoData';
import { PASCO_PROVINCES } from '../data/pascoData';
import { BarChart3, MapPin } from 'lucide-react';

interface ResultsDashboardProps {
  votes: VoteSimulationRecord[];
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ votes }) => {
  const [selectedScope, setSelectedScope] = useState<string>('all'); // 'all' or province name
  const [selectedSeccionName, setSelectedSeccionName] = useState<string>('GOBERNADOR');

  // Filter votes based on selected province scope
  const filteredVotes = selectedScope === 'all' 
    ? votes 
    : votes.filter(v => v.provincia === selectedScope);

  const totalVotesCount = filteredVotes.length;

  // Aggregate votes for the selected section
  const partyVotes: Record<string, { name: string; count: number }> = {};
  let validVotes = 0;
  let blancoVotes = 0;
  let nuloVotes = 0;

  filteredVotes.forEach(v => {
    const sec = v.selections.find(s => s.seccionNombre.toUpperCase().includes(selectedSeccionName));
    if (sec) {
      if (sec.status === 'valido' && sec.partyName) {
        if (!partyVotes[sec.partyName]) {
          partyVotes[sec.partyName] = { name: sec.partyName, count: 0 };
        }
        partyVotes[sec.partyName].count++;
        validVotes++;
      } else if (sec.status === 'blanco') {
        blancoVotes++;
      } else {
        nuloVotes++;
      }
    }
  });

  const sortedParties = Object.values(partyVotes).sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 px-3 sm:px-6 pb-24 sm:pb-12">
      
      {/* Title & Scope Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Resultados y Estadísticas</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Simulacro de Votación — Región Pasco
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Conteo de votos simulados en tiempo real.
          </p>
        </div>

        {/* Scope Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedScope('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap touch-manipulation ${
              selectedScope === 'all'
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Toda la Región Pasco
          </button>
          {PASCO_PROVINCES.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedScope(p.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap touch-manipulation ${
                selectedScope === p.id
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Votos</div>
          <div className="text-xl sm:text-3xl font-black text-slate-900">{totalVotesCount.toLocaleString()}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-1 flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="truncate">{selectedScope === 'all' ? 'Región Pasco' : selectedScope}</span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Votos Válidos</div>
          <div className="text-xl sm:text-3xl font-black text-emerald-600">
            {totalVotesCount > 0 ? ((validVotes / totalVotesCount) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-1">{validVotes.toLocaleString()} válidos</div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Votos Blanco</div>
          <div className="text-xl sm:text-3xl font-black text-amber-600">
            {totalVotesCount > 0 ? ((blancoVotes / totalVotesCount) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-1">{blancoVotes.toLocaleString()} blancos</div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Votos Nulos</div>
          <div className="text-xl sm:text-3xl font-black text-slate-700">
            {totalVotesCount > 0 ? ((nuloVotes / totalVotesCount) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-1">{nuloVotes.toLocaleString()} nulos</div>
        </div>
      </div>

      {/* Level Selector Tabs */}
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedSeccionName('GOBERNADOR')}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-black transition-colors whitespace-nowrap relative touch-manipulation ${
            selectedSeccionName === 'GOBERNADOR'
              ? 'text-emerald-700 border-b-2 border-emerald-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Gobernador Regional
        </button>
        <button
          onClick={() => setSelectedSeccionName('CONSEJEROS')}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-black transition-colors whitespace-nowrap relative touch-manipulation ${
            selectedSeccionName === 'CONSEJEROS'
              ? 'text-emerald-700 border-b-2 border-emerald-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Consejeros Regionales
        </button>
        <button
          onClick={() => setSelectedSeccionName('PROVINCIAL')}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-black transition-colors whitespace-nowrap relative touch-manipulation ${
            selectedSeccionName === 'PROVINCIAL'
              ? 'text-emerald-700 border-b-2 border-emerald-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Municipal Provincial
        </button>
      </div>

      {/* Main Results Table & Charts */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-bold uppercase text-slate-600 truncate">
            Organizaciones Políticas
          </span>
          <span className="text-[10px] sm:text-xs font-semibold text-slate-500 shrink-0">
            {validVotes.toLocaleString()} válidos
          </span>
        </div>

        {sortedParties.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-slate-500 text-xs">
            Aún no se han registrado votos válidos para esta sección. ¡Sé el primero en votar en el simulador!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sortedParties.map((party, index) => {
              const percent = validVotes > 0 ? ((party.count / validVotes) * 100) : 0;

              return (
                <div key={party.name} className="p-3.5 sm:p-5 hover:bg-slate-50/80 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 mb-2">
                    
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className={`w-5 text-center text-xs font-black shrink-0 ${
                        index === 0 ? 'text-amber-500 font-extrabold text-sm' : 'text-slate-400'
                      }`}>
                        #{index + 1}
                      </span>

                      <div className="min-w-0">
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-1">{party.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 pl-7 sm:pl-0">
                      <span className="text-xs text-slate-500">{party.count.toLocaleString()} votos</span>
                      <span className="text-sm sm:text-lg font-black text-slate-900">{percent.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2.5 sm:h-3.5 overflow-hidden pl-7 sm:pl-0">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${percent}%`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
