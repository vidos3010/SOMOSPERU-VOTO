import React, { useState, useEffect, useRef } from 'react';
import type { DistrictData, OfficialCedulaData, OfficialSeccion, VoteSimulationRecord } from '../data/pascoData';
import { playPenSound, playSuccessSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { Edit3, Trash2, ArrowRight, AlertCircle, Loader2, Scissors, CheckCircle2, Download } from 'lucide-react';

interface OfficialCedulaProps {
  district: DistrictData;
  onVoteSubmitted: (vote: VoteSimulationRecord) => void;
}

export const OfficialCedula: React.FC<OfficialCedulaProps> = ({
  district,
  onVoteSubmitted
}) => {
  const [cedulaData, setCedulaData] = useState<OfficialCedulaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selections map: seccionIndex -> partyId | null
  const [selections, setSelections] = useState<Record<number, number | null>>({});

  // Pen settings
  const [markType, setMarkType] = useState<'cross' | 'plus'>('cross'); // cross = X, plus = +
  const [penColor, setPenColor] = useState<'blue' | 'black'>('blue');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [lastVoteRecord, setLastVoteRecord] = useState<VoteSimulationRecord | null>(null);

  const cedulaRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Helper function to format official section title
  const formatSectionTitle = (title: string, index: number) => {
    const t = title.toUpperCase();
    if (t.includes('GOBERNADOR')) return { badge: 'NIVEL REGIONAL', name: 'GOBERNADOR Y VICEGOBERNADOR' };
    if (t.includes('CONSEJERO')) return { badge: 'NIVEL REGIONAL', name: 'CONSEJEROS REGIONALES' };
    if (t.includes('PROVINCIAL')) return { badge: 'MUNICIPALIDAD PROVINCIAL', name: 'ALCALDE Y REGIDORES' };
    if (t.includes('DISTRITAL')) return { badge: 'MUNICIPALIDAD DISTRITAL', name: 'ALCALDE Y REGIDORES' };
    return { badge: `CUERPO ${index + 1}`, name: title };
  };

  // Helper function to find Somos Perú in a section
  const findSomosPeruId = (sec: OfficialSeccion): number | null => {
    const somosPeruOrg = sec.organizaciones.find(o => 
      o.id === 14 || 
      o.logo === '14.png' || 
      o.nombre.toUpperCase().includes('SOMOS PERU') ||
      o.nombre.toUpperCase().includes('SOMOS PERÚ')
    );
    return somosPeruOrg ? somosPeruOrg.id : null;
  };

  // Fetch official cédula JSON for current district and PRE-MARK SOMOS PERÚ
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setHasVoted(false);

    fetch(`/data/cedulas/${district.ubigeo_jne}.json`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((data: OfficialCedulaData) => {
        if (isMounted) {
          setCedulaData(data);
          
          // PRE-MARK SOMOS PERÚ IN ALL SECTIONS BY DEFAULT
          const defaultMarks: Record<number, number | null> = {};
          (data.secciones || []).forEach((sec, idx) => {
            const spId = findSomosPeruId(sec);
            if (spId !== null) {
              defaultMarks[idx] = spId;
            }
          });
          setSelections(defaultMarks);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(`No se pudo cargar la cédula oficial: ${err.message}`);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [district.ubigeo_jne]);

  const handleToggleMark = (secIndex: number, partyId: number) => {
    playPenSound();
    setSelections(prev => {
      const current = prev[secIndex];
      return {
        ...prev,
        [secIndex]: current === partyId ? null : partyId
      };
    });
  };

  const handleResetBallot = () => {
    setSelections({});
    setHasVoted(false);
  };

  const handleSelectAllSomosPeru = () => {
    playPenSound();
    if (!cedulaData) return;
    const defaultMarks: Record<number, number | null> = {};
    (cedulaData.secciones || []).forEach((sec, idx) => {
      const spId = findSomosPeruId(sec);
      if (spId !== null) {
        defaultMarks[idx] = spId;
      }
    });
    setSelections(defaultMarks);
  };

  const handleDownloadCedula = async () => {
    if (!cedulaRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(cedulaRef.current, {
        cacheBust: true,
        quality: 0.95,
        backgroundColor: '#fcfbf7'
      });
      const link = document.createElement('a');
      link.download = `Cedula-SomosPeru-${district.distrito.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error al exportar cédula:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSubmitVote = () => {
    if (!cedulaData) return;
    playSuccessSound();
    setIsSubmitting(true);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    const voteSelections = (cedulaData.secciones || []).map((sec, idx) => {
      const selectedId = selections[idx] || null;
      const org = sec.organizaciones.find(o => o.id === selectedId);
      return {
        seccionIndex: idx,
        seccionNombre: sec.seccion,
        partyId: selectedId,
        partyName: org ? org.nombre : null,
        status: (selectedId ? 'valido' : 'blanco') as 'valido' | 'blanco' | 'nulo'
      };
    });

    const voteRecord: VoteSimulationRecord = {
      id: `vote-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      ubigeo: district.ubigeo_jne,
      provincia: district.provincia,
      distrito: district.distrito,
      selections: voteSelections
    };

    setTimeout(() => {
      onVoteSubmitted(voteRecord);
      setLastVoteRecord(voteRecord);
      setIsSubmitting(false);
      setHasVoted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const penStrokeColor = penColor === 'blue' ? '#1d4ed8' : '#0f172a';

  // Render SVG pen mark
  const renderPenMark = () => {
    if (markType === 'cross') {
      return (
        <svg className="absolute inset-0 w-full h-full p-2 pointer-events-none z-20" viewBox="0 0 50 50">
          <line x1="7" y1="8" x2="43" y2="42" stroke={penStrokeColor} strokeWidth="7.5" strokeLinecap="round" />
          <line x1="43" y1="7" x2="7" y2="43" stroke={penStrokeColor} strokeWidth="7.5" strokeLinecap="round" />
        </svg>
      );
    } else {
      return (
        <svg className="absolute inset-0 w-full h-full p-2 pointer-events-none z-20" viewBox="0 0 50 50">
          <line x1="25" y1="5" x2="25" y2="45" stroke={penStrokeColor} strokeWidth="7.5" strokeLinecap="round" />
          <line x1="5" y1="25" x2="45" y2="25" stroke={penStrokeColor} strokeWidth="7.5" strokeLinecap="round" />
        </svg>
      );
    }
  };

  if (loading) {
    return (
      <div className="w-full py-20 px-4 text-center">
        <div className="inline-flex items-center gap-3 bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          <span className="text-base font-bold text-slate-800">Cargando Cédula Oficial para {district.distrito}...</span>
        </div>
      </div>
    );
  }

  if (error || !cedulaData) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-red-800">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
          <h3 className="font-bold text-base mb-1">Error al cargar datos oficiales</h3>
          <p className="text-xs">{error || 'No hay datos disponibles para este distrito.'}</p>
        </div>
      </div>
    );
  }

  const secciones = cedulaData.secciones || [];
  
  // Calculate max rows across all sections so every section has the EXACT same height and row alignment!
  const maxRows = Math.max(...secciones.map(s => s.organizaciones?.length || 0), 1);

  return (
    <div className="w-full max-w-[1750px] mx-auto py-3 sm:py-6 px-1.5 sm:px-4 lg:px-6 pb-28 sm:pb-16">
      
      {/* Interactive Controls Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200 mb-3 sm:mb-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-500 mr-1">
            Herramienta:
          </span>
          
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setMarkType('cross')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all touch-manipulation ${
                markType === 'cross' ? 'bg-white text-red-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="text-base font-black leading-none">✕</span>
              <span>Aspa (X)</span>
            </button>
            <button
              onClick={() => setMarkType('plus')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all touch-manipulation ${
                markType === 'plus' ? 'bg-white text-red-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="text-base font-black leading-none">＋</span>
              <span>Cruz (+)</span>
            </button>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setPenColor('blue')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all touch-manipulation ${
                penColor === 'blue' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-300"></span>
              <span>Tinta Azul</span>
            </button>
            <button
              onClick={() => setPenColor('black')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all touch-manipulation ${
                penColor === 'black' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              <span>Tinta Negra</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5">
          <button
            onClick={handleSelectAllSomosPeru}
            className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-xl transition-all shadow-md border border-red-700 touch-manipulation cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Marcar Somos Perú</span>
          </button>

          <button
            onClick={handleDownloadCedula}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-red-700 bg-white hover:bg-red-50 rounded-xl transition-all border border-slate-300 shadow-sm touch-manipulation cursor-pointer"
            title="Descargar imagen de la cédula marcada"
          >
            <Download className="w-4 h-4 text-red-600" />
            <span>{isExporting ? 'Generando...' : 'Descargar Cédula'}</span>
          </button>

          <button
            onClick={handleResetBallot}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-xl transition-all border border-slate-200 touch-manipulation cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpiar Cédula</span>
          </button>
        </div>
      </div>

      {/* SUCCESS MODAL AFTER VOTING */}
      {hasVoted && lastVoteRecord && (
        <div className="bg-red-50 border-2 border-red-500 rounded-3xl p-5 sm:p-8 mb-6 text-center shadow-lg animate-in fade-in zoom-in duration-300">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-red-950 mb-1">¡Voto Registrado con Éxito en el Ánfora!</h2>
          <p className="text-xs sm:text-sm text-red-900 max-w-xl mx-auto mb-4">
            Simulacro registrado para el distrito de <strong>{district.distrito}</strong> (Provincia de <strong>{district.provincia}</strong>, Región Pasco).
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto mb-5">
            {lastVoteRecord.selections.map((sel, sIdx) => (
              <div key={sIdx} className="bg-white p-3 rounded-xl border border-red-200 shadow-sm text-left min-w-[170px]">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">{sel.seccionNombre}</span>
                <span className="text-xs sm:text-sm font-black text-slate-900 line-clamp-1">
                  {sel.partyName || 'Voto en Blanco'}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleDownloadCedula}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 touch-manipulation cursor-pointer"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Descargar Imagen de mi Voto</span>
            </button>
            <button
              onClick={handleResetBallot}
              className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 touch-manipulation cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Practicar Otro Voto</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= EL GRAN CUADRO DE CÉDULA ================= */}
      <div 
        ref={cedulaRef}
        className="w-full bg-[#fcfbf7] border-2 sm:border-4 border-slate-900 rounded-3xl p-3 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden"
      >
        
        {/* Subtle security pattern background */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        />

        {/* CÉDULA OFFICIAL HEADER */}
        <div className="relative border-b-2 sm:border-b-4 border-slate-900 pb-3 sm:pb-5 mb-4 sm:mb-6 text-center">
          
          {/* Top Campaign Banner with SOMOS PERU Logo and Title */}
          <div className="flex items-center justify-between bg-gradient-to-r from-red-700 via-rose-600 to-red-700 text-white rounded-2xl p-2.5 sm:p-3 mb-3.5 shadow-md border border-red-800">
            <div className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2">
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-white rounded-xl p-1 shrink-0 flex items-center justify-center shadow-inner border border-red-300">
                <img
                  src="/data/logos/14.png"
                  alt="SOMOS PERU"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://votabien.pe/data/logos/14.png';
                  }}
                />
              </div>
              <div className="text-left">
                <span className="font-black text-sm sm:text-lg tracking-tight leading-none block">
                  PARTIDO DEMOCRÁTICO SOMOS PERÚ
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-rose-100 block">
                  Campaña Oficial Región Pasco
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 pr-2">
              <span className="bg-white/20 text-white text-[11px] font-black uppercase px-3 py-1 rounded-lg tracking-wider border border-white/30">
                PASCO 2026
              </span>
            </div>
          </div>

          {/* Main Title Banner */}
          <div className="text-center mb-3">
            <span className="inline-block bg-slate-900 text-amber-300 text-[11px] sm:text-xs font-black px-3.5 py-1 rounded-md tracking-wider uppercase mb-1 shadow-sm border border-slate-800">
              ELECCIONES REGIONALES Y MUNICIPALES
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-none mt-1">
              CÉDULA DE SUFRAGIO
            </h1>
          </div>

          {/* Location details */}
          <div className="bg-slate-100 border border-slate-300 rounded-xl sm:rounded-2xl py-2 px-3 sm:px-6 flex flex-wrap items-center justify-center gap-2 sm:gap-8 text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wide shadow-inner">
            <div><span className="text-slate-500 font-semibold">DEPARTAMENTO:</span> {cedulaData.departamento}</div>
            <div className="hidden sm:inline text-slate-300">|</div>
            <div><span className="text-slate-500 font-semibold">PROVINCIA:</span> {cedulaData.provincia}</div>
            <div className="hidden sm:inline text-slate-300">|</div>
            <div><span className="text-slate-500 font-semibold">DISTRITO:</span> {cedulaData.distrito}</div>
          </div>

          {/* Instructions Box */}
          <div className="mt-2.5 bg-amber-50 border border-amber-300 rounded-xl p-2 sm:p-2.5 text-xs sm:text-sm text-amber-950 font-semibold leading-tight max-w-3xl mx-auto">
            <span className="font-black text-amber-900">INSTRUCCIÓN AL ELECTOR:</span> Marque con una cruz (<strong>+</strong>) o un aspa (<strong>✕</strong>) dentro del recuadro del símbolo de su preferencia.
          </div>
        </div>

        {/* ================= SECCIONES CON RESALTE SUPREMO A SOMOS PERÚ ================= */}
        <div className="w-full overflow-x-auto sm:overflow-x-visible pb-2 pt-1">
          <div className="flex flex-row items-stretch justify-between gap-2.5 sm:gap-3.5 lg:gap-5 w-full min-w-[760px] sm:min-w-full">
            {secciones.map((sec: OfficialSeccion, secIdx: number) => {
              const selectedPartyId = selections[secIdx] || null;
              const orgs = sec.organizaciones || [];
              const formattedHeader = formatSectionTitle(sec.seccion, secIdx);

              return (
                <React.Fragment key={secIdx}>
                  {/* SECCIÓN */}
                  <div className="flex-1 min-w-0 bg-white border-2 sm:border-3 border-slate-900 rounded-2xl overflow-hidden shadow-lg flex flex-col transition-all">
                    
                    {/* CABECERA DESTACADA */}
                    <div className="h-[78px] sm:h-[86px] lg:h-[90px] bg-slate-900 text-white p-2 sm:p-3 text-center flex flex-col items-center justify-center border-b-2 sm:border-b-3 border-slate-900 shrink-0">
                      <span className="inline-block bg-amber-400 text-slate-950 text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider leading-none mb-1">
                        {formattedHeader.badge}
                      </span>
                      <h2 className="font-black uppercase tracking-tight leading-tight line-clamp-2 px-1 text-white text-xs sm:text-[14px] lg:text-[15px]">
                        {formattedHeader.name}
                      </h2>
                    </div>

                    {/* FILAS DE PARTIDOS: SOMOS PERÚ RESALTADO / OTROS EN REGULAR Y MENOS TAMAÑO */}
                    <div className="flex-1 flex flex-col divide-y-2 divide-slate-100">
                      {Array.from({ length: maxRows }).map((_, rowIdx) => {
                        const org = orgs[rowIdx];

                        if (!org || org.vacante) {
                          return (
                            <div
                              key={`empty-${rowIdx}`}
                              className="h-[74px] sm:h-[82px] lg:h-[88px] p-2 sm:p-3 flex items-center justify-between bg-slate-50/50"
                            >
                              <div className="text-[10px] text-slate-300 italic truncate pl-2 font-normal">Espacio en reserva</div>
                              <div className="w-13 h-13 sm:w-16 sm:h-16 lg:w-17 lg:h-17 rounded-xl sm:rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 shrink-0 mr-1" />
                            </div>
                          );
                        }

                        const isSelected = selectedPartyId === org.id;
                        const isSomosPeru = org.id === 14 || org.logo === '14.png' || org.nombre.toUpperCase().includes('SOMOS PERU');

                        return (
                          <div
                            key={org.id}
                            className={`h-[74px] sm:h-[82px] lg:h-[88px] p-2 sm:p-3 flex items-center justify-between gap-2 sm:gap-3 transition-all ${
                              isSomosPeru
                                ? 'bg-gradient-to-r from-rose-50/95 via-red-50 to-rose-50/95 border-y-2 border-red-300 shadow-sm'
                                : (isSelected ? 'bg-slate-100' : 'hover:bg-slate-50/60')
                            }`}
                          >
                            {/* Party Name Styling: Somos Peru is Bold & Big, Others are Normal & -1pt Size */}
                            <div className="flex-1 min-w-0 pr-1 pl-1.5">
                              {isSomosPeru ? (
                                <div className="font-black text-red-700 text-xs sm:text-[14px] lg:text-[15.5px] leading-snug line-clamp-2 tracking-tight">
                                  {org.nombre}
                                </div>
                              ) : (
                                <div className="font-normal text-slate-600 text-[10px] sm:text-[11.5px] lg:text-[12.5px] leading-snug line-clamp-2">
                                  {org.nombre}
                                </div>
                              )}
                            </div>

                            {/* Party Logo Box: Somos Peru has prominent 3D red frame */}
                            <button
                              type="button"
                              onClick={() => handleToggleMark(secIdx, org.id)}
                              title={`Marcar ${org.nombre}`}
                              className={`relative rounded-xl sm:rounded-2xl transition-all active:scale-95 flex items-center justify-center p-1.5 shrink-0 touch-manipulation cursor-pointer ${
                                isSomosPeru
                                  ? 'w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 border-3 border-red-600 bg-white shadow-lg ring-4 ring-red-400/50 scale-105'
                                  : 'w-12 h-12 sm:w-14 sm:h-14 lg:w-15 lg:h-15 border border-slate-300 bg-slate-50/50 hover:border-slate-500 opacity-85'
                              }`}
                            >
                              <img
                                src={`/data/logos/${org.logo}`}
                                alt={org.nombre}
                                className={`max-h-full max-w-full object-contain pointer-events-none ${
                                  isSomosPeru ? 'scale-105' : 'grayscale-[20%]'
                                }`}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://votabien.pe/data/logos/${org.logo}`;
                                }}
                              />
                              {isSelected && renderPenMark()}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* PIE DE CUERPO */}
                    <div className="h-[48px] sm:h-[54px] p-2 bg-slate-100 border-t-2 sm:border-t-3 border-slate-900 text-center flex items-center justify-center shrink-0">
                      {selectedPartyId ? (
                        <div className="text-[10px] sm:text-xs font-black text-red-700 truncate px-2 flex items-center justify-center gap-1">
                          <span>Marcado:</span>
                          <span className="truncate">{orgs.find(o => o.id === selectedPartyId)?.nombre}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] sm:text-xs font-semibold text-slate-500 italic">Voto en blanco</span>
                      )}
                    </div>
                  </div>

                  {/* LÍNEA DE CORTE DISCONTINUA */}
                  {secIdx < secciones.length - 1 && (
                    <div className="hidden lg:flex flex-col items-center justify-center opacity-40 select-none px-0.5 shrink-0">
                      <Scissors className="w-4 h-4 text-slate-700 mb-2" />
                      <div className="w-[1px] flex-1 border-r-2 border-dashed border-slate-500" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* BOTTOM ACTION BAR / SUBMISSION */}
        <div className="mt-5 sm:mt-8 pt-5 sm:pt-7 border-t-2 sm:border-t-4 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-slate-700 font-bold flex items-center gap-2 text-center sm:text-left">
            <span>Simulador Oficial Somos Perú — Distrito de {district.distrito} ({district.provincia}).</span>
          </div>

          <button
            type="button"
            onClick={handleSubmitVote}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-sm sm:text-base uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-3 cursor-pointer touch-manipulation"
          >
            {isSubmitting ? (
              <span>Procesando Voto...</span>
            ) : (
              <>
                <span>🗳️ Depositar Voto en el Ánfora</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
