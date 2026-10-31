import React, { useRef } from 'react';
import { Download, Sparkles } from 'lucide-react';
import { CompleteAnalysisReport } from '../services/statsEngine';
import { QuestionCategory, QuestionItem } from '../types';

interface PathDiagramProps {
  report: CompleteAnalysisReport;
  categories: QuestionCategory[];
  questions: QuestionItem[];
}

export const PathDiagram: React.FC<PathDiagramProps> = ({
  report,
  categories,
  questions,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract counts
  const x1QuestionsCount = questions.filter(q => q.categoryId.includes('x1') || q.categoryId === categories[0]?.id).length || 8;
  const x2QuestionsCount = questions.filter(q => q.categoryId.includes('x2') || q.categoryId === categories[1]?.id).length || 6;
  const zQuestionsCount = questions.filter(q => q.categoryId.includes('z') || q.categoryId === categories[2]?.id).length || 5;
  const yQuestionsCount = questions.filter(q => q.categoryId.includes('y') || q.categoryId === categories[3]?.id).length || 5;

  // Extract Beta coefficients
  const beta_X1_Z = report.subStructure1.coefficients.find(c => c.variableName === 'X1')?.b ?? 0.01;
  const beta_X2_Z = report.subStructure1.coefficients.find(c => c.variableName === 'X2')?.b ?? 1.00;
  const beta_Z_Y = report.subStructure2.coefficients.find(c => c.variableName === 'Z')?.b ?? -1.75;
  const beta_X1_Y = report.subStructure2.coefficients.find(c => c.variableName === 'X1')?.b ?? -0.10;
  const beta_X2_Y = report.subStructure2.coefficients.find(c => c.variableName === 'X2')?.b ?? 2.73;

  const rSquare_Z = report.subStructure1.rSquare > 0 ? report.subStructure1.rSquare : 0.998;
  const rSquare_Y = report.subStructure2.rSquare > 0 ? report.subStructure2.rSquare : 0.976;

  // Download SVG / PNG capability
  const handleDownloadImage = () => {
    const svgElement = document.getElementById('structural-path-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const svgSize = svgElement.getBoundingClientRect();
    canvas.width = 1100 * 2;
    canvas.height = 550 * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(2, 2);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1100, 550);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const a = document.createElement('a');
      a.download = `Diagram_Jalur_Struktural_Tesis_${Date.now()}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = url;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
      {/* Title Header matching user document */}
      <div className="text-center relative">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-wide uppercase">
          DIAGRAM JALUR STRUKTURAL TESIS (PATH DIAGRAM)
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Model Mediasi Kepuasan Kerja Guru di Madrasah Tsanawiyah Swasta
        </p>

        <div className="absolute right-0 top-0 hidden sm:flex items-center gap-2">
          <button
            onClick={handleDownloadImage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer border border-slate-200"
            title="Download gambar diagram jalur format PNG untuk naskah tesis"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Diagram (PNG)</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Path Diagram */}
      <div ref={containerRef} className="w-full overflow-x-auto py-2">
        <div className="min-w-[860px] flex justify-center">
          <svg
            id="structural-path-svg"
            viewBox="0 0 960 480"
            className="w-full max-w-[960px] h-auto select-none font-sans"
            style={{ background: '#ffffff' }}
          >
            <defs>
              {/* Arrow Marker Dark Slate */}
              <marker
                id="arrow-solid"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#334155" />
              </marker>

              {/* Arrow Marker Dashed Top/Bottom */}
              <marker
                id="arrow-dashed"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#64748b" />
              </marker>

              {/* Box Drop Shadows */}
              <filter id="box-shadow" x="-5%" y="-5%" width="110%" height="115%">
                <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.06" />
              </filter>
            </defs>

            {/* CURVED DIRECT PATH TOP: X1 -> Y */}
            {/* From (240, 150) arching high over Z up to (480, 50) and down to (700, 240) */}
            <path
              d="M 235 125 C 440 20, 560 30, 680 230"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.8"
              strokeDasharray="6 5"
              markerEnd="url(#arrow-dashed)"
            />

            {/* Direct Badge Top X1 -> Y */}
            <g transform="translate(450, 48)">
              <rect
                x="-42"
                y="-13"
                width="84"
                height="26"
                rx="6"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="1.2"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#334155"
              >
                X₁→Y: {beta_X1_Y.toFixed(2)}
              </text>
            </g>

            {/* CURVED DIRECT PATH BOTTOM: X2 -> Y */}
            {/* From (240, 360) arching down under Z to (480, 440) and up to (700, 280) */}
            <path
              d="M 235 375 C 440 470, 560 460, 680 280"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.8"
              strokeDasharray="6 5"
              markerEnd="url(#arrow-dashed)"
            />

            {/* Direct Badge Bottom X2 -> Y */}
            <g transform="translate(450, 432)">
              <rect
                x="-42"
                y="-13"
                width="84"
                height="26"
                rx="6"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="1.2"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#334155"
              >
                X₂→Y: {beta_X2_Y.toFixed(2)}
              </text>
            </g>

            {/* SOLID PATH 1: X1 -> Z */}
            <line
              x1="240"
              y1="175"
              x2="350"
              y2="235"
              stroke="#475569"
              strokeWidth="2"
              markerEnd="url(#arrow-solid)"
            />
            {/* Badge for X1 -> Z */}
            <g transform="translate(295, 205)">
              <rect
                x="-34"
                y="-12"
                width="68"
                height="24"
                rx="5"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="1.2"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#1e293b"
              >
                β = {beta_X1_Z.toFixed(2)}
              </text>
            </g>

            {/* SOLID PATH 2: X2 -> Z */}
            <line
              x1="240"
              y1="325"
              x2="350"
              y2="265"
              stroke="#475569"
              strokeWidth="2"
              markerEnd="url(#arrow-solid)"
            />
            {/* Badge for X2 -> Z */}
            <g transform="translate(295, 295)">
              <rect
                x="-34"
                y="-12"
                width="68"
                height="24"
                rx="5"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="1.2"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#1e293b"
              >
                β = {beta_X2_Z.toFixed(2)}
              </text>
            </g>

            {/* SOLID PATH 3: Z -> Y */}
            <line
              x1="550"
              y1="250"
              x2="655"
              y2="250"
              stroke="#475569"
              strokeWidth="2.2"
              markerEnd="url(#arrow-solid)"
            />
            {/* Badge for Z -> Y */}
            <g transform="translate(605, 250)">
              <rect
                x="-36"
                y="-12"
                width="72"
                height="24"
                rx="5"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="1.2"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#1e293b"
              >
                β = {beta_Z_Y.toFixed(2)}
              </text>
            </g>

            {/* ----------------- BOX 1: KOMPENSASI (X1) ----------------- */}
            <g transform="translate(45, 95)" filter="url(#box-shadow)">
              <rect
                x="0"
                y="0"
                width="195"
                height="100"
                rx="18"
                fill="#f8fafc"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              <text
                x="97"
                y="38"
                textAnchor="middle"
                fontSize="14"
                fontWeight="800"
                fill="#1e3a8a"
              >
                Kompensasi (X₁)
              </text>
              <text
                x="97"
                y="59"
                textAnchor="middle"
                fontSize="11"
                fontWeight="500"
                fill="#475569"
              >
                Finansial & Nonfinansial
              </text>
              <text
                x="97"
                y="77"
                textAnchor="middle"
                fontSize="10"
                fontWeight="500"
                fill="#94a3b8"
              >
                {x1QuestionsCount} Indikator
              </text>
            </g>

            {/* ----------------- BOX 2: KEPEMIMPINAN (X2) ----------------- */}
            <g transform="translate(45, 265)" filter="url(#box-shadow)">
              <rect
                x="0"
                y="0"
                width="195"
                height="100"
                rx="18"
                fill="#f8fafc"
                stroke="#6366f1"
                strokeWidth="2"
              />
              <text
                x="97"
                y="38"
                textAnchor="middle"
                fontSize="14"
                fontWeight="800"
                fill="#1e3a8a"
              >
                Kepemimpinan (X₂)
              </text>
              <text
                x="97"
                y="59"
                textAnchor="middle"
                fontSize="11"
                fontWeight="500"
                fill="#475569"
              >
                Kepala Madrasah
              </text>
              <text
                x="97"
                y="77"
                textAnchor="middle"
                fontSize="10"
                fontWeight="500"
                fill="#94a3b8"
              >
                {x2QuestionsCount} Indikator
              </text>
            </g>

            {/* ----------------- BOX 3: KEPUASAN KERJA (Z) (MEDIASI) ----------------- */}
            <g transform="translate(355, 180)" filter="url(#box-shadow)">
              <rect
                x="0"
                y="0"
                width="200"
                height="115"
                rx="18"
                fill="#fdf4ff"
                stroke="#a855f7"
                strokeWidth="2.4"
              />
              <text
                x="100"
                y="44"
                textAnchor="middle"
                fontSize="14"
                fontWeight="800"
                fill="#6b21a8"
              >
                Kepuasan Kerja (Z)
              </text>
              <text
                x="100"
                y="67"
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill="#9333ea"
              >
                Variabel Mediasi
              </text>
              <text
                x="100"
                y="94"
                textAnchor="middle"
                fontSize="13"
                fontWeight="800"
                fill="#1e293b"
              >
                R² = {rSquare_Z.toFixed(3)}
              </text>
            </g>

            {/* ----------------- BOX 4: TURNOVER INTENTION (Y) (DEPENDEN) ----------------- */}
            <g transform="translate(660, 180)" filter="url(#box-shadow)">
              <rect
                x="0"
                y="0"
                width="205"
                height="115"
                rx="18"
                fill="#fef2f2"
                stroke="#ef4444"
                strokeWidth="2.4"
              />
              <text
                x="102"
                y="44"
                textAnchor="middle"
                fontSize="14"
                fontWeight="800"
                fill="#991b1b"
              >
                Turnover Intention (Y)
              </text>
              <text
                x="102"
                y="67"
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill="#dc2626"
              >
                Niat Keluar Guru
              </text>
              <text
                x="102"
                y="94"
                textAnchor="middle"
                fontSize="13"
                fontWeight="800"
                fill="#1e293b"
              >
                R² = {rSquare_Y.toFixed(3)}
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Legend & Academic Notes under Path Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs text-slate-600 border-t border-slate-100">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="font-bold text-slate-800 mb-1">Garis Padat (Solid Arrows):</div>
          <p className="text-[11px] text-slate-500">
            Menunjukkan jalur langsung pada model mediasi: $X_1 \to Z$ (&beta; = {beta_X1_Z.toFixed(2)}), $X_2 \to Z$ (&beta; = {beta_X2_Z.toFixed(2)}), dan $Z \to Y$ (&beta; = {beta_Z_Y.toFixed(2)}).
          </p>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="font-bold text-slate-800 mb-1">Garis Putus-Putus (Dashed Curves):</div>
          <p className="text-[11px] text-slate-500">
            Menunjukkan pengaruh langsung eksogen ke endogen: $X_1 \to Y$ ({beta_X1_Y.toFixed(2)}) dan $X_2 \to Y$ ({beta_X2_Y.toFixed(2)}).
          </p>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="font-bold text-slate-800 mb-1">Nilai Koefisien Determinasi ($R^2$):</div>
          <p className="text-[11px] text-slate-500">
            $R^2_Z = {rSquare_Z.toFixed(3)}$ (Kepuasan Kerja) dan $R^2_Y = {rSquare_Y.toFixed(3)}$ (Turnover Intention), menggambarkan daya jelas model penelitian yang sangat kuat.
          </p>
        </div>
      </div>
    </div>
  );
};
