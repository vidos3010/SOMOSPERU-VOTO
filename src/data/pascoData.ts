export interface DistrictData {
  dep: string;
  departamento: string;
  pro: string;
  provincia: string;
  dis: string;
  distrito: string;
  ubigeo_jne: string;
}

export interface OfficialOrganizacion {
  id: number;
  nombre: string;
  logo: string;
  bloque: string;
  orden: number;
  vacante: boolean;
}

export interface OfficialSeccion {
  seccion: 'GOBERNADOR' | 'CONSEJEROS' | 'PROVINCIAL' | 'DISTRITAL' | string;
  tipoEleccion: number;
  organizaciones: OfficialOrganizacion[];
}

export interface OfficialCedulaData {
  ubigeo: string;
  departamento: string;
  provincia: string;
  distrito: string;
  columnas: number;
  secciones: OfficialSeccion[];
}

export interface ProvinceItem {
  id: string;
  name: string;
  districts: DistrictData[];
}

// Full 29 official Pasco districts extracted directly from votabien.pe
export const PASCO_DISTRICTS: DistrictData[] = [
  // PROVINCIA: PASCO
  { dep: "18", departamento: "PASCO", pro: "01", provincia: "PASCO", dis: "01", distrito: "CHAUPIMARCA", ubigeo_jne: "180101" },
  { dep: "18", departamento: "PASCO", pro: "01", provincia: "PASCO", dis: "14", distrito: "YANACANCHA", ubigeo_jne: "180114" },
  { dep: "18", departamento: "PASCO", pro: "01", provincia: "PASCO", dis: "10", distrito: "SIMÓN BOLÍVAR", ubigeo_jne: "180110" },
  { dep: "18", departamento: "PASCO", pro: "01", provincia: "PASCO", dis: "12", distrito: "TINYAHUARCO", ubigeo_jne: "180112" },
  { dep: "18", departamento: "PASCO", pro: "01", provincia: "PASCO", dis: "04", distrito: "HUARIACA", ubigeo_jne: "180104" },
  { dep: "18", departamento: "PASCO", pro: "01", provincia: "PASCO", dis: "05", distrito: "HUAYLLAY", ubigeo_jne: "180105" },
  { dep: "18", departamento: "PASCO", pro: "01", provincia: "PASCO", dis: "08", distrito: "PAUCARTAMBO", ubigeo_jne: "180108" },
  { dep: "18", departamento: "PASCO", pro: "01", provincia: "PASCO", dis: "03", distrito: "HUACHON", ubigeo_jne: "180103" },
  { dep: "18", departamento: "PASCO", pro: "01", provincia: "PASCO", dis: "06", distrito: "NINACACA", ubigeo_jne: "180106" },
  { dep: "18", departamento: "PASCO", pro: "01", provincia: "PASCO", dis: "07", distrito: "PALLANCHACRA", ubigeo_jne: "180107" },
  { dep: "18", departamento: "PASCO", pro: "01", provincia: "PASCO", dis: "09", distrito: "SAN FRANCISCO DE ASÍS DE YARUSYACAN", ubigeo_jne: "180109" },
  { dep: "18", departamento: "PASCO", pro: "01", provincia: "PASCO", dis: "11", distrito: "TICLACAYAN", ubigeo_jne: "180111" },
  { dep: "18", departamento: "PASCO", pro: "01", provincia: "PASCO", dis: "13", distrito: "VICCO", ubigeo_jne: "180113" },

  // PROVINCIA: DANIEL ALCIDES CARRIÓN
  { dep: "18", departamento: "PASCO", pro: "02", provincia: "DANIEL ALCIDES CARRIÓN", dis: "01", distrito: "YANAHUANCA", ubigeo_jne: "180201" },
  { dep: "18", departamento: "PASCO", pro: "02", provincia: "DANIEL ALCIDES CARRIÓN", dis: "02", distrito: "CHACAYAN", ubigeo_jne: "180202" },
  { dep: "18", departamento: "PASCO", pro: "02", provincia: "DANIEL ALCIDES CARRIÓN", dis: "03", distrito: "GOYLLARISQUIZGA", ubigeo_jne: "180203" },
  { dep: "18", departamento: "PASCO", pro: "02", provincia: "DANIEL ALCIDES CARRIÓN", dis: "04", distrito: "PAUCAR", ubigeo_jne: "180204" },
  { dep: "18", departamento: "PASCO", pro: "02", provincia: "DANIEL ALCIDES CARRIÓN", dis: "05", distrito: "SAN PEDRO DE PILLAO", ubigeo_jne: "180205" },
  { dep: "18", departamento: "PASCO", pro: "02", provincia: "DANIEL ALCIDES CARRIÓN", dis: "06", distrito: "SANTA ANA DE TUSI", ubigeo_jne: "180206" },
  { dep: "18", departamento: "PASCO", pro: "02", provincia: "DANIEL ALCIDES CARRIÓN", dis: "07", distrito: "TAPUC", ubigeo_jne: "180207" },
  { dep: "18", departamento: "PASCO", pro: "02", provincia: "DANIEL ALCIDES CARRIÓN", dis: "08", distrito: "VILCABAMBA", ubigeo_jne: "180208" },

  // PROVINCIA: OXAPAMPA
  { dep: "18", departamento: "PASCO", pro: "03", provincia: "OXAPAMPA", dis: "01", distrito: "OXAPAMPA", ubigeo_jne: "180301" },
  { dep: "18", departamento: "PASCO", pro: "03", provincia: "OXAPAMPA", dis: "02", distrito: "CHONTABAMBA", ubigeo_jne: "180302" },
  { dep: "18", departamento: "PASCO", pro: "03", provincia: "OXAPAMPA", dis: "03", distrito: "HUANCABAMBA", ubigeo_jne: "180303" },
  { dep: "18", departamento: "PASCO", pro: "03", provincia: "OXAPAMPA", dis: "04", distrito: "PUERTO BERMÚDEZ", ubigeo_jne: "180304" },
  { dep: "18", departamento: "PASCO", pro: "03", provincia: "OXAPAMPA", dis: "05", distrito: "VILLA RICA", ubigeo_jne: "180305" },
  { dep: "18", departamento: "PASCO", pro: "03", provincia: "OXAPAMPA", dis: "06", distrito: "POZUZO", ubigeo_jne: "180306" },
  { dep: "18", departamento: "PASCO", pro: "03", provincia: "OXAPAMPA", dis: "07", distrito: "PALCAZU", ubigeo_jne: "180307" },
  { dep: "18", departamento: "PASCO", pro: "03", provincia: "OXAPAMPA", dis: "08", distrito: "CONSTITUCIÓN", ubigeo_jne: "180308" },
];

export const PASCO_PROVINCES: ProvinceItem[] = [
  {
    id: "PASCO",
    name: "PASCO",
    districts: PASCO_DISTRICTS.filter(d => d.provincia === "PASCO")
  },
  {
    id: "DANIEL ALCIDES CARRIÓN",
    name: "DANIEL ALCIDES CARRIÓN",
    districts: PASCO_DISTRICTS.filter(d => d.provincia === "DANIEL ALCIDES CARRIÓN")
  },
  {
    id: "OXAPAMPA",
    name: "OXAPAMPA",
    districts: PASCO_DISTRICTS.filter(d => d.provincia === "OXAPAMPA")
  }
];

export interface VoteSimulationRecord {
  id: string;
  timestamp: number;
  ubigeo: string;
  provincia: string;
  distrito: string;
  selections: {
    seccionIndex: number;
    seccionNombre: string;
    partyId: number | null;
    partyName: string | null;
    status: 'valido' | 'blanco' | 'nulo';
  }[];
}
