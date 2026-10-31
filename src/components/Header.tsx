import React from 'react';
import { BookOpen, ShieldCheck, UserCheck, FileText, Sparkles, GraduationCap } from 'lucide-react';
import { ThesisInfo } from '../types';

interface HeaderProps {
  thesisInfo: ThesisInfo;
  activeView: 'public' | 'admin';
  setActiveView: (view: 'public' | 'admin') => void;
  responseCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  thesisInfo,
  activeView,
  setActiveView,
  responseCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top institution bar */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>{thesisInfo.institution}</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-emerald-300 hidden sm:inline">{thesisInfo.programStudy}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300 text-xs">
            <span>Peneliti: <strong className="text-white">{thesisInfo.researcherName}</strong></span>
            <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-full text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {responseCount} Responden Masuk
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Kuesioner Tesis
              </span>
              <span className="text-xs text-slate-600 font-medium">MTs Swasta Kab. Sumedang</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1 mt-0.5" title={thesisInfo.title}>
              {thesisInfo.title}
            </h1>
          </div>
        </div>

        {/* View Switcher Button */}
        <div className="flex items-center self-end md:self-auto gap-2">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveView('public')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'public'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Formulir Kuesioner</span>
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Panel Admin (Wajib Login)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
