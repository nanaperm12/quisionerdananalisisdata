import React, { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  FileSpreadsheet, 
  Search, 
  Eye, 
  EyeOff,
  Check, 
  X, 
  AlertCircle, 
  FolderPlus, 
  Layers, 
  Users, 
  RotateCcw,
  BookOpen,
  Lock,
  Unlock,
  Building2,
  PieChart as PieIcon,
  HelpCircle,
  User,
  KeyRound,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  Calculator,
  Sparkles
} from 'lucide-react';
import { 
  ThesisInfo, 
  QuestionCategory, 
  QuestionItem, 
  SurveyResponse, 
  LIKERT_OPTIONS, 
  RespondentIdentity 
} from '../types';
import { PdfService } from '../services/pdfService';
import { StorageService } from '../services/storageService';
import { StatisticalAnalysisTab } from './StatisticalAnalysisTab';

interface AdminDashboardProps {
  thesisInfo: ThesisInfo;
  setThesisInfo: React.Dispatch<React.SetStateAction<ThesisInfo>>;
  categories: QuestionCategory[];
  setCategories: React.Dispatch<React.SetStateAction<QuestionCategory[]>>;
  questions: QuestionItem[];
  setQuestions: React.Dispatch<React.SetStateAction<QuestionItem[]>>;
  responses: SurveyResponse[];
  setResponses: React.Dispatch<React.SetStateAction<SurveyResponse[]>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  thesisInfo,
  setThesisInfo,
  categories,
  setCategories,
  questions,
  setQuestions,
  responses,
  setResponses,
}) => {
  // Username & Password Authentication state (Wajib Login)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_logged_in') === 'true';
  });
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Admin Account Change State
  const [accountUsername, setAccountUsername] = useState(() => StorageService.getAdminCredentials().username);
  const [accountNewPassword, setAccountNewPassword] = useState('');
  const [accountConfirmPassword, setAccountConfirmPassword] = useState('');
  const [accountNotice, setAccountNotice] = useState('');
  const [accountError, setAccountError] = useState('');

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'stats' | 'analysis' | 'responses' | 'questions' | 'categories' | 'thesis'>('analysis');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMadrasah, setFilterMadrasah] = useState('ALL');

  // Selected response for modal
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);

  // Question CRUD State
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);
  const [newQuestionCategory, setNewQuestionCategory] = useState(categories[0]?.id || '');
  const [newQuestionStatement, setNewQuestionStatement] = useState('');
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);

  // Category CRUD State
  const [editingCategory, setEditingCategory] = useState<QuestionCategory | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCatCode, setNewCatCode] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<QuestionCategory['variableType']>('Independen (X1)');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Thesis settings temp state
  const [tempThesis, setTempThesis] = useState<ThesisInfo>(thesisInfo);
  const [thesisSavedNotice, setThesisSavedNotice] = useState(false);

  // Handle Username & Password Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const creds = StorageService.getAdminCredentials();
    if (
      inputUsername.trim().toLowerCase() === creds.username.toLowerCase() &&
      inputPassword === creds.password
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_logged_in', 'true');
      setLoginError('');
      setInputPassword('');
    } else {
      setLoginError('Username atau Password salah! Silakan periksa kembali.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_logged_in');
    setInputUsername('');
    setInputPassword('');
    setLoginError('');
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError('');
    setAccountNotice('');

    if (!accountUsername.trim()) {
      setAccountError('Username tidak boleh kosong.');
      return;
    }

    if (accountNewPassword) {
      if (accountNewPassword.length < 4) {
        setAccountError('Password minimal 4 karakter.');
        return;
      }
      if (accountNewPassword !== accountConfirmPassword) {
        setAccountError('Konfirmasi password tidak sesuai.');
        return;
      }
    }

    const currentCreds = StorageService.getAdminCredentials();
    const updated = {
      username: accountUsername.trim(),
      password: accountNewPassword ? accountNewPassword : currentCreds.password,
    };
    StorageService.saveAdminCredentials(updated);
    setAccountNotice('Username dan password admin berhasil diperbarui!');
    setAccountNewPassword('');
    setAccountConfirmPassword('');
    setTimeout(() => setAccountNotice(''), 4000);
  };

  // Question CRUD Operations
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionStatement.trim() || !newQuestionCategory) return;

    if (editingQuestion) {
      const updated: QuestionItem = {
        ...editingQuestion,
        categoryId: newQuestionCategory,
        statement: newQuestionStatement.trim(),
      };
      StorageService.saveQuestion(updated);
      setQuestions(StorageService.getQuestions());
      setEditingQuestion(null);
    } else {
      const sameCatQuestions = questions.filter(q => q.categoryId === newQuestionCategory);
      const nextNumber = sameCatQuestions.length + 1;
      const newQ: QuestionItem = {
        id: `q_custom_${Date.now()}`,
        categoryId: newQuestionCategory,
        number: nextNumber,
        statement: newQuestionStatement.trim(),
      };
      StorageService.saveQuestion(newQ);
      setQuestions(StorageService.getQuestions());
    }

    setNewQuestionStatement('');
    setShowAddQuestionModal(false);
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus butir kuesioner ini?')) {
      StorageService.deleteQuestion(id);
      setQuestions(StorageService.getQuestions());
    }
  };

  const handleOpenEditQuestion = (q: QuestionItem) => {
    setEditingQuestion(q);
    setNewQuestionCategory(q.categoryId);
    setNewQuestionStatement(q.statement);
    setShowAddQuestionModal(true);
  };

  // Category CRUD Operations
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatCode.trim() || !newCatName.trim()) return;

    if (editingCategory) {
      const updated: QuestionCategory = {
        ...editingCategory,
        code: newCatCode.trim(),
        name: newCatName.trim(),
        variableType: newCatType,
        description: newCatDesc.trim(),
      };
      StorageService.saveCategory(updated);
      setCategories(StorageService.getCategories());
      setEditingCategory(null);
    } else {
      const newCat: QuestionCategory = {
        id: `cat_${Date.now()}`,
        code: newCatCode.trim(),
        name: newCatName.trim(),
        variableType: newCatType,
        description: newCatDesc.trim(),
        order: categories.length + 1,
      };
      StorageService.saveCategory(newCat);
      setCategories(StorageService.getCategories());
    }

    setNewCatCode('');
    setNewCatName('');
    setNewCatDesc('');
    setShowAddCategoryModal(false);
  };

  const handleDeleteCategory = (catId: string) => {
    if (confirm('Menghapus kategori ini juga akan menghapus seluruh butir pernyataan di dalamnya. Lanjutkan?')) {
      StorageService.deleteCategory(catId);
      setCategories(StorageService.getCategories());
      setQuestions(StorageService.getQuestions());
    }
  };

  const handleOpenEditCategory = (cat: QuestionCategory) => {
    setEditingCategory(cat);
    setNewCatCode(cat.code);
    setNewCatName(cat.name);
    setNewCatType(cat.variableType);
    setNewCatDesc(cat.description || '');
    setShowAddCategoryModal(true);
  };

  // Response Operations
  const handleDeleteResponse = (id: string) => {
    if (confirm('Hapus respon ini dari data penelitian?')) {
      StorageService.deleteResponse(id);
      setResponses(StorageService.getResponses());
      if (selectedResponse?.id === id) setSelectedResponse(null);
    }
  };

  const handleClearAllResponses = () => {
    if (confirm('PERINGATAN: Seluruh respon yang masuk akan dikosongkan. Pastikan sudah mengekspor ke PDF/CSV terlebih dahulu. Lanjutkan?')) {
      StorageService.clearAllResponses();
      setResponses([]);
    }
  };

  const handleResetToDefaultData = () => {
    if (confirm('Kembalikan butir soal, kategori, dan data awal sesuai dokumen kuesioner tesis Sumedang?')) {
      StorageService.resetAllToDefault();
      setThesisInfo(StorageService.getThesisInfo());
      setCategories(StorageService.getCategories());
      setQuestions(StorageService.getQuestions());
      setResponses(StorageService.getResponses());
      setTempThesis(StorageService.getThesisInfo());
      alert('Data berhasil di-reset sesuai dokumen kuesioner tesis!');
    }
  };

  const handleSaveThesisSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveThesisInfo(tempThesis);
    setThesisInfo(tempThesis);
    setThesisSavedNotice(true);
    setTimeout(() => setThesisSavedNotice(false), 3000);
  };

  // Filtered responses list
  const filteredResponses = responses.filter(r => {
    const matchesSearch = 
      (r.respondent.nama || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.respondent.asalMadrasah || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMadrasah = filterMadrasah === 'ALL' || r.respondent.asalMadrasah === filterMadrasah;
    return matchesSearch && matchesMadrasah;
  });

  // Unique list of madrasah from responses
  const uniqueMadrasahs = Array.from(new Set(responses.map(r => r.respondent.asalMadrasah).filter(Boolean)));

  // If locked, show mandatory Username & Password login card
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-8 sm:my-12">
        <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
          {/* Decorative backdrop glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-2xl pointer-events-none -z-0" />
          
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-teal-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-700/20">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-1.5">
              Akses Terbatas Peneliti
            </span>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Login Panel Admin
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Silakan masukkan Username dan Password untuk mengelola butir kuesioner, rekapitulasi responden, dan export data ke PDF / SPSS.
            </p>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 text-left font-medium animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              {/* Username Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Username Admin <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Masukkan username..."
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white font-medium"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password..."
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-md shadow-emerald-700/20 text-sm transition-all transform hover:-translate-y-0.5 cursor-pointer mt-2"
              >
                Masuk ke Panel Admin
              </button>

              {/* Credential Hint & Quick Fill */}
              <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-600">
                  <div className="text-[11px] font-bold text-slate-700 mb-1">Kredensial Default Login:</div>
                  <div className="font-mono text-[11px] text-emerald-800 space-x-2">
                    <span>Username: <strong>admin</strong></span>
                    <span>•</span>
                    <span>Password: <strong>admin123</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setInputUsername('admin');
                      setInputPassword('admin123');
                    }}
                    className="mt-2 text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold underline block mx-auto cursor-pointer"
                  >
                    Gunakan Kredensial Default
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Admin Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-slate-900 text-white px-2.5 py-0.5 rounded-md">
              Panel Pengelola Tesis
            </span>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Admin & Analisis Data
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Manajemen Konten Kuesioner & Rekapitulasi Responden
          </h2>
        </div>

        {/* Global Export & Tools */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => PdfService.exportRecapPdf(thesisInfo, categories, questions, responses)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs shadow-sm shadow-emerald-700/20 transition-all cursor-pointer"
            title="Download Laporan Rekapitulasi Lengkap Format PDF"
          >
            <Download className="w-4 h-4" />
            <span>Export Rekap (PDF)</span>
          </button>

          <button
            onClick={() => PdfService.exportToCsv(thesisInfo, categories, questions, responses)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
            title="Download Data Tabulasi Mentah Format CSV untuk Import ke SPSS / SmartPLS"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Tabulasi SPSS (CSV)</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            title="Keluar dari sesi admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'analysis'
              ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-md'
              : 'bg-white text-emerald-900 hover:bg-emerald-50/80 border border-emerald-300'
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-500" />
          <span>Uji Statistik Tesis (In-App)</span>
          <span className="text-[10px] bg-emerald-950/80 text-emerald-200 px-1.5 py-0.5 rounded font-extrabold">BAB IV</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'stats'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Statistik Deskriptif ({responses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('responses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'responses'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Data Responden ({responses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'questions'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Kelola Butir Soal ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Variabel / Kategori ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('thesis')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'thesis'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Pengaturan Tesis & Reset</span>
        </button>
      </div>

      {/* TAB 1: STATS & ANALYSIS */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Responden</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {responses.length}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Guru MTs Swasta</span>
            </div>

            {categories.map((cat) => {
              const catQuestions = questions.filter(q => q.categoryId === cat.id);
              let totalScore = 0;
              let totalCount = 0;

              responses.forEach(r => {
                catQuestions.forEach(q => {
                  if (r.answers[q.id]) {
                    totalScore += r.answers[q.id];
                    totalCount++;
                  }
                });
              });

              const mean = totalCount > 0 ? (totalScore / totalCount) : 0;

              return (
                <div key={cat.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">{cat.code}</span>
                    <span className="text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                      {catQuestions.length} Butir
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                    {mean.toFixed(2)} <span className="text-xs font-normal text-slate-400">/ 5.0</span>
                  </div>
                  <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5" title={cat.name}>
                    {cat.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Demographic Distributions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gender & Kepegawaian */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-600" />
                <span>Distribusi Gender & Status Kepegawaian</span>
              </h3>

              {/* Gender bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Laki-laki vs Perempuan</span>
                  <span className="font-bold">
                    {responses.filter(r => r.respondent.jenisKelamin === 'Laki-laki').length} L / {responses.filter(r => r.respondent.jenisKelamin === 'Perempuan').length} P
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-blue-600 h-full" 
                    style={{ width: `${responses.length ? (responses.filter(r => r.respondent.jenisKelamin === 'Laki-laki').length / responses.length) * 100 : 50}%` }}
                    title="Laki-laki"
                  />
                  <div 
                    className="bg-rose-500 h-full" 
                    style={{ width: `${responses.length ? (responses.filter(r => r.respondent.jenisKelamin === 'Perempuan').length / responses.length) * 100 : 50}%` }}
                    title="Perempuan"
                  />
                </div>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-1.5">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span> Laki-laki</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span> Perempuan</span>
                </div>
              </div>

              {/* Kepegawaian */}
              <div className="pt-2">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Status Guru (GTY vs GTT/Honorer)</span>
                  <span className="font-bold">
                    {responses.filter(r => r.respondent.statusKepegawaian === 'Guru Tetap Yayasan (GTY)').length} GTY / {responses.filter(r => r.respondent.statusKepegawaian === 'Guru Tidak Tetap (GTT) / Guru Honorer').length} Honorer
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-emerald-600 h-full" 
                    style={{ width: `${responses.length ? (responses.filter(r => r.respondent.statusKepegawaian === 'Guru Tetap Yayasan (GTY)').length / responses.length) * 100 : 50}%` }}
                  />
                  <div 
                    className="bg-amber-500 h-full" 
                    style={{ width: `${responses.length ? (responses.filter(r => r.respondent.statusKepegawaian === 'Guru Tidak Tetap (GTT) / Guru Honorer').length / responses.length) * 100 : 50}%` }}
                  />
                </div>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-1.5">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></span> Guru Tetap Yayasan (GTY)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span> Guru Tidak Tetap / Honorer</span>
                </div>
              </div>

              {/* Sertifikasi */}
              <div className="pt-2">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Sertifikasi Pendidik</span>
                  <span className="font-bold">
                    {responses.filter(r => r.respondent.sertifikasiPendidik === 'Sudah Bersertifikasi').length} Sudah / {responses.filter(r => r.respondent.sertifikasiPendidik === 'Belum Bersertifikasi').length} Belum
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-teal-600 h-full" 
                    style={{ width: `${responses.length ? (responses.filter(r => r.respondent.sertifikasiPendidik === 'Sudah Bersertifikasi').length / responses.length) * 100 : 50}%` }}
                  />
                  <div 
                    className="bg-slate-400 h-full" 
                    style={{ width: `${responses.length ? (responses.filter(r => r.respondent.sertifikasiPendidik === 'Belum Bersertifikasi').length / responses.length) * 100 : 50}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Asal Madrasah List */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Sebaran Responden per Madrasah</span>
              </h3>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {uniqueMadrasahs.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">Belum ada data madrasah.</p>
                ) : (
                  uniqueMadrasahs.map((m, idx) => {
                    const count = responses.filter(r => r.respondent.asalMadrasah === m).length;
                    const pct = responses.length ? Math.round((count / responses.length) * 100) : 0;
                    return (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 truncate max-w-xs">{m}</span>
                        <span className="font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full shrink-0">
                          {count} Guru ({pct}%)
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Quick Academic Interpretation Summary */}
          <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white p-6 rounded-2xl shadow-sm space-y-3">
            <h4 className="text-sm font-bold flex items-center gap-2 text-emerald-300">
              <BookOpen className="w-4 h-4" />
              <span>Panduan Analisis Bab IV Tesis (SPSS / SmartPLS)</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Data hasil kuesioner ini dirancang untuk menguji hipotesis regresi linear berganda dan path analysis (analisis jalur):
              <br />
              • <strong>X1 (Kompensasi) & X2 (Kepemimpinan)</strong> sebagai variabel eksogen / independen.
              <br />
              • <strong>Z (Kepuasan Kerja)</strong> sebagai variabel mediasi intervening.
              <br />
              • <strong>Y (Turnover Intention)</strong> sebagai variabel endogen / dependen.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => PdfService.exportToCsv(thesisInfo, categories, questions, responses)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Unduh File CSV Tabulasi Data untuk SPSS</span>
              </button>
              <button
                onClick={() => PdfService.exportRecapPdf(thesisInfo, categories, questions, responses)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Cetak Rekapitulasi Lengkap (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: OLAH DATA & UJI STATISTIK IN-APP (BAB IV TESIS) */}
      {activeTab === 'analysis' && (
        <StatisticalAnalysisTab
          thesisInfo={thesisInfo}
          categories={categories}
          questions={questions}
          responses={responses}
          setResponses={setResponses}
        />
      )}

      {/* TAB 2: DATA RESPONDEN & JAWABAN */}
      {activeTab === 'responses' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari nama guru atau madrasah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={filterMadrasah}
                onChange={(e) => setFilterMadrasah(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="ALL">Semua Madrasah ({responses.length})</option>
                {uniqueMadrasahs.map((m, idx) => (
                  <option key={idx} value={m}>{m}</option>
                ))}
              </select>

              {responses.length > 0 && (
                <button
                  onClick={handleClearAllResponses}
                  className="px-3 py-2 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold transition-colors shrink-0"
                >
                  Kosongkan Data
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">Waktu</th>
                    <th className="py-3 px-4">Nama Responden</th>
                    <th className="py-3 px-4">Asal Madrasah</th>
                    <th className="py-3 px-4">Status & Masa Kerja</th>
                    <th className="py-3 px-4 text-center">Rata-rata Skor</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredResponses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        Tidak ada data responden yang cocok dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredResponses.map((resp, idx) => {
                      // Calculate overall mean for this respondent
                      const scores = Object.values(resp.answers);
                      const mean = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

                      return (
                        <tr key={resp.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-600">{idx + 1}</td>
                          <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                            {new Date(resp.submittedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' })}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {resp.respondent.nama || <span className="text-slate-400 font-normal italic">(Anonim)</span>}
                          </td>
                          <td className="py-3 px-4 text-slate-700 font-medium">
                            {resp.respondent.asalMadrasah}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            <div>{resp.respondent.statusKepegawaian || '-'}</div>
                            <div className="text-[11px] text-slate-400">{resp.respondent.masaKerja} • {resp.respondent.sertifikasiPendidik}</div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                              {mean.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setSelectedResponse(resp)}
                                className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Lihat Detail Jawaban"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => PdfService.exportSingleRespondentPdf(thesisInfo, categories, questions, resp)}
                                className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Unduh PDF Lembar Jawaban Guru Ini"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteResponse(resp.id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Hapus Responden Ini"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KELOLA BUTIR SOAL (CRUD) */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Daftar Butir Pernyataan Kuesioner ({questions.length} Butir)
              </h3>
              <p className="text-xs text-slate-500">
                Anda dapat menambah, memperbarui teks, atau menghapus butir instrumen penelitian.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingQuestion(null);
                setNewQuestionCategory(categories[0]?.id || '');
                setNewQuestionStatement('');
                setShowAddQuestionModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Butir Soal Baru</span>
            </button>
          </div>

          {/* Grouped by category */}
          <div className="space-y-6">
            {categories.map((cat) => {
              const catQuestions = questions.filter(q => q.categoryId === cat.id);

              return (
                <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="bg-slate-100/80 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {cat.code}. {cat.name}
                      </span>
                      <span className="text-xs text-slate-500 ml-2">({catQuestions.length} butir)</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">
                      {cat.variableType}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {catQuestions.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        Belum ada butir soal dalam variabel ini.
                      </div>
                    ) : (
                      catQuestions.map((q, idx) => (
                        <div key={q.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-md bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {q.number || (idx + 1)}
                            </span>
                            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                              {q.statement}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleOpenEditQuestion(q)}
                              className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit Butir Ini"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Hapus Butir Ini"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: KELOLA KATEGORI / VARIABEL (CRUD) */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Variabel & Kategori Kuesioner ({categories.length} Variabel)
              </h3>
              <p className="text-xs text-slate-500">
                Atur kode variabel tesis (misal X1, X2, Z, Y) dan keterangannya.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingCategory(null);
                setNewCatCode('');
                setNewCatName('');
                setNewCatType('Independen (X1)');
                setNewCatDesc('');
                setShowAddCategoryModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Tambah Variabel Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => {
              const count = questions.filter(q => q.categoryId === cat.id).length;
              return (
                <div key={cat.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-extrabold bg-slate-900 text-white px-2 py-0.5 rounded">
                        {cat.code}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {cat.variableType}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{cat.name}</h4>
                    {cat.description && (
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-semibold">
                      {count} Butir Pertanyaan
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditCategory(cat)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: PENGATURAN TESIS & DATA RESET */}
      {activeTab === 'thesis' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveThesisSettings} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
              Informasi Penelitian & Kop Surat Resmi
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Tesis</label>
              <textarea
                rows={2}
                value={tempThesis.title}
                onChange={(e) => setTempThesis({ ...tempThesis, title: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sub Judul (Lokasi Studi)</label>
                <input
                  type="text"
                  value={tempThesis.subtitle}
                  onChange={(e) => setTempThesis({ ...tempThesis, subtitle: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Peneliti</label>
                <input
                  type="text"
                  value={tempThesis.researcherName}
                  onChange={(e) => setTempThesis({ ...tempThesis, researcherName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Program Studi</label>
                <input
                  type="text"
                  value={tempThesis.programStudy}
                  onChange={(e) => setTempThesis({ ...tempThesis, programStudy: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Perguruan Tinggi / Institusi</label>
                <input
                  type="text"
                  value={tempThesis.institution}
                  onChange={(e) => setTempThesis({ ...tempThesis, institution: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Surat Permohonan Pengantar Kuesioner</label>
              <textarea
                rows={5}
                value={tempThesis.greetingNote}
                onChange={(e) => setTempThesis({ ...tempThesis, greetingNote: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 font-serif"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {thesisSavedNotice ? (
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Pengaturan berhasil disimpan!
                </span>
              ) : <div />}

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Simpan Perubahan Tesis
              </button>
            </div>
          </form>

          {/* Admin Account & Security Settings */}
          <form onSubmit={handleSaveAccount} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <KeyRound className="w-4 h-4 text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">
                Keamanan & Akun Login Admin
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Ubah username atau password yang digunakan untuk mengakses Panel Admin & Rekapitulasi Data Tesis.
            </p>

            {accountNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{accountNotice}</span>
              </div>
            )}

            {accountError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{accountError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Username Admin</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={accountUsername}
                    onChange={(e) => setAccountUsername(e.target.value)}
                    placeholder="Username admin..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password Baru (Opsional)</label>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={accountNewPassword}
                    onChange={(e) => setAccountNewPassword(e.target.value)}
                    placeholder="Kosongkan jika tidak diubah"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Konfirmasi Password Baru</label>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={accountConfirmPassword}
                    onChange={(e) => setAccountConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
              >
                Perbarui Akun Admin
              </button>
            </div>
          </form>

          {/* Reset Box */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-rose-900">
              Reset Data Instrumen Sesuai Dokumen Tesis
            </h4>
            <p className="text-xs text-rose-700 mt-1 max-w-2xl leading-relaxed">
              Jika Anda ingin mengembalikan seluruh butir soal (24 butir), variabel (X1, X2, Z, Y), dan data default seperti awal dari dokumen Word/PDF Bapak Nana Permana, klik tombol di bawah.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleResetToDefaultData}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ke Data Asli Dokumen Tesis</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT QUESTION */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-base">
                {editingQuestion ? 'Edit Butir Pernyataan' : 'Tambah Butir Pernyataan Baru'}
              </h4>
              <button
                onClick={() => setShowAddQuestionModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Kategori Variabel
                </label>
                <select
                  value={newQuestionCategory}
                  onChange={(e) => setNewQuestionCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name} ({c.variableType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kalimat Pernyataan Kuesioner
                </label>
                <textarea
                  rows={4}
                  value={newQuestionStatement}
                  onChange={(e) => setNewQuestionStatement(e.target.value)}
                  placeholder="Ketikkan teks butir pernyataan kuesioner..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  required
                  autoFocus
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Gunakan kalimat indikator yang jelas dan dapat dinilai dengan skala Likert (1=STS s.d 5=SS).
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm"
                >
                  Simpan Butir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CATEGORY */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-base">
                {editingCategory ? 'Edit Kategori Variabel' : 'Tambah Kategori Variabel Baru'}
              </h4>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kode Variabel (misal: X1, X2, Z, Y)
                  </label>
                  <input
                    type="text"
                    value={newCatCode}
                    onChange={(e) => setNewCatCode(e.target.value)}
                    placeholder="Contoh: X3"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipe Variabel
                  </label>
                  <select
                    value={newCatType}
                    onChange={(e) => setNewCatType(e.target.value as QuestionCategory['variableType'])}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Independen (X1)">Independen (X1)</option>
                    <option value="Independen (X2)">Independen (X2)</option>
                    <option value="Mediasi (Z)">Mediasi (Z)</option>
                    <option value="Dependen (Y)">Dependen (Y)</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Variabel
                </label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Contoh: Iklim Budaya Organisasi"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi / Keterangan Variabel
                </label>
                <textarea
                  rows={3}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Keterangan singkat variabel ini..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm"
                >
                  Simpan Variabel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW SINGLE RESPONDENT DETAILS */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  Lembar Jawaban Guru: {selectedResponse.respondent.nama || '(Anonim)'}
                </h4>
                <p className="text-xs text-slate-500">
                  {selectedResponse.respondent.asalMadrasah} • {new Date(selectedResponse.submittedAt).toLocaleString('id-ID')}
                </p>
              </div>
              <button
                onClick={() => setSelectedResponse(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Demographics details */}
            <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs grid grid-cols-2 gap-2">
              <div><span className="text-slate-500">Jenis Kelamin:</span> <strong>{selectedResponse.respondent.jenisKelamin}</strong></div>
              <div><span className="text-slate-500">Usia:</span> <strong>{selectedResponse.respondent.usia}</strong></div>
              <div><span className="text-slate-500">Pendidikan:</span> <strong>{selectedResponse.respondent.pendidikanTerakhir}</strong></div>
              <div><span className="text-slate-500">Status Kepegawaian:</span> <strong>{selectedResponse.respondent.statusKepegawaian}</strong></div>
              <div><span className="text-slate-500">Masa Kerja:</span> <strong>{selectedResponse.respondent.masaKerja}</strong></div>
              <div><span className="text-slate-500">Sertifikasi:</span> <strong>{selectedResponse.respondent.sertifikasiPendidik}</strong></div>
            </div>

            {/* Answers Table */}
            <div className="space-y-4">
              {categories.map((cat) => {
                const catQuestions = questions.filter(q => q.categoryId === cat.id);
                return (
                  <div key={cat.id} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-800">
                      {cat.code} - {cat.name}
                    </div>
                    <div className="divide-y divide-slate-100 text-xs">
                      {catQuestions.map((q) => {
                        const score = selectedResponse.answers[q.id];
                        const opt = LIKERT_OPTIONS.find(o => o.value === score);
                        return (
                          <div key={q.id} className="p-2.5 flex items-center justify-between gap-3">
                            <span className="text-slate-700 flex-1">{q.number}. {q.statement}</span>
                            <span className="font-extrabold px-2 py-0.5 rounded text-white text-[11px] shrink-0" style={{
                              backgroundColor: score >= 4 ? '#059669' : score === 3 ? '#d97706' : '#e11d48'
                            }}>
                              {opt?.label} ({score})
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => handleDeleteResponse(selectedResponse.id)}
                className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold"
              >
                Hapus Responden
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => PdfService.exportSingleRespondentPdf(thesisInfo, categories, questions, selectedResponse)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Lembar Ini (PDF)</span>
                </button>
                <button
                  onClick={() => setSelectedResponse(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
