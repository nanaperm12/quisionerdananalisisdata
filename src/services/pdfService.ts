import { jsPDF } from 'jspdf';
import { ThesisInfo, QuestionCategory, QuestionItem, SurveyResponse } from '../types';
import { CompleteAnalysisReport } from './statsEngine';

export const PdfService = {
  /**
   * Export comprehensive thesis research survey recapitulation as PDF
   */
  exportRecapPdf(
    thesisInfo: ThesisInfo,
    categories: QuestionCategory[],
    questions: QuestionItem[],
    responses: SurveyResponse[]
  ): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    // Helper to check page break
    const checkAddPage = (neededHeight: number) => {
      if (y + neededHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // Header / Kop Surat
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.text(thesisInfo.institution.toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 5;
    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    doc.text(thesisInfo.programStudy, pageWidth / 2, y, { align: 'center' });
    y += 5;
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text('LEMBAR REKAPITULASI HASIL PENGISIAN KUESIONER PENELITIAN TESIS', pageWidth / 2, y, { align: 'center' });
    y += 3;

    // Line separator
    doc.setDrawColor(40, 40, 40);
    doc.setLineWidth(0.6);
    doc.line(margin, y, pageWidth - margin, y);
    y += 1;
    doc.setLineWidth(0.2);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    // Judul Tesis Box
    doc.setTextColor(20, 20, 20);
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.text('JUDUL PENELITIAN:', margin, y);
    y += 4;
    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    const splitTitle = doc.splitTextToSize(thesisInfo.title + ' ' + thesisInfo.subtitle, contentWidth);
    doc.text(splitTitle, margin, y);
    y += (splitTitle.length * 4) + 2;

    doc.setFont('times', 'bold');
    doc.text(`Peneliti: ${thesisInfo.researcherName}  |  Total Responden: ${responses.length} Guru  |  Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, y);
    y += 7;

    // Section 1: Demografi Responden
    doc.setFillColor(240, 243, 246);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(20, 40, 70);
    doc.text('1. DISTRIBUSI DEMOGRAFI RESPONDEN (N = ' + responses.length + ')', margin + 2, y + 4.2);
    y += 8;

    // Calculate demographic stats
    const genderCount = { 'Laki-laki': 0, 'Perempuan': 0 };
    const ageCount: Record<string, number> = {};
    const eduCount: Record<string, number> = {};
    const statusCount: Record<string, number> = {};
    const certCount: Record<string, number> = {};

    responses.forEach(r => {
      if (r.respondent.jenisKelamin) {
        genderCount[r.respondent.jenisKelamin as keyof typeof genderCount] = (genderCount[r.respondent.jenisKelamin as keyof typeof genderCount] || 0) + 1;
      }
      if (r.respondent.usia) ageCount[r.respondent.usia] = (ageCount[r.respondent.usia] || 0) + 1;
      if (r.respondent.pendidikanTerakhir) eduCount[r.respondent.pendidikanTerakhir] = (eduCount[r.respondent.pendidikanTerakhir] || 0) + 1;
      if (r.respondent.statusKepegawaian) statusCount[r.respondent.statusKepegawaian] = (statusCount[r.respondent.statusKepegawaian] || 0) + 1;
      if (r.respondent.sertifikasiPendidik) certCount[r.respondent.sertifikasiPendidik] = (certCount[r.respondent.sertifikasiPendidik] || 0) + 1;
    });

    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 30, 30);

    const demoLines = [
      `• Jenis Kelamin: Laki-laki = ${genderCount['Laki-laki'] || 0} (${responses.length ? Math.round((genderCount['Laki-laki'] || 0) / responses.length * 100) : 0}%), Perempuan = ${genderCount['Perempuan'] || 0} (${responses.length ? Math.round((genderCount['Perempuan'] || 0) / responses.length * 100) : 0}%)`,
      `• Pendidikan: S1 = ${eduCount['S1'] || 0}, S2 = ${eduCount['S2'] || 0}, Lainnya = ${eduCount['Lainnya'] || 0}`,
      `• Status Guru: GTY = ${statusCount['Guru Tetap Yayasan (GTY)'] || 0}, GTT/Honorer = ${statusCount['Guru Tidak Tetap (GTT) / Guru Honorer'] || 0}`,
      `• Sertifikasi: Sudah = ${certCount['Sudah Bersertifikasi'] || 0}, Belum = ${certCount['Belum Bersertifikasi'] || 0}`
    ];

    demoLines.forEach(line => {
      doc.text(line, margin + 2, y);
      y += 4;
    });
    y += 3;

    // Section 2: Ringkasan Nilai Rata-rata Variabel (Mean & Kategori)
    checkAddPage(25);
    doc.setFillColor(240, 243, 246);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(20, 40, 70);
    doc.text('2. REKAPITULASI RATA-RATA SKOR PER VARIABEL', margin + 2, y + 4.2);
    y += 8;

    // Table header
    doc.setFillColor(225, 232, 240);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(20, 20, 20);
    doc.text('Kode', margin + 2, y + 4.2);
    doc.text('Nama Variabel', margin + 20, y + 4.2);
    doc.text('Jumlah Butir', margin + 105, y + 4.2);
    doc.text('Total Skor', margin + 128, y + 4.2);
    doc.text('Mean (1-5)', margin + 148, y + 4.2);
    doc.text('Interpretasi', margin + 168, y + 4.2);
    y += 6;

    categories.forEach(cat => {
      checkAddPage(6);
      const catQuestions = questions.filter(q => q.categoryId === cat.id);
      let totalCatScore = 0;
      let countAnswers = 0;

      responses.forEach(resp => {
        catQuestions.forEach(q => {
          if (resp.answers[q.id]) {
            totalCatScore += resp.answers[q.id];
            countAnswers++;
          }
        });
      });

      const meanScore = countAnswers > 0 ? (totalCatScore / countAnswers) : 0;
      let interpretation = 'Cukup / Sedang';
      if (meanScore >= 4.2) interpretation = 'Sangat Tinggi / Sangat Baik';
      else if (meanScore >= 3.4) interpretation = 'Tinggi / Baik';
      else if (meanScore >= 2.6) interpretation = 'Sedang / Netral';
      else if (meanScore >= 1.8) interpretation = 'Rendah / Kurang';
      else if (meanScore > 0) interpretation = 'Sangat Rendah';

      doc.setFont('times', 'normal');
      doc.setFontSize(8);
      doc.text(cat.code, margin + 2, y + 4);
      doc.text(cat.name.substring(0, 48), margin + 20, y + 4);
      doc.text(catQuestions.length.toString(), margin + 112, y + 4);
      doc.text(totalCatScore.toString(), margin + 133, y + 4);
      doc.setFont('times', 'bold');
      doc.text(meanScore.toFixed(2), margin + 152, y + 4);
      doc.setFont('times', 'normal');
      doc.text(interpretation, margin + 168, y + 4);

      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y + 5.5, pageWidth - margin, y + 5.5);
      y += 6;
    });

    y += 5;

    // Section 3: Detail Skor Tiap Butir Pertanyaan
    checkAddPage(30);
    doc.setFillColor(240, 243, 246);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(20, 40, 70);
    doc.text('3. DISTRIBUSI FREKUENSI SKOR PER BUTIR PERNYATAAN (SKALA LIKERT 1-5)', margin + 2, y + 4.2);
    y += 8;

    categories.forEach(cat => {
      const catQuestions = questions.filter(q => q.categoryId === cat.id);
      if (catQuestions.length === 0) return;

      checkAddPage(18);
      // Category subheader
      doc.setFont('times', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 60, 110);
      doc.text(`${cat.code} - ${cat.name}`, margin, y);
      y += 4;

      // Table header for items
      doc.setFillColor(235, 240, 245);
      doc.rect(margin, y, contentWidth, 5, 'F');
      doc.setFont('times', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(40, 40, 40);
      doc.text('No', margin + 2, y + 3.5);
      doc.text('Pernyataan Butir Kuesioner', margin + 10, y + 3.5);
      doc.text('STS(1)', margin + 118, y + 3.5);
      doc.text('TS(2)', margin + 130, y + 3.5);
      doc.text('N(3)', margin + 141, y + 3.5);
      doc.text('S(4)', margin + 152, y + 3.5);
      doc.text('SS(5)', margin + 163, y + 3.5);
      doc.text('Mean', margin + 175, y + 3.5);
      y += 5.5;

      catQuestions.forEach(q => {
        // Count distribution
        let sts = 0, ts = 0, n = 0, s = 0, ss = 0;
        let sum = 0;
        let answeredCount = 0;

        responses.forEach(resp => {
          const val = resp.answers[q.id];
          if (val === 1) sts++;
          else if (val === 2) ts++;
          else if (val === 3) n++;
          else if (val === 4) s++;
          else if (val === 5) ss++;
          if (val) {
            sum += val;
            answeredCount++;
          }
        });

        const mean = answeredCount > 0 ? (sum / answeredCount) : 0;
        const textLines = doc.splitTextToSize(`${q.statement}`, 104);
        const rowHeight = Math.max(5.5, textLines.length * 3.4 + 2);

        checkAddPage(rowHeight);

        doc.setFont('times', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(20, 20, 20);
        doc.text(`${q.number}`, margin + 2, y + 3.2);
        doc.text(textLines, margin + 10, y + 3.2);

        doc.text(sts.toString(), margin + 121, y + 3.2);
        doc.text(ts.toString(), margin + 133, y + 3.2);
        doc.text(n.toString(), margin + 144, y + 3.2);
        doc.text(s.toString(), margin + 155, y + 3.2);
        doc.text(ss.toString(), margin + 166, y + 3.2);
        doc.setFont('times', 'bold');
        doc.text(mean.toFixed(2), margin + 176, y + 3.2);

        doc.setDrawColor(230, 230, 230);
        doc.line(margin, y + rowHeight - 0.5, pageWidth - margin, y + rowHeight - 0.5);
        y += rowHeight;
      });

      y += 3;
    });

    // Signature section
    checkAddPage(30);
    y += 5;
    const signX = pageWidth - margin - 60;
    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(20, 20, 20);
    doc.text(`Sumedang / Semarang, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, signX, y);
    y += 4;
    doc.text('Peneliti / Mahasiswa Tesis,', signX, y);
    y += 18;
    doc.setFont('times', 'bold');
    doc.text(thesisInfo.researcherName, signX, y);
    y += 4;
    doc.setFont('times', 'normal');
    doc.text('NIM / Program Studi MPI', signX, y);

    // Save PDF
    doc.save(`Rekapitulasi_Kuesioner_Tesis_${thesisInfo.researcherName.replace(/\s+/g, '_')}.pdf`);
  },

  /**
   * Export single respondent survey sheet to PDF
   */
  exportSingleRespondentPdf(
    thesisInfo: ThesisInfo,
    categories: QuestionCategory[],
    questions: QuestionItem[],
    response: SurveyResponse
  ): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    const checkAddPage = (neededHeight: number) => {
      if (y + neededHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // Header
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.text('LEMBAR JAWABAN KUESIONER PENELITIAN TESIS (ARSIP RESPONDEN)', pageWidth / 2, y, { align: 'center' });
    y += 5;
    doc.setFontSize(9);
    doc.setFont('times', 'normal');
    doc.text(`${thesisInfo.programStudy} - ${thesisInfo.institution}`, pageWidth / 2, y, { align: 'center' });
    y += 4;

    doc.setDrawColor(40, 40, 40);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // Info Responden
    doc.setFillColor(245, 247, 250);
    doc.rect(margin, y, contentWidth, 24, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(8.5);
    doc.text('DATA IDENTITAS RESPONDEN:', margin + 3, y + 4.5);
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    
    const r = response.respondent;
    doc.text(`• Nama Responden: ${r.nama || '(Anonim / Tidak Disebutkan)'}`, margin + 3, y + 9);
    doc.text(`• Asal Madrasah: ${r.asalMadrasah || '-'}`, margin + 3, y + 13.5);
    doc.text(`• Jenis Kelamin: ${r.jenisKelamin || '-'}  |  Usia: ${r.usia || '-'}`, margin + 3, y + 18);
    doc.text(`• Pendidikan: ${r.pendidikanTerakhir || '-'}  |  Status: ${r.statusKepegawaian || '-'}  |  Masa Kerja: ${r.masaKerja || '-'}  |  Sertifikasi: ${r.sertifikasiPendidik || '-'}`, margin + 3, y + 22.5);
    y += 28;

    // Jawaban per kategori
    categories.forEach(cat => {
      const catQuestions = questions.filter(q => q.categoryId === cat.id);
      if (catQuestions.length === 0) return;

      checkAddPage(15);
      doc.setFont('times', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(20, 45, 90);
      doc.text(`${cat.code}. ${cat.name}`, margin, y);
      y += 4;

      doc.setFillColor(235, 240, 245);
      doc.rect(margin, y, contentWidth, 5, 'F');
      doc.setFont('times', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(40, 40, 40);
      doc.text('No', margin + 2, y + 3.5);
      doc.text('Pernyataan Kuesioner', margin + 10, y + 3.5);
      doc.text('Pilihan Jawaban Responden', margin + 140, y + 3.5);
      doc.text('Skor', margin + 172, y + 3.5);
      y += 5.5;

      catQuestions.forEach(q => {
        const score = response.answers[q.id];
        let label = '-';
        if (score === 1) label = 'Sangat Tidak Setuju (STS)';
        else if (score === 2) label = 'Tidak Setuju (TS)';
        else if (score === 3) label = 'Netral / Ragu-ragu (N)';
        else if (score === 4) label = 'Setuju (S)';
        else if (score === 5) label = 'Sangat Setuju (SS)';

        const textLines = doc.splitTextToSize(q.statement, 126);
        const rowHeight = Math.max(5.5, textLines.length * 3.4 + 2);

        checkAddPage(rowHeight);

        doc.setFont('times', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(20, 20, 20);
        doc.text(`${q.number}`, margin + 2, y + 3.2);
        doc.text(textLines, margin + 10, y + 3.2);
        doc.text(label, margin + 140, y + 3.2);
        doc.setFont('times', 'bold');
        doc.text(score ? score.toString() : '-', margin + 175, y + 3.2);

        doc.setDrawColor(230, 230, 230);
        doc.line(margin, y + rowHeight - 0.5, pageWidth - margin, y + rowHeight - 0.5);
        y += rowHeight;
      });

      y += 3;
    });

    const safeName = (response.respondent.nama || 'Responden').replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`Lembar_Kuesioner_${safeName}_${response.id.substring(0, 6)}.pdf`);
  },

  /**
   * Export tabulated responses ready for SPSS / SmartPLS / Excel
   */
  exportToCsv(
    thesisInfo: ThesisInfo,
    categories: QuestionCategory[],
    questions: QuestionItem[],
    responses: SurveyResponse[]
  ): void {
    const headers = [
      'ID_RESPON',
      'TANGGAL_PENGISIAN',
      'NAMA_LENGKAP',
      'ASAL_MADRASAH',
      'JENIS_KELAMIN',
      'USIA',
      'PENDIDIKAN_TERAKHIR',
      'STATUS_KEPEGAWAIAN',
      'MASA_KERJA',
      'STATUS_SERTIFIKASI'
    ];

    // Add question columns grouped by category
    categories.forEach(cat => {
      const catQuestions = questions.filter(q => q.categoryId === cat.id);
      catQuestions.forEach(q => {
        headers.push(`${cat.code}_${q.number}`);
      });
      headers.push(`TOTAL_${cat.code}`);
      headers.push(`MEAN_${cat.code}`);
    });

    const rows: string[][] = [];
    rows.push(headers);

    responses.forEach(r => {
      const row: string[] = [
        `"${r.id}"`,
        `"${new Date(r.submittedAt).toLocaleString('id-ID')}"`,
        `"${(r.respondent.nama || 'Anonim').replace(/"/g, '""')}"`,
        `"${(r.respondent.asalMadrasah || '').replace(/"/g, '""')}"`,
        `"${r.respondent.jenisKelamin || ''}"`,
        `"${r.respondent.usia || ''}"`,
        `"${r.respondent.pendidikanTerakhir || ''}"`,
        `"${r.respondent.statusKepegawaian || ''}"`,
        `"${r.respondent.masaKerja || ''}"`,
        `"${r.respondent.sertifikasiPendidik || ''}"`
      ];

      categories.forEach(cat => {
        const catQuestions = questions.filter(q => q.categoryId === cat.id);
        let catTotal = 0;
        let catCount = 0;

        catQuestions.forEach(q => {
          const score = r.answers[q.id] || 0;
          row.push(score ? score.toString() : '');
          if (score) {
            catTotal += score;
            catCount++;
          }
        });

        row.push(catTotal.toString());
        row.push(catCount > 0 ? (catTotal / catCount).toFixed(2) : '0.00');
      });

      rows.push(row);
    });

    const csvContent = '\uFEFF' + rows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Data_Tabulasi_Kuesioner_SPSS_${thesisInfo.researcherName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Export Complete Statistical & Hypothesis Testing Report (Bab IV Tesis)
   */
  exportStatisticalReportPdf(
    thesisInfo: ThesisInfo,
    report: CompleteAnalysisReport
  ): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    const checkAddPage = (neededHeight: number) => {
      if (y + neededHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // Header Kop Surat
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text(thesisInfo.institution.toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 5;
    doc.setFontSize(10.5);
    doc.setFont('times', 'normal');
    doc.text(thesisInfo.programStudy, pageWidth / 2, y, { align: 'center' });
    y += 4.5;
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(20, 60, 110);
    doc.text('LAPORAN HASIL ANALISIS STATISTIK & PENGUJIAN HIPOTESIS (BAB IV TESIS)', pageWidth / 2, y, { align: 'center' });
    y += 3;

    doc.setDrawColor(30, 30, 30);
    doc.setLineWidth(0.6);
    doc.line(margin, y, pageWidth - margin, y);
    y += 1;
    doc.setLineWidth(0.2);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    // Metadata
    doc.setTextColor(20, 20, 20);
    doc.setFont('times', 'bold');
    doc.setFontSize(8.5);
    doc.text(`Judul: ${thesisInfo.title} ${thesisInfo.subtitle}`, margin, y, { maxWidth: contentWidth });
    y += 8;
    doc.setFont('times', 'normal');
    doc.text(`Peneliti: ${thesisInfo.researcherName}  |  Sampel N = ${report.n} Guru  |  Tanggal: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, y);
    y += 6;

    // 1. Deskriptif & Reliabilitas
    doc.setFillColor(240, 243, 246);
    doc.rect(margin, y, contentWidth, 5.5, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 45, 90);
    doc.text('1. REKAPITULASI STATISTIK DESKRIPTIF & UJI RELIABILITAS (CRONBACH ALPHA)', margin + 2, y + 3.8);
    y += 7;

    doc.setFillColor(228, 233, 240);
    doc.rect(margin, y, contentWidth, 5, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 30, 30);
    doc.text('Kode', margin + 2, y + 3.5);
    doc.text('Nama Variabel', margin + 15, y + 3.5);
    doc.text('Mean', margin + 85, y + 3.5);
    doc.text('Std.Dev', margin + 102, y + 3.5);
    doc.text('TCR(%)', margin + 120, y + 3.5);
    doc.text('Cronbach α', margin + 138, y + 3.5);
    doc.text('Status Reliabilitas', margin + 160, y + 3.5);
    y += 5.5;

    report.descriptive.forEach(d => {
      checkAddPage(6);
      const rel = report.reliability.find(r => r.categoryCode === d.code);
      doc.setFont('times', 'normal');
      doc.setFontSize(7.5);
      doc.text(d.code, margin + 2, y + 3.5);
      doc.text(d.name.substring(0, 42), margin + 15, y + 3.5);
      doc.setFont('times', 'bold');
      doc.text(d.mean.toFixed(2), margin + 85, y + 3.5);
      doc.setFont('times', 'normal');
      doc.text(d.stdDev.toFixed(2), margin + 102, y + 3.5);
      doc.text(`${d.tcrPercent.toFixed(1)}%`, margin + 120, y + 3.5);
      doc.setFont('times', 'bold');
      doc.text(rel ? rel.cronbachAlpha.toFixed(3) : '-', margin + 140, y + 3.5);
      doc.setFont('times', 'normal');
      doc.text(rel ? (rel.isReliable ? 'RELIABEL (α > 0.7)' : 'Kurang') : '-', margin + 160, y + 3.5);

      doc.setDrawColor(230, 230, 230);
      doc.line(margin, y + 5, pageWidth - margin, y + 5);
      y += 5.5;
    });
    y += 4;

    // 2. Sub-Struktur 1
    checkAddPage(25);
    doc.setFillColor(240, 243, 246);
    doc.rect(margin, y, contentWidth, 5.5, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 45, 90);
    doc.text(`2. ANALISIS REGRESI SUB-STRUKTUR 1: ${report.subStructure1.modelName}`, margin + 2, y + 3.8);
    y += 7;

    doc.setFont('times', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(20, 20, 20);
    doc.text(`• Persamaan: ${report.subStructure1.equation}`, margin + 2, y);
    y += 3.5;
    doc.text(`• R = ${report.subStructure1.r.toFixed(3)}  |  R-Square (R²) = ${(report.subStructure1.rSquare * 100).toFixed(2)}%  |  F-hitung = ${report.subStructure1.fCount.toFixed(3)} (Sig = ${report.subStructure1.fPValue.toFixed(4)})`, margin + 2, y);
    y += 5;

    // Coefficients Sub 1
    doc.setFillColor(235, 240, 245);
    doc.rect(margin, y, contentWidth, 4.5, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(7);
    doc.text('Variabel', margin + 2, y + 3.2);
    doc.text('Koefisien (B)', margin + 45, y + 3.2);
    doc.text('Std. Error', margin + 80, y + 3.2);
    doc.text('Beta (β)', margin + 115, y + 3.2);
    doc.text('t-hitung', margin + 145, y + 3.2);
    doc.text('Sig. (p-value)', margin + 168, y + 3.2);
    y += 5;

    report.subStructure1.coefficients.forEach(c => {
      checkAddPage(5);
      doc.setFont('times', 'normal');
      doc.setFontSize(7);
      doc.text(c.variableName, margin + 2, y + 3);
      doc.text(c.b.toFixed(3), margin + 47, y + 3);
      doc.text(c.se.toFixed(3), margin + 82, y + 3);
      doc.text(c.beta !== 0 ? c.beta.toFixed(3) : '-', margin + 117, y + 3);
      doc.setFont('times', 'bold');
      doc.text(c.t.toFixed(3), margin + 147, y + 3);
      doc.text(c.pValue.toFixed(4), margin + 170, y + 3);
      y += 4.5;
    });
    y += 4;

    // 3. Sub-Struktur 2
    checkAddPage(25);
    doc.setFillColor(240, 243, 246);
    doc.rect(margin, y, contentWidth, 5.5, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 45, 90);
    doc.text(`3. ANALISIS REGRESI SUB-STRUKTUR 2: ${report.subStructure2.modelName}`, margin + 2, y + 3.8);
    y += 7;

    doc.setFont('times', 'normal');
    doc.setFontSize(7.5);
    doc.text(`• Persamaan: ${report.subStructure2.equation}`, margin + 2, y);
    y += 3.5;
    doc.text(`• R = ${report.subStructure2.r.toFixed(3)}  |  R-Square (R²) = ${(report.subStructure2.rSquare * 100).toFixed(2)}%  |  F-hitung = ${report.subStructure2.fCount.toFixed(3)} (Sig = ${report.subStructure2.fPValue.toFixed(4)})`, margin + 2, y);
    y += 5;

    doc.setFillColor(235, 240, 245);
    doc.rect(margin, y, contentWidth, 4.5, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(7);
    doc.text('Variabel', margin + 2, y + 3.2);
    doc.text('Koefisien (B)', margin + 45, y + 3.2);
    doc.text('Std. Error', margin + 80, y + 3.2);
    doc.text('Beta (β)', margin + 115, y + 3.2);
    doc.text('t-hitung', margin + 145, y + 3.2);
    doc.text('Sig. (p-value)', margin + 168, y + 3.2);
    y += 5;

    report.subStructure2.coefficients.forEach(c => {
      checkAddPage(5);
      doc.setFont('times', 'normal');
      doc.setFontSize(7);
      doc.text(c.variableName, margin + 2, y + 3);
      doc.text(c.b.toFixed(3), margin + 47, y + 3);
      doc.text(c.se.toFixed(3), margin + 82, y + 3);
      doc.text(c.beta !== 0 ? c.beta.toFixed(3) : '-', margin + 117, y + 3);
      doc.setFont('times', 'bold');
      doc.text(c.t.toFixed(3), margin + 147, y + 3);
      doc.text(c.pValue.toFixed(4), margin + 170, y + 3);
      y += 4.5;
    });
    y += 4;

    // 4. Uji Mediasi Sobel
    checkAddPage(20);
    doc.setFillColor(240, 243, 246);
    doc.rect(margin, y, contentWidth, 5.5, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 45, 90);
    doc.text('4. PENGUJIAN EFEK MEDIASI INTERVENING (SOBEL TEST)', margin + 2, y + 3.8);
    y += 7;

    const medLines = [
      `• Jalur 1 (X1 → Z → Y): Efek Langsung = ${report.mediationX1.directEffect.toFixed(3)}, Efek Tidak Langsung = ${report.mediationX1.indirectEffect.toFixed(3)}, Sobel z = ${report.mediationX1.sobelZ.toFixed(3)} (p = ${report.mediationX1.pValue.toFixed(4)}) -> ${report.mediationX1.mediationType}`,
      `• Jalur 2 (X2 → Z → Y): Efek Langsung = ${report.mediationX2.directEffect.toFixed(3)}, Efek Tidak Langsung = ${report.mediationX2.indirectEffect.toFixed(3)}, Sobel z = ${report.mediationX2.sobelZ.toFixed(3)} (p = ${report.mediationX2.pValue.toFixed(4)}) -> ${report.mediationX2.mediationType}`
    ];
    doc.setFont('times', 'normal');
    doc.setFontSize(7.5);
    medLines.forEach(line => {
      doc.text(line, margin + 2, y);
      y += 4;
    });
    y += 4;

    // 5. Rekapitulasi Pembuktian Hipotesis
    checkAddPage(30);
    doc.setFillColor(240, 243, 246);
    doc.rect(margin, y, contentWidth, 5.5, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 45, 90);
    doc.text('5. REKAPITULASI KESIMPULAN PENGUJIAN HIPOTESIS PENELITIAN', margin + 2, y + 3.8);
    y += 7;

    doc.setFillColor(235, 240, 245);
    doc.rect(margin, y, contentWidth, 4.5, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(7);
    doc.text('Kode', margin + 2, y + 3.2);
    doc.text('Jalur Hipotesis', margin + 15, y + 3.2);
    doc.text('Pernyataan Hipotesis', margin + 42, y + 3.2);
    doc.text('t / z hitung', margin + 140, y + 3.2);
    doc.text('Keputusan', margin + 165, y + 3.2);
    y += 5;

    report.hypotheses.forEach(h => {
      checkAddPage(7);
      doc.setFont('times', 'bold');
      doc.setFontSize(7);
      doc.text(h.code, margin + 2, y + 3.2);
      doc.setFont('times', 'normal');
      doc.text(h.path, margin + 15, y + 3.2);
      
      const splitStmt = doc.splitTextToSize(h.statement, 94);
      doc.text(splitStmt, margin + 42, y + 3.2);
      doc.setFont('times', 'bold');
      doc.text(h.tCount.toFixed(3), margin + 142, y + 3.2);
      doc.setTextColor(h.decision === 'Diterima' ? 5 : 180, h.decision === 'Diterima' ? 120 : 20, h.decision === 'Diterima' ? 50 : 20);
      doc.text(h.decision.toUpperCase(), margin + 166, y + 3.2);
      doc.setTextColor(20, 20, 20);

      const rowH = Math.max(5, splitStmt.length * 3.2 + 2);
      doc.setDrawColor(230, 230, 230);
      doc.line(margin, y + rowH, pageWidth - margin, y + rowH);
      y += rowH + 1;
    });

    // Signature
    checkAddPage(25);
    y += 6;
    const signX = pageWidth - margin - 60;
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, signX, y);
    y += 4;
    doc.text('Peneliti / Mahasiswa Tesis,', signX, y);
    y += 16;
    doc.setFont('times', 'bold');
    doc.text(thesisInfo.researcherName, signX, y);
    y += 4;
    doc.setFont('times', 'normal');
    doc.text(`Prodi ${thesisInfo.programStudy}`, signX, y);

    doc.save(`Hasil_Analisis_Statistik_Bab_IV_${thesisInfo.researcherName.replace(/\s+/g, '_')}.pdf`);
  }
};
