import React, { useState } from 'react';
import { User, School, Award, Clock, ArrowRight, Shield, CheckCircle2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { RespondentIdentity, ThesisInfo, DEFAULT_MADRASAH_LIST } from '../types';

interface RespondentFormProps {
  thesisInfo: ThesisInfo;
  identity: RespondentIdentity;
  setIdentity: React.Dispatch<React.SetStateAction<RespondentIdentity>>;
  onProceed: () => void;
}

export const RespondentForm: React.FC<RespondentFormProps> = ({
  thesisInfo,
  identity,
  setIdentity,
  onProceed,
}) => {
  const [showLetter, setShowLetter] = useState(true);
  const [customMadrasah, setCustomMadrasah] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!identity.asalMadrasah.trim()) {
      errs.asalMadrasah = 'Silakan pilih atau masukkan asal madrasah tempat Bapak/Ibu mengajar.';
    }
    if (!identity.jenisKelamin) {
      errs.jenisKelamin = 'Silakan pilih jenis kelamin.';
    }
    if (!identity.usia) {
      errs.usia = 'Silakan pilih kelompok usia.';
    }
    if (!identity.pendidikanTerakhir) {
      errs.pendidikanTerakhir = 'Silakan pilih pendidikan terakhir.';
    } else if (identity.pendidikanTerakhir === 'Lainnya' && !identity.pendidikanLainnya?.trim()) {
      errs.pendidikanLainnya = 'Sebutkan jenjang pendidikan lainnya.';
    }
    if (!identity.statusKepegawaian) {
      errs.statusKepegawaian = 'Silakan pilih status kepegawaian Anda.';
    }
    if (!identity.masaKerja) {
      errs.masaKerja = 'Silakan pilih masa kerja Anda di madrasah ini.';
    }
    if (!identity.sertifikasiPendidik) {
      errs.sertifikasiPendidik = 'Silakan pilih status sertifikasi pendidik.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onProceed();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Pengantar Resmi & Jaminan Kerahasiaan */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="text-xs uppercase font-extrabold tracking-widest bg-emerald-700/60 text-emerald-200 px-3 py-1 rounded-full border border-emerald-500/30">
              Kuesioner Penelitian Tesis Pascasarjana
            </span>
            <span className="text-xs text-emerald-200">
              Kab. Sumedang
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold leading-snug">
            {thesisInfo.title}
          </h2>
          <p className="text-emerald-100 text-sm mt-1 font-medium">
            {thesisInfo.subtitle}
          </p>

          <div className="mt-4 pt-4 border-t border-emerald-700/50 flex flex-wrap items-center justify-between gap-4 text-xs text-emerald-100">
            <div>
              <span className="text-emerald-300">Peneliti:</span> <strong className="text-white">{thesisInfo.researcherName}</strong>
            </div>
            <div>
              <span className="text-emerald-300">Program Studi:</span> <strong className="text-white">{thesisInfo.programStudy}</strong>
            </div>
            <div>
              <span className="text-emerald-300">Institusi:</span> <strong className="text-white">{thesisInfo.institution}</strong>
            </div>
          </div>
        </div>

        {/* Accordion Surat Pengantar */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setShowLetter(!showLetter)}
            className="w-full flex items-center justify-between text-left font-semibold text-slate-800 hover:text-emerald-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span>Surat Permohonan Pengisian & Jaminan Kerahasiaan Riset</span>
            </div>
            {showLetter ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>

          {showLetter && (
            <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-700 space-y-3 leading-relaxed font-sans bg-white p-4 rounded-xl border border-slate-200/80">
              <div className="whitespace-pre-line font-serif text-[13.5px] text-slate-800">
                {thesisInfo.greetingNote}
              </div>
              <div className="flex items-start gap-2.5 bg-emerald-50 text-emerald-900 p-3 rounded-lg border border-emerald-200/60 text-xs mt-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Jaminan Akademik:</strong> Jawaban Bapak/Ibu semata-mata dianalisis secara agregat untuk keperluan karya ilmiah tesis. Identitas nama bersifat pilihan (boleh dikosongkan/anonim).
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bagian I: Form Identitas Responden */}
      <form onSubmit={handleNext} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-200 mb-6">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
            I
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              BAGIAN I: IDENTITAS RESPONDEN
            </h3>
            <p className="text-xs text-slate-500">
              Petunjuk: Isikan atau pilih jawaban yang paling menggambarkan identitas Bapak/Ibu Guru.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. Nama Responden */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-slate-800">
                1. Nama Responden <span className="text-xs font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 ml-2">(Boleh dikosongkan / Anonim)</span>
              </label>
            </div>
            <input
              type="text"
              value={identity.nama}
              onChange={(e) => setIdentity({ ...identity, nama: e.target.value })}
              placeholder="Contoh: Nana Permana, S.Pd. atau kosongkan jika ingin anonim"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm"
            />
            <p className="text-[11px] text-slate-500 mt-1.5">
              Identitas nama tidak wajib diisi untuk kenyamanan dan kebebasan Bapak/Ibu dalam memberikan penilaian objektif.
            </p>
          </div>

          {/* 2. Asal Madrasah */}
          <div className={`p-4 rounded-xl border transition-colors ${errors.asalMadrasah ? 'bg-rose-50/50 border-rose-300' : 'bg-slate-50/70 border-slate-200'}`}>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              2. Asal Madrasah (MTs Swasta di Kab. Sumedang) <span className="text-rose-500">*</span>
            </label>

            {!customMadrasah ? (
              <div className="space-y-2">
                <select
                  value={identity.asalMadrasah}
                  onChange={(e) => {
                    if (e.target.value === '__OTHER__') {
                      setCustomMadrasah(true);
                      setIdentity({ ...identity, asalMadrasah: '' });
                    } else {
                      setIdentity({ ...identity, asalMadrasah: e.target.value });
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm font-medium"
                >
                  <option value="">-- Pilih Asal Madrasah Tsanawiyah --</option>
                  {DEFAULT_MADRASAH_LIST.map((m, idx) => (
                    <option key={idx} value={m}>{m}</option>
                  ))}
                  <option value="__OTHER__">+ Madrasah Lainnya (Ketik Manual)...</option>
                </select>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setCustomMadrasah(true); setIdentity({ ...identity, asalMadrasah: '' }); }}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline"
                  >
                    Atau ketik nama MTs sendiri
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={identity.asalMadrasah}
                  onChange={(e) => setIdentity({ ...identity, asalMadrasah: e.target.value })}
                  placeholder="Ketikkan nama lengkap MTs Swasta tempat mengajar..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm"
                  autoFocus
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setCustomMadrasah(false); setIdentity({ ...identity, asalMadrasah: '' }); }}
                    className="text-xs text-slate-600 hover:text-slate-900 underline"
                  >
                    Kembali ke daftar pilihan MTs
                  </button>
                </div>
              </div>
            )}

            {errors.asalMadrasah && (
              <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.asalMadrasah}
              </p>
            )}
          </div>

          {/* 3. Jenis Kelamin */}
          <div className={`p-4 rounded-xl border transition-colors ${errors.jenisKelamin ? 'bg-rose-50/50 border-rose-300' : 'bg-slate-50/70 border-slate-200'}`}>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              3. Jenis Kelamin <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['Laki-laki', 'Perempuan'] as const).map((gender) => (
                <label
                  key={gender}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    identity.jenisKelamin === gender
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <input
                    type="radio"
                    name="jenisKelamin"
                    value={gender}
                    checked={identity.jenisKelamin === gender}
                    onChange={() => setIdentity({ ...identity, jenisKelamin: gender })}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{gender}</span>
                </label>
              ))}
            </div>
            {errors.jenisKelamin && (
              <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.jenisKelamin}
              </p>
            )}
          </div>

          {/* 4. Usia */}
          <div className={`p-4 rounded-xl border transition-colors ${errors.usia ? 'bg-rose-50/50 border-rose-300' : 'bg-slate-50/70 border-slate-200'}`}>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              4. Usia <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['< 30 Tahun', '30 – 40 Tahun', '41 – 50 Tahun', '> 50 Tahun'] as const).map((usiaOption) => (
                <label
                  key={usiaOption}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer text-xs sm:text-sm transition-all ${
                    identity.usia === usiaOption
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <input
                    type="radio"
                    name="usia"
                    value={usiaOption}
                    checked={identity.usia === usiaOption}
                    onChange={() => setIdentity({ ...identity, usia: usiaOption })}
                    className="w-3.5 h-3.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{usiaOption}</span>
                </label>
              ))}
            </div>
            {errors.usia && (
              <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.usia}
              </p>
            )}
          </div>

          {/* 5. Pendidikan Terakhir */}
          <div className={`p-4 rounded-xl border transition-colors ${errors.pendidikanTerakhir || errors.pendidikanLainnya ? 'bg-rose-50/50 border-rose-300' : 'bg-slate-50/70 border-slate-200'}`}>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              5. Pendidikan Terakhir <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(['S1', 'S2', 'Lainnya'] as const).map((edu) => (
                <label
                  key={edu}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer text-sm transition-all ${
                    identity.pendidikanTerakhir === edu
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <input
                    type="radio"
                    name="pendidikanTerakhir"
                    value={edu}
                    checked={identity.pendidikanTerakhir === edu}
                    onChange={() => setIdentity({ ...identity, pendidikanTerakhir: edu })}
                    className="w-3.5 h-3.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{edu === 'Lainnya' ? 'Lainnya (D3/S3/dll)' : edu}</span>
                </label>
              ))}
            </div>

            {identity.pendidikanTerakhir === 'Lainnya' && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Tuliskan jenjang pendidikan (misal: S3 / D3)..."
                  value={identity.pendidikanLainnya || ''}
                  onChange={(e) => setIdentity({ ...identity, pendidikanLainnya: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                />
              </div>
            )}

            {(errors.pendidikanTerakhir || errors.pendidikanLainnya) && (
              <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.pendidikanTerakhir || errors.pendidikanLainnya}
              </p>
            )}
          </div>

          {/* 6. Status Kepegawaian */}
          <div className={`p-4 rounded-xl border transition-colors ${errors.statusKepegawaian ? 'bg-rose-50/50 border-rose-300' : 'bg-slate-50/70 border-slate-200'}`}>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              6. Status Kepegawaian <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['Guru Tetap Yayasan (GTY)', 'Guru Tidak Tetap (GTT) / Guru Honorer'] as const).map((stat) => (
                <label
                  key={stat}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer text-xs sm:text-sm transition-all ${
                    identity.statusKepegawaian === stat
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <input
                    type="radio"
                    name="statusKepegawaian"
                    value={stat}
                    checked={identity.statusKepegawaian === stat}
                    onChange={() => setIdentity({ ...identity, statusKepegawaian: stat })}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 shrink-0"
                  />
                  <span>{stat}</span>
                </label>
              ))}
            </div>
            {errors.statusKepegawaian && (
              <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.statusKepegawaian}
              </p>
            )}
          </div>

          {/* 7. Masa Kerja di Madrasah Ini */}
          <div className={`p-4 rounded-xl border transition-colors ${errors.masaKerja ? 'bg-rose-50/50 border-rose-300' : 'bg-slate-50/70 border-slate-200'}`}>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              7. Masa Kerja di Madrasah Ini <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['< 2 Tahun', '2 – 5 Tahun', '6 – 10 Tahun', '> 10 Tahun'] as const).map((mk) => (
                <label
                  key={mk}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer text-xs sm:text-sm transition-all ${
                    identity.masaKerja === mk
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <input
                    type="radio"
                    name="masaKerja"
                    value={mk}
                    checked={identity.masaKerja === mk}
                    onChange={() => setIdentity({ ...identity, masaKerja: mk })}
                    className="w-3.5 h-3.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{mk}</span>
                </label>
              ))}
            </div>
            {errors.masaKerja && (
              <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.masaKerja}
              </p>
            )}
          </div>

          {/* 8. Status Sertifikasi Pendidik */}
          <div className={`p-4 rounded-xl border transition-colors ${errors.sertifikasiPendidik ? 'bg-rose-50/50 border-rose-300' : 'bg-slate-50/70 border-slate-200'}`}>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              8. Status Sertifikasi Pendidik <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['Sudah Bersertifikasi', 'Belum Bersertifikasi'] as const).map((cert) => (
                <label
                  key={cert}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer text-xs sm:text-sm transition-all ${
                    identity.sertifikasiPendidik === cert
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <input
                    type="radio"
                    name="sertifikasiPendidik"
                    value={cert}
                    checked={identity.sertifikasiPendidik === cert}
                    onChange={() => setIdentity({ ...identity, sertifikasiPendidik: cert })}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{cert}</span>
                </label>
              ))}
            </div>
            {errors.sertifikasiPendidik && (
              <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.sertifikasiPendidik}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Kerahasiaan jawaban Bapak/Ibu terjamin secara aman.</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-md shadow-emerald-700/20 text-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Lanjut ke Pengisian Kuesioner (Bagian II)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
