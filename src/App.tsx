import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RespondentForm } from './components/RespondentForm';
import { QuestionnaireStepper } from './components/QuestionnaireStepper';
import { SubmissionSuccess } from './components/SubmissionSuccess';
import { AdminDashboard } from './components/AdminDashboard';
import { StorageService } from './services/storageService';
import { 
  ThesisInfo, 
  QuestionCategory, 
  QuestionItem, 
  SurveyResponse, 
  RespondentIdentity 
} from './types';
import { GraduationCap, ShieldCheck, FileSpreadsheet, Download, Info } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'public' | 'admin'>('public');

  // Loaded from storage service
  const [thesisInfo, setThesisInfo] = useState<ThesisInfo>(StorageService.getThesisInfo());
  const [categories, setCategories] = useState<QuestionCategory[]>(StorageService.getCategories());
  const [questions, setQuestions] = useState<QuestionItem[]>(StorageService.getQuestions());
  const [responses, setResponses] = useState<SurveyResponse[]>(StorageService.getResponses());

  // Public Form Steps
  const [publicStep, setPublicStep] = useState<'identity' | 'questions' | 'success'>('identity');
  
  // Current respondent filling the form
  const [identity, setIdentity] = useState<RespondentIdentity>({
    nama: '',
    asalMadrasah: '',
    jenisKelamin: '',
    usia: '',
    pendidikanTerakhir: '',
    pendidikanLainnya: '',
    statusKepegawaian: '',
    masaKerja: '',
    sertifikasiPendidik: '',
  });

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResponse, setSubmittedResponse] = useState<SurveyResponse | null>(null);

  // Sync data on mount
  useEffect(() => {
    setThesisInfo(StorageService.getThesisInfo());
    setCategories(StorageService.getCategories());
    setQuestions(StorageService.getQuestions());
    setResponses(StorageService.getResponses());
  }, []);

  const handleProceedToQuestions = () => {
    setPublicStep('questions');
  };

  const handleBackToIdentity = () => {
    setPublicStep('identity');
  };

  const handleSubmitSurvey = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const newResponse: SurveyResponse = {
        id: `resp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        submittedAt: new Date().toISOString(),
        respondent: { ...identity },
        answers: { ...answers },
      };

      StorageService.addResponse(newResponse);
      const updatedList = StorageService.getResponses();
      setResponses(updatedList);
      setSubmittedResponse(newResponse);
      setIsSubmitting(false);
      setPublicStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const handleResetForNewRespondent = () => {
    setIdentity({
      nama: '',
      asalMadrasah: '',
      jenisKelamin: '',
      usia: '',
      pendidikanTerakhir: '',
      pendidikanLainnya: '',
      statusKepegawaian: '',
      masaKerja: '',
      sertifikasiPendidik: '',
    });
    setAnswers({});
    setSubmittedResponse(null);
    setPublicStep('identity');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Header bar */}
      <Header
        thesisInfo={thesisInfo}
        activeView={activeView}
        setActiveView={setActiveView}
        responseCount={responses.length}
      />

      {/* Main content body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeView === 'public' ? (
          <div>
            {publicStep === 'identity' && (
              <RespondentForm
                thesisInfo={thesisInfo}
                identity={identity}
                setIdentity={setIdentity}
                onProceed={handleProceedToQuestions}
              />
            )}

            {publicStep === 'questions' && (
              <QuestionnaireStepper
                thesisInfo={thesisInfo}
                categories={categories}
                questions={questions}
                identity={identity}
                answers={answers}
                setAnswers={setAnswers}
                onBackToIdentity={handleBackToIdentity}
                onSubmit={handleSubmitSurvey}
                isSubmitting={isSubmitting}
              />
            )}

            {publicStep === 'success' && submittedResponse && (
              <SubmissionSuccess
                thesisInfo={thesisInfo}
                categories={categories}
                questions={questions}
                response={submittedResponse}
                onReset={handleResetForNewRespondent}
              />
            )}
          </div>
        ) : (
          <AdminDashboard
            thesisInfo={thesisInfo}
            setThesisInfo={setThesisInfo}
            categories={categories}
            setCategories={setCategories}
            questions={questions}
            setQuestions={setQuestions}
            responses={responses}
            setResponses={setResponses}
          />
        )}
      </main>

      {/* Footer with academic credentials */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <GraduationCap className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <p className="font-semibold text-slate-800">
                Instrumen Kuesioner Penelitian Tesis Pascasarjana Magister MPI
              </p>
              <p className="text-slate-500 text-[11px]">
                {thesisInfo.institution} • Peneliti: {thesisInfo.researcherName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Studi Kasus: Guru MTs Swasta di Kab. Sumedang</span>
            <span>•</span>
            <button
              onClick={() => {
                setActiveView(activeView === 'public' ? 'admin' : 'public');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-emerald-700 hover:text-emerald-900 font-semibold underline cursor-pointer"
            >
              {activeView === 'public' ? 'Buka Panel Admin / Dosen' : 'Buka Formulir Kuesioner'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
