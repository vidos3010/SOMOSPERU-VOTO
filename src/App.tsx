import { useState, useEffect } from 'react';
import { PASCO_PROVINCES } from './data/pascoData';
import type { ProvinceItem, DistrictData, VoteSimulationRecord } from './data/pascoData';
import { Header } from './components/Header';
import { OfficialCedula } from './components/OfficialCedula';
import { LoadingScreen } from './components/LoadingScreen';
import { Shield, Vote } from 'lucide-react';

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceItem>(PASCO_PROVINCES[0]);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData>(PASCO_PROVINCES[0].districts[0]);
  
  // Persisted simulation votes
  const [votes, setVotes] = useState<VoteSimulationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('pasco_official_votes_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Save votes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pasco_official_votes_v2', JSON.stringify(votes));
    } catch {
      // ignore
    }
  }, [votes]);

  const handleVoteSubmitted = (newVote: VoteSimulationRecord) => {
    setVotes(prev => [newVote, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Interactive Loading Screen Overlay */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      
      {/* Clean Location & Brand Header */}
      <Header
        selectedProvince={selectedProvince}
        setSelectedProvince={setSelectedProvince}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        totalSimulatedVotes={votes.length}
      />

      {/* Main Ballot Simulator Interface */}
      <main className="flex-1">
        <OfficialCedula
          district={selectedDistrict}
          onVoteSubmitted={handleVoteSubmitted}
        />
      </main>

      {/* Simplified Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 mt-8">
        <div className="max-w-[1750px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0">
              <Vote className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-200 font-bold">VotaBien Pasco — Simulador de Cédula de Sufragio</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Cédulas y logos oficiales extraídos de votabien.pe</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
