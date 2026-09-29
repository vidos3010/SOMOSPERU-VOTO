import React, { useState } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { PASCO_PROVINCES, PASCO_DISTRICTS } from '../data/pascoData';
import type { DistrictData, ProvinceItem } from '../data/pascoData';

interface HeaderProps {
  selectedProvince: ProvinceItem;
  setSelectedProvince: (prov: ProvinceItem) => void;
  selectedDistrict: DistrictData;
  setSelectedDistrict: (dist: DistrictData) => void;
  totalSimulatedVotes: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedProvince,
  setSelectedProvince,
  selectedDistrict,
  setSelectedDistrict,
  totalSimulatedVotes
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDistricts = PASCO_DISTRICTS.filter(d =>
    d.distrito.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.provincia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectSearchedDistrict = (dist: DistrictData) => {
    const prov = PASCO_PROVINCES.find(p => p.id === dist.provincia);
    if (prov) {
      setSelectedProvince(prov);
    }
    setSelectedDistrict(dist);
    setSearchOpen(false);
    setSearchTerm('');
  };
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prov = PASCO_PROVINCES.find(p => p.id === e.target.value);
    if (prov) {
      setSelectedProvince(prov);
      setSelectedDistrict(prov.districts[0]);
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dist = selectedProvince.districts.find(d => d.ubigeo_jne === e.target.value);
    if (dist) {
      setSelectedDistrict(dist);
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-700 px-3 py-1 text-[11px] sm:text-xs text-center font-bold flex items-center justify-center gap-1.5 text-white shadow-inner">
        <span className="truncate">Simulador Oficial de Votación — Partido Democrático Somos Perú (Región Pasco)</span>
        <span className="hidden md:inline bg-red-900/80 px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 border border-red-400/30">
          {totalSimulatedVotes.toLocaleString()} votos
        </span>
      </div>

      <div className="max-w-[1750px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-2.5 sm:py-3.5 gap-2.5">
          
          {/* Logo and Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-red-900/40 shrink-0 border-2 border-red-500 p-1">
              <img
                src={`${import.meta.env.BASE_URL}data/logos/14.png`}
                alt="SOMOS PERU"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://votabien.pe/data/logos/14.png';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-white leading-none">SOMOS PERU</span>
                <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] sm:text-[11px] px-2 py-0.5 rounded font-black uppercase">
                  Pasco
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 leading-tight">Simulador de Cédula Oficial con Voto Marcado</p>
            </div>
          </div>

          {/* Location Selector (Province & District of Pasco) */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5 bg-slate-800/90 p-1.5 sm:p-2 rounded-2xl border border-slate-700/60 w-full sm:w-auto">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 px-2 font-bold">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>Distrito:</span>
            </div>

            <select
              aria-label="Provincia de Pasco"
              value={selectedProvince.id}
              onChange={handleProvinceChange}
              className="bg-slate-900 text-xs sm:text-sm text-white border border-slate-700 rounded-xl px-2.5 py-2 focus:outline-none focus:border-red-500 font-bold w-full sm:w-auto cursor-pointer"
            >
              {PASCO_PROVINCES.map((p) => (
                <option key={p.id} value={p.id}>
                  Prov. {p.name}
                </option>
              ))}
            </select>

            <select
              aria-label="Distrito de Pasco"
              value={selectedDistrict.ubigeo_jne}
              onChange={handleDistrictChange}
              className="bg-slate-900 text-xs sm:text-sm text-white border border-slate-700 rounded-xl px-2.5 py-2 focus:outline-none focus:border-red-500 font-bold w-full sm:w-auto max-w-[220px] truncate cursor-pointer"
            >
              {selectedProvince.districts.map((d) => (
                <option key={d.ubigeo_jne} value={d.ubigeo_jne}>
                  Dist. {d.distrito}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-all border border-slate-600 cursor-pointer shrink-0"
              title="Buscar distrito rápidamente"
            >
              <Search className="w-4 h-4 text-red-400" />
            </button>
          </div>

        </div>
      </div>

      {/* QUICK SEARCH DISTRICT MODAL */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-16 px-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
                <Search className="w-5 h-5 text-red-500" />
                <span>Buscar Distrito de Pasco</span>
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4">
              <input
                type="text"
                autoFocus
                placeholder="Escribe el nombre del distrito (ej. Paucartambo, Oxapampa)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500 font-medium placeholder:text-slate-500"
              />
            </div>

            <div className="mt-3 max-h-64 overflow-y-auto space-y-1.5 pr-1">
              {filteredDistricts.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No se encontraron distritos con "{searchTerm}"
                </div>
              ) : (
                filteredDistricts.map((d) => (
                  <button
                    key={d.ubigeo_jne}
                    onClick={() => handleSelectSearchedDistrict(d)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between text-xs sm:text-sm cursor-pointer ${
                      selectedDistrict.ubigeo_jne === d.ubigeo_jne
                        ? 'bg-red-600 text-white font-bold'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div>
                      <span className="font-bold">{d.distrito}</span>
                      <span className="text-[11px] text-slate-400 block">Provincia de {d.provincia}</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-60">UBIGEO {d.ubigeo_jne}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
