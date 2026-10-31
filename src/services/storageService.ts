import { ThesisInfo, QuestionCategory, QuestionItem, SurveyResponse } from '../types';

export const INITIAL_THESIS_INFO: ThesisInfo = {
  title: 'PENGARUH KOMPENSASI FINANSIAL DAN NONFINANSIAL SERTA KEPEMIMPINAN KEPALA MADRASAH TERHADAP TURNOVER INTENTION GURU DENGAN KEPUASAN KERJA SEBAGAI VARIABEL MEDIASI',
  subtitle: '(Studi pada Guru di Beberapa MTs Swasta Kabupaten Sumedang)',
  researcherName: 'Nana Permana',
  programStudy: 'Magister Manajemen Pendidikan Islam (MPI)',
  institution: 'Pascasarjana Universitas Wahid Hasyim Semarang',
  greetingNote: `Kepada Yth.
Bapak/Ibu Guru MTs Swasta di Tempat

Assalamu’alaikum Wr. Wb.
Dengan hormat,
Dalam rangka penyusunan tesis pada Program Studi Magister Manajemen Pendidikan Islam (MPI) Pascasarjana Universitas Wahid Hasyim Semarang, saya yang bertanda tangan di bawah ini bermaksud memohon kesediaan Bapak/Ibu guru untuk meluangkan waktu sejenak mengisi kuesioner penelitian ini.

Kuesioner ini bertujuan untuk mengkaji secara empiris hubungan antara kompensasi finansial dan nonfinansial, kepemimpinan kepala madrasah, kepuasan kerja, serta kaitannya dengan turnover intention tenaga pendidik di madrasah swasta. Data dan informasi yang Bapak/Ibu berikan semata-mata digunakan untuk kepentingan riset akademis, dan kerahasiaan identitas Bapak/Ibu dijamin sepenuhnya.

Atas partisipasi, kesediaan, dan waktu yang diluangkan, saya sampaikan terima kasih yang sebesar-besarnya.
Wassalamu’alaikum Wr. Wb.`,
  instructionNote: 'Mohon berikan tanda pilihan pada salah satu kolom alternatif jawaban yang paling menggambarkan keadaan atau penilaian Bapak/Ibu yang sebenarnya.',
  closingNote: 'Terima kasih atas partisipasi dan kesediaan Bapak/Ibu guru dalam mengisi kuesioner ini secara objektif dan lengkap.'
};

export const INITIAL_CATEGORIES: QuestionCategory[] = [
  {
    id: 'cat_x1',
    code: 'X1',
    name: 'Kompensasi Finansial dan Nonfinansial',
    variableType: 'Independen (X1)',
    description: 'Menilai kesesuaian gaji, ketepatan waktu, insentif, sarana mengajar, dan kesempatan pengembangan diri.',
    order: 1
  },
  {
    id: 'cat_x2',
    code: 'X2',
    name: 'Kepemimpinan Kepala Madrasah',
    variableType: 'Independen (X2)',
    description: 'Menilai pengarahan tugas, keteladanan disiplin, keterbukaan kritik, komunikasi harmonis, dan motivasi dari kepala madrasah.',
    order: 2
  },
  {
    id: 'cat_z',
    code: 'Z',
    name: 'Kepuasan Kerja Guru',
    variableType: 'Mediasi (Z)',
    description: 'Menilai kepuasan terhadap sistem kerja, iklim organisasi, relasi rekan kerja, apresiasi, serta kenyamanan profesi.',
    order: 3
  },
  {
    id: 'cat_y',
    code: 'Y',
    name: 'Turnover Intention Guru',
    variableType: 'Dependen (Y)',
    description: 'Menilai kecenderungan atau keinginan guru untuk berhenti mengajar, mencari peluang lain, atau beralih ke sekolah negeri.',
    order: 4
  }
];

export const INITIAL_QUESTIONS: QuestionItem[] = [
  // X1: 8 items
  {
    id: 'q_x1_1',
    categoryId: 'cat_x1',
    number: 1,
    statement: 'Gaji atau honorarium bulanan yang saya terima sudah sesuai dengan beban kerja dan tugas mengajar di madrasah.'
  },
  {
    id: 'q_x1_2',
    categoryId: 'cat_x1',
    number: 2,
    statement: 'Gaji atau honorarium yang saya terima selalu dibayarkan tepat waktu oleh pihak madrasah/yayasan.'
  },
  {
    id: 'q_x1_3',
    categoryId: 'cat_x1',
    number: 3,
    statement: 'Insentif atau tunjangan tambahan yang diberikan oleh madrasah sudah memadai dan transparan.'
  },
  {
    id: 'q_x1_4',
    categoryId: 'cat_x1',
    number: 4,
    statement: 'Sistem pemberian honor/insentif tambahan di madrasah ini didasarkan pada keadilan kontribusi jam mengajar.'
  },
  {
    id: 'q_x1_5',
    categoryId: 'cat_x1',
    number: 5,
    statement: 'Pihak madrasah menyediakan fasilitas kerja dan sarana mengajar yang mendukung kelancaran tugas guru.'
  },
  {
    id: 'q_x1_6',
    categoryId: 'cat_x1',
    number: 6,
    statement: 'Pihak madrasah memberikan perhatian terhadap kenyamanan kondisi lingkungan kerja bagi para guru.'
  },
  {
    id: 'q_x1_7',
    categoryId: 'cat_x1',
    number: 7,
    statement: 'Madrasah memberikan penghargaan (apresiasi/pujian) atas dedikasi dan prestasi kerja guru.'
  },
  {
    id: 'q_x1_8',
    categoryId: 'cat_x1',
    number: 8,
    statement: 'Madrasah memberikan kesempatan yang adil bagi guru untuk mengikuti pelatihan, seminar, dan pengembangan kompetensi diri.'
  },

  // X2: 6 items
  {
    id: 'q_x2_1',
    categoryId: 'cat_x2',
    number: 1,
    statement: 'Kepala madrasah memberikan pengarahan yang jelas mengenai tugas pokok, fungsi, dan target program madrasah.'
  },
  {
    id: 'q_x2_2',
    categoryId: 'cat_x2',
    number: 2,
    statement: 'Kepala madrasah menunjukkan kedisiplinan dan menjadi teladan yang baik bagi seluruh dewan guru.'
  },
  {
    id: 'q_x2_3',
    categoryId: 'cat_x2',
    number: 3,
    statement: 'Kepala madrasah bersikap terbuka dalam menerima kritik, masukan, dan aspirasi dari para guru.'
  },
  {
    id: 'q_x2_4',
    categoryId: 'cat_x2',
    number: 4,
    statement: 'Kepala madrasah menjalin komunikasi yang komunikatif dan harmonis dengan dewan guru.'
  },
  {
    id: 'q_x2_5',
    categoryId: 'cat_x2',
    number: 5,
    statement: 'Kepala madrasah aktif memberikan motivasi, semangat, dan dorongan moral dalam meningkatkan kualitas kinerja guru.'
  },
  {
    id: 'q_x2_6',
    categoryId: 'cat_x2',
    number: 6,
    statement: 'Kepala madrasah peduli dan responsif terhadap kesulitan maupun kebutuhan profesional yang dihadapi para guru.'
  },

  // Z: 5 items
  {
    id: 'q_z_1',
    categoryId: 'cat_z',
    number: 1,
    statement: 'Secara keseluruhan, saya merasa puas dengan sistem kerja, peraturan, dan iklim organisasi di madrasah ini.'
  },
  {
    id: 'q_z_2',
    categoryId: 'cat_z',
    number: 2,
    statement: 'Saya merasa puas dengan imbalan dan apresiasi yang diberikan oleh pihak madrasah atas kerja keras saya.'
  },
  {
    id: 'q_z_3',
    categoryId: 'cat_z',
    number: 3,
    statement: 'Saya memiliki hubungan kerja yang harmonis, saling menghargai, dan saling mendukung dengan sesama rekan guru.'
  },
  {
    id: 'q_z_4',
    categoryId: 'cat_z',
    number: 4,
    statement: 'Saya merasa puas dengan perhatian dan bimbingan yang diberikan oleh kepala madrasah.'
  },
  {
    id: 'q_z_5',
    categoryId: 'cat_z',
    number: 5,
    statement: 'Saya merasa nyaman, tenang, dan bangga menjalankan profesi mengajar di madrasah tempat saya mengajar saat ini.'
  },

  // Y: 5 items
  {
    id: 'q_y_1',
    categoryId: 'cat_y',
    number: 1,
    statement: 'Saya pernah atau sering memikirkan untuk berhenti mengajar di madrasah tempat saya bekerja saat ini.'
  },
  {
    id: 'q_y_2',
    categoryId: 'cat_y',
    number: 2,
    statement: 'Saya aktif mencari informasi mengenai peluang pekerjaan atau posisi mengajar di lembaga lain.'
  },
  {
    id: 'q_y_3',
    categoryId: 'cat_y',
    number: 3,
    statement: 'Saya berencana atau mempertimbangkan untuk mengikuti seleksi ASN/PPPK di sekolah negeri demi masa depan yang lebih baik.'
  },
  {
    id: 'q_y_4',
    categoryId: 'cat_y',
    number: 4,
    statement: 'Jika ada kesempatan atau tawaran mengajar di instansi lain yang menawarkan penghasilan/fasilitas lebih tinggi, saya berniat untuk pindah.'
  },
  {
    id: 'q_y_5',
    categoryId: 'cat_y',
    number: 5,
    statement: 'Saya merasa masa depan karier saya lebih menjanjikan jika berpindah ke instansi pendidikan negeri dibanding bertahan di madrasah swasta.'
  }
];

export const INITIAL_RESPONSES: SurveyResponse[] = [
  {
    id: 'resp_demo_1',
    submittedAt: '2026-10-28T09:15:00.000Z',
    respondent: {
      nama: 'Ahmad Fauzi, S.Pd.',
      asalMadrasah: 'MTs Swasta Asy-Syifaa Simpen Sumedang',
      jenisKelamin: 'Laki-laki',
      usia: '30 – 40 Tahun',
      pendidikanTerakhir: 'S1',
      statusKepegawaian: 'Guru Tetap Yayasan (GTY)',
      masaKerja: '6 – 10 Tahun',
      sertifikasiPendidik: 'Sudah Bersertifikasi'
    },
    answers: {
      q_x1_1: 4, q_x1_2: 4, q_x1_3: 3, q_x1_4: 4, q_x1_5: 4, q_x1_6: 5, q_x1_7: 4, q_x1_8: 4,
      q_x2_1: 5, q_x2_2: 4, q_x2_3: 4, q_x2_4: 5, q_x2_5: 4, q_x2_6: 4,
      q_z_1: 4, q_z_2: 4, q_z_3: 5, q_z_4: 4, q_z_5: 4,
      q_y_1: 2, q_y_2: 2, q_y_3: 3, q_y_4: 2, q_y_5: 2
    }
  },
  {
    id: 'resp_demo_2',
    submittedAt: '2026-10-28T10:42:00.000Z',
    respondent: {
      nama: 'Siti Rohmah, M.Pd.',
      asalMadrasah: 'MTs Al-Irfan Tanjungsari',
      jenisKelamin: 'Perempuan',
      usia: '41 – 50 Tahun',
      pendidikanTerakhir: 'S2',
      statusKepegawaian: 'Guru Tetap Yayasan (GTY)',
      masaKerja: '> 10 Tahun',
      sertifikasiPendidik: 'Sudah Bersertifikasi'
    },
    answers: {
      q_x1_1: 3, q_x1_2: 4, q_x1_3: 3, q_x1_4: 3, q_x1_5: 4, q_x1_6: 4, q_x1_7: 3, q_x1_8: 4,
      q_x2_1: 4, q_x2_2: 4, q_x2_3: 4, q_x2_4: 4, q_x2_5: 4, q_x2_6: 4,
      q_z_1: 4, q_z_2: 3, q_z_3: 5, q_z_4: 4, q_z_5: 4,
      q_y_1: 1, q_y_2: 2, q_y_3: 2, q_y_4: 2, q_y_5: 2
    }
  },
  {
    id: 'resp_demo_3',
    submittedAt: '2026-10-29T08:20:00.000Z',
    respondent: {
      nama: '', // Anonim
      asalMadrasah: 'MTs Ma\'arif Cimalaka',
      jenisKelamin: 'Laki-laki',
      usia: '< 30 Tahun',
      pendidikanTerakhir: 'S1',
      statusKepegawaian: 'Guru Tidak Tetap (GTT) / Guru Honorer',
      masaKerja: '< 2 Tahun',
      sertifikasiPendidik: 'Belum Bersertifikasi'
    },
    answers: {
      q_x1_1: 2, q_x1_2: 3, q_x1_3: 2, q_x1_4: 2, q_x1_5: 3, q_x1_6: 3, q_x1_7: 3, q_x1_8: 2,
      q_x2_1: 3, q_x2_2: 3, q_x2_3: 2, q_x2_4: 3, q_x2_5: 3, q_x2_6: 3,
      q_z_1: 3, q_z_2: 2, q_z_3: 4, q_z_4: 3, q_z_5: 3,
      q_y_1: 4, q_y_2: 4, q_y_3: 5, q_y_4: 5, q_y_5: 4
    }
  },
  {
    id: 'resp_demo_4',
    submittedAt: '2026-10-29T13:05:00.000Z',
    respondent: {
      nama: 'Dedi Kurniawan, S.Pd.I.',
      asalMadrasah: 'MTs Darul Hikmah Tanjungkerta',
      jenisKelamin: 'Laki-laki',
      usia: '30 – 40 Tahun',
      pendidikanTerakhir: 'S1',
      statusKepegawaian: 'Guru Tetap Yayasan (GTY)',
      masaKerja: '2 – 5 Tahun',
      sertifikasiPendidik: 'Belum Bersertifikasi'
    },
    answers: {
      q_x1_1: 3, q_x1_2: 4, q_x1_3: 3, q_x1_4: 3, q_x1_5: 4, q_x1_6: 4, q_x1_7: 4, q_x1_8: 3,
      q_x2_1: 4, q_x2_2: 5, q_x2_3: 4, q_x2_4: 4, q_x2_5: 4, q_x2_6: 4,
      q_z_1: 4, q_z_2: 3, q_z_3: 4, q_z_4: 4, q_z_5: 4,
      q_y_1: 2, q_y_2: 3, q_y_3: 4, q_y_4: 3, q_y_5: 3
    }
  },
  {
    id: 'resp_demo_5',
    submittedAt: '2026-10-30T11:30:00.000Z',
    respondent: {
      nama: 'Neneng Maryati, S.Ag.',
      asalMadrasah: 'MTs Muhammadiyah Sumedang',
      jenisKelamin: 'Perempuan',
      usia: '41 – 50 Tahun',
      pendidikanTerakhir: 'S1',
      statusKepegawaian: 'Guru Tetap Yayasan (GTY)',
      masaKerja: '6 – 10 Tahun',
      sertifikasiPendidik: 'Sudah Bersertifikasi'
    },
    answers: {
      q_x1_1: 4, q_x1_2: 5, q_x1_3: 3, q_x1_4: 4, q_x1_5: 4, q_x1_6: 4, q_x1_7: 4, q_x1_8: 4,
      q_x2_1: 5, q_x2_2: 4, q_x2_3: 4, q_x2_4: 5, q_x2_5: 5, q_x2_6: 4,
      q_z_1: 4, q_z_2: 4, q_z_3: 5, q_z_4: 4, q_z_5: 5,
      q_y_1: 1, q_y_2: 1, q_y_3: 2, q_y_4: 2, q_y_5: 2
    }
  }
];

const STORAGE_KEYS = {
  THESIS_INFO: 'tesis_info_data',
  CATEGORIES: 'tesis_categories_data',
  QUESTIONS: 'tesis_questions_data',
  RESPONSES: 'tesis_responses_data',
  ADMIN_PIN: 'tesis_admin_pin'
};

export const StorageService = {
  getThesisInfo(): ThesisInfo {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.THESIS_INFO);
      return data ? JSON.parse(data) : INITIAL_THESIS_INFO;
    } catch {
      return INITIAL_THESIS_INFO;
    }
  },

  saveThesisInfo(info: ThesisInfo): void {
    localStorage.setItem(STORAGE_KEYS.THESIS_INFO, JSON.stringify(info));
  },

  getCategories(): QuestionCategory[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a: QuestionCategory, b: QuestionCategory) => a.order - b.order);
        }
      }
      return INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  saveCategories(categories: QuestionCategory[]): void {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  saveCategory(category: QuestionCategory): void {
    const list = this.getCategories();
    const index = list.findIndex(c => c.id === category.id);
    if (index >= 0) {
      list[index] = category;
    } else {
      list.push(category);
    }
    this.saveCategories(list);
  },

  deleteCategory(categoryId: string): void {
    const list = this.getCategories().filter(c => c.id !== categoryId);
    this.saveCategories(list);
    // Also remove questions in this category
    const questions = this.getQuestions().filter(q => q.categoryId !== categoryId);
    this.saveQuestions(questions);
  },

  getQuestions(): QuestionItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a: QuestionItem, b: QuestionItem) => a.number - b.number);
        }
      }
      return INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  },

  saveQuestions(questions: QuestionItem[]): void {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  },

  saveQuestion(question: QuestionItem): void {
    const list = this.getQuestions();
    const index = list.findIndex(q => q.id === question.id);
    if (index >= 0) {
      list[index] = question;
    } else {
      list.push(question);
    }
    this.saveQuestions(list);
  },

  deleteQuestion(questionId: string): void {
    const list = this.getQuestions().filter(q => q.id !== questionId);
    this.saveQuestions(list);
  },

  getResponses(): SurveyResponse[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESPONSES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed.sort((a: SurveyResponse, b: SurveyResponse) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        }
      }
      // First time initialization with demo data so UI is rich
      this.saveResponses(INITIAL_RESPONSES);
      return INITIAL_RESPONSES;
    } catch {
      return INITIAL_RESPONSES;
    }
  },

  saveResponses(responses: SurveyResponse[]): void {
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(responses));
  },

  addResponse(response: SurveyResponse): void {
    const list = this.getResponses();
    list.unshift(response);
    this.saveResponses(list);
  },

  deleteResponse(id: string): void {
    const list = this.getResponses().filter(r => r.id !== id);
    this.saveResponses(list);
  },

  clearAllResponses(): void {
    this.saveResponses([]);
  },

  resetAllToDefault(): void {
    localStorage.setItem(STORAGE_KEYS.THESIS_INFO, JSON.stringify(INITIAL_THESIS_INFO));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(INITIAL_RESPONSES));
  },

  getAdminCredentials(): { username: string; password: string } {
    try {
      const data = localStorage.getItem('tesis_admin_credentials');
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    return {
      username: 'admin',
      password: 'admin123'
    };
  },

  saveAdminCredentials(creds: { username: string; password: string }): void {
    localStorage.setItem('tesis_admin_credentials', JSON.stringify(creds));
  }
};
