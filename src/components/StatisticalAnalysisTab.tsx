import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  HelpCircle,
  Users,
  BookOpen
} from 'lucide-react';
import { ThesisInfo, QuestionCategory, QuestionItem, SurveyResponse } from '../types';
import { StatsEngine, CompleteAnalysisReport } from '../services/statsEngine';
import { PdfService } from '../services/pdfService';
import { StorageService } from '../services/storageService';
import { StructuralPathDiagram } from './StructuralPathDiagram';

interface StatisticalAnalysisTabProps {
  thesisInfo: ThesisInfo;
  categories: QuestionCategory[];
  questions: QuestionItem[];
  responses: SurveyResponse[];
  setResponses: React.Dispatch<React.SetStateAction<SurveyResponse[]>>;
}

export const StatisticalAnalysisTab: React.FC<StatisticalAnalysisTabProps> = ({
  thesisInfo,
  categories,
  questions,
  responses,
  setResponses,
}) => {
  const [copiedNarration, setCopiedNarration] = useState(false);
  const [activeSubSection, setActiveSubSection] = useState<'all' | 'pathDiagram' | 'validity' | 'regression' | 'mediation' | 'hypotheses'>('all');

  // Compute live statistical analysis
  const report: CompleteAnalysisReport = useMemo(() => {
    return StatsEngine.runCompleteAnalysis(categories, questions, responses);
  }, [categories, questions, responses]);

  const handleCopyNarration = () => {
    const textToCopy = `PEMBAHASAN HASIL ANALISIS DATA (BAB IV TESIS)\n` +
      `Judul: ${thesisInfo.title} ${thesisInfo.subtitle}\n` +
      `Peneliti: ${thesisInfo.researcherName}\n\n` +
      report.executiveSummary.join('\n\n') + '\n\n' +
      `REKAPITULASI PENGUJIAN HIPOTESIS:\n` +
      report.hypotheses.map(h => `• [${h.code}] ${h.statement} -> Keputusan: ${h.decision.toUpperCase()} (t/z hitung = ${h.tCount.toFixed(3)}, p-value = ${h.pValue.toFixed(4)})\n  Catatan: ${h.interpretation}`).join('\n\n');

    navigator.clipboard.writeText(textToCopy);
    setCopiedNarration(true);
    setTimeout(() => setCopiedNarration(false), 3000);
  };

  const handleGenerateSampleData = () => {
    if (confirm('Tambahkan data simulasi realistis 40 responden guru MTs di Sumedang untuk menguji perhitungan statistik secara komprehensif?')) {
      const sample = StatsEngine.generateSampleDataset(40);
      StorageService.saveResponses(sample);
      setResponses(sample);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Pengantar Engine Statistik */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-lg border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" />
                <span>In-App Statistical Analysis Engine</span>
              </span>
              <span className="text-xs text-slate-300 font-medium bg-slate-800/80 px-2.5 py-1 rounded-full">
                Sampel N = {responses.length} Guru
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Olah Data & Uji Statistik Tesis Otomatis
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Sistem telah menghitung secara otomatis: <strong>Uji Validitas Pearson</strong>, <strong>Reliabilitas Cronbach Alpha</strong>, <strong>Regresi Berganda</strong>, <strong>Analisis Jalur (Path Analysis)</strong>, serta <strong>Uji Mediasi Sobel</strong> tanpa perlu software eksternal seperti SPSS atau SmartPLS!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => PdfService.exportStatisticalReportPdf(thesisInfo, report)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Cetak Hasil Bab IV (PDF)</span>
            </button>

            <button
              onClick={handleCopyNarration}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              {copiedNarration ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedNarration ? 'Narasi Disalin!' : 'Salin Narasi Pembahasan'}</span>
            </button>

            {responses.length < 15 && (
              <button
                onClick={handleGenerateSampleData}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                title="Isi sampel simulasi 40 guru MTs di Sumedang"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulasi N=40 Guru</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'all', label: 'Ringkasan & Semua Hasil' },
          { id: 'pathDiagram', label: 'Diagram Jalur Tesis (Path Diagram)' },
          { id: 'validity', label: '1. Uji Validitas & Reliabilitas' },
          { id: 'regression', label: '2. Regresi & Analisis Jalur' },
          { id: 'mediation', label: '3. Uji Mediasi Sobel' },
          { id: 'hypotheses', label: '4. Pembuktian Hipotesis H1-H7' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubSection(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubSection === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DIAGRAM JALUR STRUKTURAL TESIS (PATH DIAGRAM) */}
      {(activeSubSection === 'all' || activeSubSection === 'pathDiagram') && (
        <StructuralPathDiagram
          subStructure1={report.subStructure1}
          subStructure2={report.subStructure2}
          n={report.n}
        />
      )}

      {/* SECTION 1: RINGKASAN DESKRIPTIF & RELIABILITAS */}
      {(activeSubSection === 'all' || activeSubSection === 'validity') && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Statistik Deskriptif & Uji Reliabilitas Variabel (Cronbach's Alpha)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Kriteria reliabilitas: Nilai Cronbach's Alpha (&alpha;) &ge; 0.70 dinyatakan RELIABEL untuk instrumen penelitian tesis.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Kode</th>
                    <th className="py-2.5 px-3">Nama Variabel</th>
                    <th className="py-2.5 px-3 text-center">N</th>
                    <th className="py-2.5 px-3 text-center">Rata-rata (Mean)</th>
                    <th className="py-2.5 px-3 text-center">Std. Deviasi</th>
                    <th className="py-2.5 px-3 text-center">TCR (%)</th>
                    <th className="py-2.5 px-3 text-center">Cronbach's α</th>
                    <th className="py-2.5 px-3 text-right">Status Reliabilitas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {report.descriptive.map((d) => {
                    const rel = report.reliability.find(r => r.categoryCode === d.code);
                    return (
                      <tr key={d.code} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-extrabold text-emerald-800">{d.code}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{d.name}</td>
                        <td className="py-3 px-3 text-center text-slate-600">{d.n}</td>
                        <td className="py-3 px-3 text-center font-bold text-slate-900">{d.mean.toFixed(2)}</td>
                        <td className="py-3 px-3 text-center text-slate-600">{d.stdDev.toFixed(2)}</td>
                        <td className="py-3 px-3 text-center font-semibold text-emerald-700">{d.tcrPercent.toFixed(1)}%</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                          {rel ? rel.cronbachAlpha.toFixed(3) : '-'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            rel && rel.isReliable
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {rel?.level || 'Reliabel'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* UJI VALIDITAS PER BUTIR SOAL */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Hasil Uji Validitas Butir Instrumen (Pearson Product-Moment)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Keputusan validitas: Butir dinyatakan VALID jika r-hitung &gt; r-tabel (&alpha; = 0.05, df = N-2).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(report.validity).map((catCode) => {
                const items = report.validity[catCode];
                const validCount = items.filter(i => i.isValid).length;

                return (
                  <div key={catCode} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                    <div className="bg-slate-100 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
                      <span className="font-bold text-xs text-slate-800">
                        Variabel {catCode} ({items.length} Butir)
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {validCount} dari {items.length} Butir Valid
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.questionId} className="p-3 text-xs flex items-center justify-between gap-3 bg-white">
                          <div className="flex-1">
                            <span className="font-bold text-slate-900 mr-1.5">{catCode}.{item.itemNumber}</span>
                            <span className="text-slate-600 line-clamp-1">{item.statement}</span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <div className="font-mono font-bold text-slate-800">r = {item.rCount.toFixed(3)}</div>
                              <div className="text-[10px] text-slate-400">rtabel = {item.rTable.toFixed(3)}</div>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.isValid
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}>
                              {item.isValid ? 'VALID' : 'DROP'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: MATRIKS KORELASI & REGRESI SUB-STRUKTUR 1 & 2 */}
      {(activeSubSection === 'all' || activeSubSection === 'regression') && (
        <div className="space-y-6">
          {/* Matriks Korelasi */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Matriks Korelasi Antar Variabel (Pearson Correlation Matrix)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4 text-left">Variabel Penelitian</th>
                    <th className="py-2.5 px-4">X1 (Kompensasi)</th>
                    <th className="py-2.5 px-4">X2 (Kepemimpinan)</th>
                    <th className="py-2.5 px-4">Z (Kepuasan Kerja)</th>
                    <th className="py-2.5 px-4">Y (Turnover Intention)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {report.correlationMatrix.variables.map((rowVar, rIdx) => (
                    <tr key={rowVar} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-4 text-left font-sans font-bold text-slate-800">
                        {rowVar === 'X1' ? 'X1. Kompensasi Finansial & Nonfinansial' :
                         rowVar === 'X2' ? 'X2. Kepemimpinan Kepala Madrasah' :
                         rowVar === 'Z' ? 'Z. Kepuasan Kerja Guru (Mediasi)' :
                         'Y. Turnover Intention Guru (Dependen)'}
                      </td>
                      {report.correlationMatrix.matrix[rIdx].map((val, cIdx) => (
                        <td key={cIdx} className={`py-2.5 px-4 font-bold ${
                          rIdx === cIdx ? 'text-slate-400 bg-slate-50/50' : val < 0 ? 'text-rose-600' : 'text-emerald-700'
                        }`}>
                          {val.toFixed(3)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SUB-STRUKTUR 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Sub-Struktur 1
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                  Pengaruh Kompensasi (X1) & Kepemimpinan (X2) terhadap Kepuasan Kerja Guru (Z)
                </h3>
              </div>

              <div className="flex items-center gap-3 text-xs bg-slate-50 p-2 rounded-xl border border-slate-200">
                <div>R = <strong className="text-slate-900 font-mono">{report.subStructure1.r.toFixed(3)}</strong></div>
                <div className="text-slate-300">•</div>
                <div>R² = <strong className="text-emerald-700 font-mono">{(report.subStructure1.rSquare * 100).toFixed(2)}%</strong></div>
                <div className="text-slate-300">•</div>
                <div>F-hitung = <strong className="text-slate-900 font-mono">{report.subStructure1.fCount.toFixed(3)}</strong></div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 font-semibold">
              Persamaan Regresi Jalur: {report.subStructure1.equation} + e₁
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Variabel Prediktor</th>
                    <th className="py-2.5 px-3 text-center">Koefisien (B)</th>
                    <th className="py-2.5 px-3 text-center">Std. Error</th>
                    <th className="py-2.5 px-3 text-center">Beta (&beta;)</th>
                    <th className="py-2.5 px-3 text-center">t-hitung</th>
                    <th className="py-2.5 px-3 text-center">Sig. (p-value)</th>
                    <th className="py-2.5 px-3 text-right">Kesimpulan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {report.subStructure1.coefficients.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-800">{c.variableName}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">{c.b.toFixed(3)}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500">{c.se.toFixed(3)}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-emerald-700">{c.beta !== 0 ? c.beta.toFixed(3) : '-'}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">{c.t.toFixed(3)}</td>
                      <td className="py-2.5 px-3 text-center font-mono">{c.pValue.toFixed(4)}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.isSignificant
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {c.variableName === '(Konstanta)' ? 'Konstanta' : (c.isSignificant ? 'Signifikan (p < 0.05)' : 'Tidak Signifikan')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SUB-STRUKTUR 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-extrabold uppercase bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                  Sub-Struktur 2
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                  Pengaruh Kompensasi (X1), Kepemimpinan (X2), & Kepuasan Kerja (Z) terhadap Turnover Intention (Y)
                </h3>
              </div>

              <div className="flex items-center gap-3 text-xs bg-slate-50 p-2 rounded-xl border border-slate-200">
                <div>R = <strong className="text-slate-900 font-mono">{report.subStructure2.r.toFixed(3)}</strong></div>
                <div className="text-slate-300">•</div>
                <div>R² = <strong className="text-emerald-700 font-mono">{(report.subStructure2.rSquare * 100).toFixed(2)}%</strong></div>
                <div className="text-slate-300">•</div>
                <div>F-hitung = <strong className="text-slate-900 font-mono">{report.subStructure2.fCount.toFixed(3)}</strong></div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 font-semibold">
              Persamaan Regresi Jalur: {report.subStructure2.equation} + e₂
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Variabel Prediktor</th>
                    <th className="py-2.5 px-3 text-center">Koefisien (B)</th>
                    <th className="py-2.5 px-3 text-center">Std. Error</th>
                    <th className="py-2.5 px-3 text-center">Beta (&beta;)</th>
                    <th className="py-2.5 px-3 text-center">t-hitung</th>
                    <th className="py-2.5 px-3 text-center">Sig. (p-value)</th>
                    <th className="py-2.5 px-3 text-right">Kesimpulan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {report.subStructure2.coefficients.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-800">{c.variableName}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">{c.b.toFixed(3)}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500">{c.se.toFixed(3)}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-emerald-700">{c.beta !== 0 ? c.beta.toFixed(3) : '-'}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">{c.t.toFixed(3)}</td>
                      <td className="py-2.5 px-3 text-center font-mono">{c.pValue.toFixed(4)}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.isSignificant
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {c.variableName === '(Konstanta)' ? 'Konstanta' : (c.isSignificant ? 'Signifikan (p < 0.05)' : 'Tidak Signifikan')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: UJI MEDIASI SOBEL TEST */}
      {(activeSubSection === 'all' || activeSubSection === 'mediation') && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-extrabold uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                Uji Efek Mediasi
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                Uji Sobel Test: Kepuasan Kerja Guru (Z) sebagai Variabel Mediasi Intervening
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Jalur X1 -> Z -> Y */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-purple-900 bg-purple-100 px-2.5 py-1 rounded-md">
                  Jalur 1: X1 &rarr; Z &rarr; Y
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {report.mediationX1.mediationType}
                </span>
              </div>
              <p className="text-xs text-slate-700 font-semibold">
                {report.mediationX1.pathDescription}
              </p>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400">Efek Langsung</div>
                  <div className="font-mono font-bold text-slate-800">{report.mediationX1.directEffect.toFixed(3)}</div>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400">Efek Tidak Langsung</div>
                  <div className="font-mono font-bold text-emerald-700">{report.mediationX1.indirectEffect.toFixed(3)}</div>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400">Total Efek</div>
                  <div className="font-mono font-bold text-purple-700">{report.mediationX1.totalEffect.toFixed(3)}</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nilai z-hitung Sobel:</span>
                  <strong className="font-mono">{report.mediationX1.sobelZ.toFixed(3)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nilai p-value:</span>
                  <strong className="font-mono">{report.mediationX1.pValue.toFixed(4)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kesimpulan:</span>
                  <strong className="text-emerald-700 font-semibold">
                    {report.mediationX1.isMediated ? 'Signifikan Memediasi' : 'Tidak Memediasi'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Jalur X2 -> Z -> Y */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-purple-900 bg-purple-100 px-2.5 py-1 rounded-md">
                  Jalur 2: X2 &rarr; Z &rarr; Y
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {report.mediationX2.mediationType}
                </span>
              </div>
              <p className="text-xs text-slate-700 font-semibold">
                {report.mediationX2.pathDescription}
              </p>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400">Efek Langsung</div>
                  <div className="font-mono font-bold text-slate-800">{report.mediationX2.directEffect.toFixed(3)}</div>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400">Efek Tidak Langsung</div>
                  <div className="font-mono font-bold text-emerald-700">{report.mediationX2.indirectEffect.toFixed(3)}</div>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400">Total Efek</div>
                  <div className="font-mono font-bold text-purple-700">{report.mediationX2.totalEffect.toFixed(3)}</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nilai z-hitung Sobel:</span>
                  <strong className="font-mono">{report.mediationX2.sobelZ.toFixed(3)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nilai p-value:</span>
                  <strong className="font-mono">{report.mediationX2.pValue.toFixed(4)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kesimpulan:</span>
                  <strong className="text-emerald-700 font-semibold">
                    {report.mediationX2.isMediated ? 'Signifikan Memediasi' : 'Tidak Memediasi'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: REKAPITULASI PEMBUKTIAN HIPOTESIS (H1 S/D H7) */}
      {(activeSubSection === 'all' || activeSubSection === 'hypotheses') && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Rangkuman Bab IV Tesis
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                Rekapitulasi Keputusan Uji Hipotesis Penelitian (H1 s/d H7)
              </h3>
            </div>

            <button
              onClick={handleCopyNarration}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Teks Pembahasan untuk Naskah Tesis</span>
            </button>
          </div>

          <div className="space-y-3">
            {report.hypotheses.map((h) => (
              <div key={h.code} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                      {h.code}
                    </span>
                    <span className="font-bold text-xs text-slate-800">
                      Jalur {h.path}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-600">
                      t/z = <strong>{h.tCount.toFixed(3)}</strong> (p = {h.pValue.toFixed(4)})
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      h.decision === 'Diterima'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      HIPOTESIS {h.decision.toUpperCase()}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-900">
                  {h.statement}
                </p>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/80">
                  <strong>Interpretasi Pembahasan:</strong> {h.interpretation}
                </p>
              </div>
            ))}
          </div>

          {/* Executive Summary Card */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl mt-6 space-y-3">
            <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Draf Narasi Kesimpulan Bab IV (Siap Pakai untuk Naskah Tesis)</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
              {report.executiveSummary.map((para, idx) => (
                <p key={idx}>{idx + 1}. {para}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
