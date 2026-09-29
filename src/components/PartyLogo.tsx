import React from 'react';

interface PartyLogoProps {
  type: string;
  size?: number;
  className?: string;
}

export const PartyLogo: React.FC<PartyLogoProps> = ({ type, size = 48, className = '' }) => {
  const s = size;

  switch (type) {
    case 'pasco_dignidad':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="12" fill="#047857" />
          <path d="M50 15 L78 30 L78 68 L50 85 L22 68 L22 30 Z" fill="#ffffff" />
          <path d="M50 22 L72 34 L72 64 L50 78 L28 64 L28 34 Z" fill="#059669" />
          {/* Emblem representing Pasco mountain & sun */}
          <circle cx="50" cy="40" r="12" fill="#fbbf24" />
          <path d="M30 65 L44 46 L54 58 L62 48 L70 65 Z" fill="#ffffff" />
          <path d="M32 65 L44 48 L53 59 L61 50 L68 65 Z" fill="#dc2626" />
          <text x="50" y="93" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">DIGNIDAD</text>
        </svg>
      );

    case 'pasco_verde':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="12" fill="#15803d" />
          <circle cx="50" cy="50" r="38" fill="#ffffff" />
          {/* Leaf emblem */}
          <path d="M50 20 C68 22 80 40 76 65 C62 76 40 78 32 60 C26 44 38 24 50 20 Z" fill="#16a34a" />
          <path d="M50 20 C42 42 44 60 56 75" stroke="#ffffff" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M48 42 C54 38 62 40 68 44" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M52 56 C58 52 64 54 70 58" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
          <text x="50" y="93" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">PASCO VERDE</text>
        </svg>
      );

    case 'somos_peru':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="12" fill="#dc2626" />
          {/* Heart shape */}
          <path
            d="M50 82 C50 82 18 58 18 36 C18 22 28 14 40 14 C46 14 50 18 50 18 C50 18 54 14 60 14 C72 14 82 22 82 36 C82 58 50 82 50 82 Z"
            fill="#ffffff"
          />
          <path
            d="M50 76 C50 76 24 55 24 37 C24 26 32 20 41 20 C46 20 50 23 50 23 C50 23 54 20 59 20 C68 20 76 26 76 37 C76 55 50 76 50 76 Z"
            fill="#b91c1c"
          />
          <text x="50" y="47" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="sans-serif">SOMOS</text>
          <text x="50" y="60" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900" fontFamily="sans-serif">PERÚ</text>
        </svg>
      );

    case 'app':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="12" fill="#1d4ed8" />
          <circle cx="50" cy="50" r="38" fill="#ffffff" />
          {/* Big Bold A */}
          <text x="50" y="65" textAnchor="middle" fill="#dc2626" fontSize="56" fontWeight="900" fontFamily="Arial Black, Impact, sans-serif">A</text>
          <text x="50" y="93" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">APP</text>
        </svg>
      );

    case 'podemos':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="12" fill="#ea580c" />
          <circle cx="50" cy="50" r="38" fill="#ffffff" />
          {/* Big Bold P */}
          <text x="50" y="68" textAnchor="middle" fill="#1e3a8a" fontSize="58" fontWeight="900" fontFamily="Arial Black, Impact, sans-serif">P</text>
          <text x="50" y="93" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">PODEMOS</text>
        </svg>
      );

    case 'avanza_pais':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="12" fill="#0284c7" />
          <circle cx="50" cy="50" r="38" fill="#ffffff" />
          {/* Train locomotive */}
          <rect x="28" y="32" width="38" height="34" rx="4" fill="#0284c7" />
          <rect x="66" y="44" width="10" height="22" rx="2" fill="#0284c7" />
          <rect x="33" y="36" width="14" height="12" rx="2" fill="#ffffff" />
          <rect x="51" y="36" width="11" height="12" rx="2" fill="#ffffff" />
          <circle cx="38" cy="68" r="6" fill="#1e293b" />
          <circle cx="54" cy="68" r="6" fill="#1e293b" />
          <circle cx="70" cy="68" r="6" fill="#1e293b" />
          <rect x="32" y="24" width="6" height="8" fill="#0284c7" />
          <polygon points="76,66 84,66 80,58" fill="#e11d48" />
          <text x="50" y="93" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">AVANZA PAÍS</text>
        </svg>
      );

    case 'renovacion':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="12" fill="#06b6d4" />
          <circle cx="50" cy="50" r="38" fill="#ffffff" />
          <text x="50" y="67" textAnchor="middle" fill="#0891b2" fontSize="56" fontWeight="900" fontFamily="Arial Black, Impact, sans-serif">R</text>
          <text x="50" y="93" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">RENOVACIÓN</text>
        </svg>
      );

    case 'jp':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="12" fill="#e11d48" />
          <circle cx="50" cy="48" r="30" fill="#fbbf24" />
          <text x="50" y="58" textAnchor="middle" fill="#be123c" fontSize="32" fontWeight="900" fontFamily="Arial Black, Impact, sans-serif">JP</text>
          <text x="50" y="93" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">JUNTOS POR EL PERÚ</text>
        </svg>
      );

    case 'accion_popular':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="12" fill="#b91c1c" />
          <circle cx="50" cy="50" r="38" fill="#ffffff" />
          {/* Lampa / Shovel */}
          <path d="M42 30 L58 30 L55 52 L45 52 Z" fill="#b91c1c" />
          <rect x="48" y="52" width="4" height="24" fill="#b91c1c" />
          <polygon points="44,76 56,76 50,82" fill="#b91c1c" />
          <text x="50" y="93" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">ACCIÓN POPULAR</text>
        </svg>
      );

    case 'fuerza_popular':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="12" fill="#f97316" />
          <circle cx="50" cy="50" r="38" fill="#ffffff" />
          <text x="50" y="68" textAnchor="middle" fill="#ea580c" fontSize="58" fontWeight="900" fontFamily="Arial Black, Impact, sans-serif">K</text>
          <text x="50" y="93" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">FUERZA POPULAR</text>
        </svg>
      );

    default:
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" className={className}>
          <rect width="100" height="100" rx="12" fill="#64748b" />
          <circle cx="50" cy="50" r="32" fill="#ffffff" />
          <text x="50" y="60" textAnchor="middle" fill="#334155" fontSize="28" fontWeight="bold">🗳️</text>
        </svg>
      );
  }
};
