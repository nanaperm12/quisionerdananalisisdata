import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, Download, RotateCcw, Heart, ShieldCheck, FileCheck } from 'lucide-react';
import { SurveyResponse, ThesisInfo, QuestionCategory, QuestionItem } from '../types';
import { PdfService } from '../services/pdfService';

interface SubmissionSuccessProps {
  thesisInfo: ThesisInfo;
  categories: QuestionCategory[];
  questions: QuestionItem[];
  response: SurveyResponse;
  onReset: () => void;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({
  thesisInfo,
  categories,
  questions,
  response,
  onReset,
}) => {
  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if confetti fails in test env
    }
  }, []);

  const handleDownloadPdf = () => {
    PdfService.exportSingleRespondentPdf(thesisInfo, categories, questions, response);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 text-center relative overflow-hidden">
        {/* Decorative backdrop glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Kuesioner Berhasil Terkirim
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Terima Kasih Banyak!
          </h2>

          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-lg mx-auto leading-relaxed">
            Data kuesioner penelitian tesis Bapak/Ibu telah tersimpan dengan aman dan menjadi kontribusi berharga bagi kemajuan pendidikan madrasah.
          </p>

          {/* Acknowledgement Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 my-6 text-left text-xs sm:text-sm text-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 pb-2 border-b border-slate-200">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Ringkasan Pengisian:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-600">Nama Responden:</span>{' '}
                <strong className="text-slate-800">{response.respondent.nama || '(Anonim)'}</strong>
              </div>
              <div>
                <span className="text-slate-600">Asal Madrasah:</span>{' '}
                <strong className="text-slate-800">{response.respondent.asalMadrasah}</strong>
              </div>
              <div>
                <span className="text-slate-600">Waktu Kirim:</span>{' '}
                <span className="text-slate-700">{new Date(response.submittedAt).toLocaleString('id-ID')}</span>
              </div>
              <div>
                <span className="text-slate-600">Butir Terisi:</span>{' '}
                <strong className="text-emerald-700">{Object.keys(response.answers).length} Butir Soal</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Kerahasiaan jawaban dijamin sepenuhnya untuk kepentingan riset akademis.</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDownloadPdf}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Lembar Jawaban (PDF)</span>
            </button>

            <button
              onClick={onReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Isi Responden Baru</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-600">
            <p className="font-serif italic text-slate-600">
              "{thesisInfo.closingNote}"
            </p>
            <p className="font-bold text-slate-700 mt-1">
              — {thesisInfo.researcherName} ({thesisInfo.programStudy})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
