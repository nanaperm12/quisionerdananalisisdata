import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, ChevronLeft, Send, AlertTriangle, ArrowLeft, HelpCircle } from 'lucide-react';
import { QuestionCategory, QuestionItem, RespondentIdentity, LIKERT_OPTIONS, ThesisInfo } from '../types';

interface QuestionnaireStepperProps {
  thesisInfo: ThesisInfo;
  categories: QuestionCategory[];
  questions: QuestionItem[];
  identity: RespondentIdentity;
  answers: Record<string, number>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onBackToIdentity: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const QuestionnaireStepper: React.FC<QuestionnaireStepperProps> = ({
  thesisInfo,
  categories,
  questions,
  identity,
  answers,
  setAnswers,
  onBackToIdentity,
  onSubmit,
  isSubmitting,
}) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [showIncompleteAlert, setShowIncompleteAlert] = useState(false);

  const activeCategory = categories[currentCategoryIndex] || categories[0];
  const activeQuestions = questions.filter(q => q.categoryId === activeCategory.id);

  // Calculate completion stats
  const totalQuestions = questions.length;
  const answeredTotalCount = Object.keys(answers).filter(qId => answers[qId] !== undefined).length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredTotalCount / totalQuestions) * 100) : 0;

  // Check how many questions answered in current category
  const activeAnsweredCount = activeQuestions.filter(q => answers[q.id] !== undefined).length;
  const isCurrentCategoryComplete = activeAnsweredCount === activeQuestions.length;

  const handleSelectScore = (questionId: string, score: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: score
    }));
    setShowIncompleteAlert(false);
  };

  const handleNextCategory = () => {
    if (!isCurrentCategoryComplete) {
      setShowIncompleteAlert(true);
      return;
    }
    setShowIncompleteAlert(false);
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevCategory = () => {
    setShowIncompleteAlert(false);
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onBackToIdentity();
    }
  };

  const isAllAnswered = answeredTotalCount === totalQuestions && totalQuestions > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Progress & Responden Capsule */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToIdentity}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Edit Identitas</span>
            </button>
            <div className="text-xs text-slate-600 truncate max-w-xs sm:max-w-md">
              <span className="font-semibold text-slate-800">{identity.nama || 'Responden Anonim'}</span>
              <span className="text-slate-400 mx-1.5">•</span>
              <span>{identity.asalMadrasah}</span>
            </div>
          </div>

          <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Progress: {answeredTotalCount} dari {totalQuestions} Soal ({progressPercent}%)</span>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Category Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-2">
          {categories.map((cat, idx) => {
            const catQuestions = questions.filter(q => q.categoryId === cat.id);
            const answeredInCat = catQuestions.filter(q => answers[q.id] !== undefined).length;
            const isDone = answeredInCat === catQuestions.length && catQuestions.length > 0;
            const isActive = idx === currentCategoryIndex;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setCurrentCategoryIndex(idx);
                  setShowIncompleteAlert(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'bg-emerald-900 text-white border-emerald-900 shadow-md ring-2 ring-emerald-500/30'
                    : isDone
                    ? 'bg-emerald-50/70 border-emerald-300 text-slate-800 hover:bg-emerald-100/50'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-emerald-800 text-emerald-200' : 'bg-slate-200/80 text-slate-700'
                  }`}>
                    {cat.code}
                  </span>
                  <span className={`text-[11px] font-semibold ${
                    isActive ? 'text-emerald-200' : isDone ? 'text-emerald-700' : 'text-slate-600'
                  }`}>
                    {answeredInCat}/{catQuestions.length}
                  </span>
                </div>
                <div className="text-xs font-bold line-clamp-1 mt-1.5">
                  {cat.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bagian II Kuesioner: Current Category Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Category Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="text-xs font-bold tracking-wider uppercase bg-emerald-700/60 text-emerald-300 px-3 py-1 rounded-md border border-emerald-500/30">
              Kategori {currentCategoryIndex + 1} dari {categories.length} ({activeCategory.code})
            </span>
            <span className="text-xs text-slate-300 font-medium bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
              {activeCategory.variableType}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            {activeCategory.code}. {activeCategory.name}
          </h2>
          {activeCategory.description && (
            <p className="text-slate-300 text-sm mt-1.5 max-w-3xl leading-relaxed">
              {activeCategory.description}
            </p>
          )}

          {/* Likert Scale Legend */}
          <div className="mt-5 pt-4 border-t border-slate-700/70">
            <div className="text-[11px] text-slate-300 font-medium mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Keterangan Pilihan Skala Likert:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs">
              {LIKERT_OPTIONS.map(opt => (
                <div key={opt.value} className="bg-slate-800/90 border border-slate-700/80 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-200">
                  <span className="font-extrabold text-emerald-400 w-5">{opt.label}</span>
                  <span className="text-[11px] truncate text-slate-300">= {opt.fullName} ({opt.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="p-4 sm:p-7 space-y-6">
          {activeQuestions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              Belum ada butir pertanyaan pada kategori ini. Silakan kelola di menu Admin.
            </div>
          ) : (
            activeQuestions.map((q, idx) => {
              const currentVal = answers[q.id];
              const isAnswered = currentVal !== undefined;

              return (
                <div
                  key={q.id}
                  id={`question-${q.id}`}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isAnswered
                      ? 'bg-emerald-50/20 border-emerald-200/90 shadow-2xs'
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  {/* Statement header */}
                  <div className="flex items-start gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isAnswered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {q.number || (idx + 1)}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
                        {q.statement}
                      </p>
                    </div>
                  </div>

                  {/* Likert Scale selector */}
                  <div className="mt-4 pt-3 border-t border-slate-100 sm:border-0 sm:pt-0">
                    <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
                      {LIKERT_OPTIONS.map((opt) => {
                        const isSelected = currentVal === opt.value;
                        return (
                          <button
                            type="button"
                            key={opt.value}
                            onClick={() => handleSelectScore(q.id, opt.value)}
                            className={`flex flex-col items-center justify-center py-2.5 px-1 sm:py-3 sm:px-2 rounded-xl border text-center transition-all cursor-pointer ${
                              isSelected
                                ? `${opt.activeColor} shadow-md scale-[1.02] ring-2 ring-emerald-500/20`
                                : `${opt.color} hover:border-slate-300`
                            }`}
                          >
                            <span className="text-xs sm:text-sm font-extrabold tracking-wide">
                              {opt.label}
                            </span>
                            <span className={`text-[10px] hidden sm:block mt-0.5 line-clamp-1 ${
                              isSelected ? 'text-white/90 font-medium' : 'text-slate-500'
                            }`}>
                              {opt.fullName}
                            </span>
                            <span className={`text-[10px] font-bold mt-0.5 sm:hidden ${
                              isSelected ? 'text-white' : 'text-slate-600'
                            }`}>
                              ({opt.value})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Warning if questions incomplete */}
        {showIncompleteAlert && (
          <div className="mx-6 sm:mx-8 mb-4 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Masih ada pertanyaan yang belum dijawab!</p>
              <p className="text-amber-800 mt-0.5">
                Mohon lengkapi seluruh {activeQuestions.length} butir pertanyaan pada kategori ini ({activeCategory.name}) sebelum melanjutkan ke kategori berikutnya demi keabsahan data tesis.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrevCategory}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{currentCategoryIndex === 0 ? 'Kembali ke Identitas' : 'Kategori Sebelumnya'}</span>
          </button>

          <div className="text-xs text-slate-600 font-medium order-first sm:order-none">
            Kategori {currentCategoryIndex + 1} dari {categories.length} • Terisi {activeAnsweredCount} dari {activeQuestions.length}
          </div>

          {currentCategoryIndex < categories.length - 1 ? (
            <button
              type="button"
              onClick={handleNextCategory}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md shadow-emerald-700/20 text-sm transition-all cursor-pointer"
            >
              <span>Lanjut ke {categories[currentCategoryIndex + 1]?.code}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting || !isAllAnswered}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 font-bold rounded-xl shadow-lg text-sm transition-all cursor-pointer ${
                isAllAnswered && !isSubmitting
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-emerald-700/30'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Mengirim Data...' : 'Kirim Kuesioner Selesai'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
