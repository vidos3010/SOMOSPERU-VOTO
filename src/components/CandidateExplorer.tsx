import React, { useState, useEffect } from 'react';
import type { OfficialCedulaData } from '../data/pascoData';
import { Search, FileText } from 'lucide-react';

export const CandidateExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cedula, setCedula] = useState<OfficialCedulaData | null>(null);

  useEffect(() => {
    // Load regional Chaupimarca / Pasco cedula as reference
    fetch('/data/cedulas/180101.json')
      .then(r => r.json())
      .then(d => setCedula(d))
      .catch(() => {});
  }, []);

  const organizaciones = cedula?.secciones?.[0]?.organizaciones || [];
  const filtered = organizaciones.filter(o => 
    o.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-8 px-3 sm:px-6 pb-24 sm:pb-12">
      
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4" />
          <span>Organizaciones Oficiales — Pasco</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Partidos y Símbolos en la Cédula
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Lista oficial con números de orden extraídos de votabien.pe.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-5">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Buscar organización o partido..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm font-medium"
        />
      </div>

      {/* Grid of Parties */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filtered.map((org) => (
          <div
            key={org.id}
            className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm hover:border-emerald-400 transition-all flex items-center gap-3.5"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-1 shrink-0">
              <img
                src={`/data/logos/${org.logo}`}
                alt={org.nombre}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://votabien.pe/data/logos/${org.logo}`;
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="bg-slate-900 text-amber-400 text-[9px] font-black px-1.5 py-0.5 rounded">
                  #{org.orden}
                </span>
                <span className="text-[9px] uppercase font-bold text-emerald-700">{org.bloque}</span>
              </div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 mt-0.5 leading-tight line-clamp-2">
                {org.nombre}
              </h3>
              <div className="text-[9px] text-slate-400 mt-0.5">
                ID JNE: {org.id}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
