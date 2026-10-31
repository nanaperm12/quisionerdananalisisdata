export interface ThesisInfo {
  title: string;
  subtitle: string;
  researcherName: string;
  programStudy: string;
  institution: string;
  greetingNote: string;
  closingNote: string;
  instructionNote: string;
}

export interface QuestionCategory {
  id: string;
  code: string; // e.g. "X1", "X2", "Z", "Y"
  name: string; // e.g. "Kompensasi Finansial dan Nonfinansial"
  variableType: 'Independen (X1)' | 'Independen (X2)' | 'Mediasi (Z)' | 'Dependen (Y)' | 'Lainnya';
  description?: string;
  order: number;
}

export interface QuestionItem {
  id: string;
  categoryId: string;
  number: number;
  statement: string;
}

export interface RespondentIdentity {
  nama: string; // Boleh dikosongkan (opsional)
  asalMadrasah: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan' | '';
  usia: '< 30 Tahun' | '30 – 40 Tahun' | '41 – 50 Tahun' | '> 50 Tahun' | '';
  pendidikanTerakhir: 'S1' | 'S2' | 'Lainnya' | '';
  pendidikanLainnya?: string;
  statusKepegawaian: 'Guru Tetap Yayasan (GTY)' | 'Guru Tidak Tetap (GTT) / Guru Honorer' | '';
  masaKerja: '< 2 Tahun' | '2 – 5 Tahun' | '6 – 10 Tahun' | '> 10 Tahun' | '';
  sertifikasiPendidik: 'Sudah Bersertifikasi' | 'Belum Bersertifikasi' | '';
}

export interface SurveyResponse {
  id: string;
  submittedAt: string;
  respondent: RespondentIdentity;
  answers: Record<string, number>; // questionId -> score (1 to 5)
}

export const LIKERT_OPTIONS = [
  { value: 1, label: 'STS', fullName: 'Sangat Tidak Setuju', color: 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100', activeColor: 'bg-rose-600 text-white border-rose-600' },
  { value: 2, label: 'TS', fullName: 'Tidak Setuju', color: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100', activeColor: 'bg-orange-500 text-white border-orange-500' },
  { value: 3, label: 'N', fullName: 'Netral / Ragu-ragu', color: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100', activeColor: 'bg-amber-500 text-white border-amber-500' },
  { value: 4, label: 'S', fullName: 'Setuju', color: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100', activeColor: 'bg-emerald-600 text-white border-emerald-600' },
  { value: 5, label: 'SS', fullName: 'Sangat Setuju', color: 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100', activeColor: 'bg-teal-600 text-white border-teal-600' },
] as const;

export const DEFAULT_MADRASAH_LIST = [
  'MTs Swasta Asy-Syifaa Simpen Sumedang',
  'MTs Al-Irfan Tanjungsari',
  'MTs Ma\'arif Cimalaka',
  'MTs Darul Hikmah Tanjungkerta',
  'MTs Muhammadiyah Sumedang',
  'MTs Nurul Huda Ganeas',
  'MTs Al-Hikmah Jatinangor',
  'MTs Persis Sumedang',
  'MTs Al-Ma\'soem Jatinangor',
  'MTs Plus Al-Falah Situraja'
];
