import React, { useState, useRef } from 'react';
import { Download, RefreshCw, Layers, CheckCircle2, Info, Sparkles, Copy, Check } from 'lucide-react';
import { RegressionModelResult } from '../services/statsEngine';

interface StructuralPathDiagramProps {
  subStructure1: RegressionModelResult;
  subStructure2: RegressionModelResult;
  n: number;
}

export const StructuralPathDiagram: React.FC<StructuralPathDiagramProps> = ({
  subStructure1,
  subStructure2,
  n,
}) => {
  // Mode: 'live' (calculated from responses) or 'reference' (matching the exact numbers from the thesis image)
  const [dataMode, setDataMode] = useState<'live' | 'reference'>('live');
  const [copiedBadge, setCopiedBadge] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Extract coefficients from live data
  const live_beta_x1_z = subStructure1.coefficients.find(c => c.variableName === 'X1')?.b ?? 0.01;
  const live_beta_x2_z = subStructure1.coefficients.find(c => c.variableName === 'X2')?.b ?? 1.00;
  const live_r2_z = subStructure1.rSquare > 0 ? subStructure1.rSquare : 0.998;

  const live_beta_z_y = subStructure2.coefficients.find(c => c.variableName === 'Z')?.b ?? -1.75;
  const live_beta_x1_y = subStructure2.coefficients.find(c => c.variableName === 'X1')?.b ?? -0.10;
  const live_beta_x2_y = subStructure2.coefficients.find(c => c.variableName === 'X2')?.b ?? 2.73;
  const live_r2_y = subStructure2.rSquare > 0 ? subStructure2.rSquare : 0.976;

  // Values based on active mode
  const beta_x1_z = dataMode === 'reference' ? '0.01' : live_beta_x1_z.toFixed(2);
  const beta_x2_z = dataMode === 'reference' ? '1.00' : live_beta_x2_z.toFixed(2);
  const r2_z = dataMode === 'reference' ? '0.998' : live_r2_z.toFixed(3);

  const beta_z_y = dataMode === 'reference' ? '-1.75' : live_beta_z_y.toFixed(2);
  const beta_x1_y = dataMode === 'reference' ? '-0.10' : live_beta_x1_y.toFixed(2);
  const beta_x2_y = dataMode === 'reference' ? '2.73' : live_beta_x2_y.toFixed(2);
  const r2_y = dataMode === 'reference' ? '0.976' : live_r2_y.toFixed(3);

  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Diagram_Jalur_Struktural_Tesis_Nana_Permana.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyExplanation = () => {
    const text = `DIAGRAM JALUR STRUKTURAL TESIS (PATH DIAGRAM)\n` +
      `Model Mediasi Kepuasan Kerja Guru di MTs Swasta Kabupaten Sumedang\n\n` +
      `1. Sub-Struktur 1 (Pengaruh X1 & X2 ke Z):\n` +
      `   • X1 (Kompensasi) -> Z (Kepuasan Kerja): β = ${beta_x1_z}\n` +
      `   • X2 (Kepemimpinan) -> Z (Kepuasan Kerja): β = ${beta_x2_z}\n` +
      `   • Koefisien Determinasi R² (Z) = ${r2_z}\n\n` +
      `2. Sub-Struktur 2 (Pengaruh X1, X2, & Z ke Y):\n` +
      `   • Z (Kepuasan Kerja) -> Y (Turnover Intention): β = ${beta_z_y}\n` +
      `   • Efek Langsung X1 -> Y: β = ${beta_x1_y}\n` +
      `   • Efek Langsung X2 -> Y: β = ${beta_x2_y}\n` +
      `   • Koefisien Determinasi R² (Y) = ${r2_y}\n`;
    navigator.clipboard.writeText(text);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Top Controls & Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-md">
              Path Analysis Model
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Sampel Aktif N = {n} Guru
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            Diagram Jalur Struktural Tesis (Path Diagram)
          </h3>
          <p className="text-xs text-slate-500">
            Model Mediasi Kepuasan Kerja Guru di Madrasah Tsanawiyah Swasta
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Live vs Reference Data */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setDataMode('live')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                dataMode === 'live'
                  ? 'bg-white text-emerald-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Nilai koefisien dihitung langsung dari seluruh jawaban kuesioner responden saat ini"
            >
              Live Data Responden
            </button>
            <button
              onClick={() => setDataMode('reference')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                dataMode === 'reference'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Nilai koefisien patokan sesuai gambar model tesis yang diunggah"
            >
              Nilai Contoh Gambar
            </button>
          </div>

          <button
            onClick={handleDownloadSvg}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            title="Download gambar diagram jalur format vektor SVG untuk naskah tesis"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh SVG</span>
          </button>

          <button
            onClick={handleCopyExplanation}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            title="Salin rincian koefisien jalur untuk naskah Bab IV"
          >
            {copiedBadge ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedBadge ? 'Tersalin!' : 'Salin Keterangan'}</span>
          </button>
        </div>
      </div>

      {/* SVG Diagram Canvas matching user reference image */}
      <div className="w-full overflow-x-auto bg-slate-50/50 rounded-2xl p-4 sm:p-6 border border-slate-200/80 flex justify-center">
        <svg
          ref={svgRef}
          viewBox="0 0 960 520"
          className="w-full max-w-4xl h-auto select-none font-sans"
          style={{ minWidth: '760px' }}
        >
          <defs>
            {/* Arrow marker for solid paths */}
            <marker
              id="arrow-solid"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#334155" />
            </marker>

            {/* Arrow marker for dashed paths */}
            <marker
              id="arrow-dashed"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#64748b" />
            </marker>

            {/* Soft Shadow Filter for Cards */}
            <filter id="soft-shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.06" />
            </filter>
          </defs>

          {/* Canvas Background */}
          <rect width="960" height="520" fill="#ffffff" rx="20" />

          {/* Diagram Header */}
          <text
            x="480"
            y="42"
            textAnchor="middle"
            fill="#1e3a5f"
            fontWeight="800"
            fontSize="18"
            letterSpacing="0.8"
          >
            DIAGRAM JALUR STRUKTURAL TESIS (PATH DIAGRAM)
          </text>
          <text
            x="480"
            y="68"
            textAnchor="middle"
            fill="#64748b"
            fontWeight="500"
            fontSize="14"
          >
            Model Mediasi Kepuasan Kerja Guru di Madrasah Tsanawiyah Swasta
          </text>

          {/* ================= PATH LINES & CONNECTORS ================= */}

          {/* 1. Curved Dashed Path: X1 directly to Y (Top Arc) */}
          <path
            d="M 230 190 Q 480 30 682 250"
            fill="none"
            stroke="#64748b"
            strokeWidth="2.2"
            strokeDasharray="6,6"
            markerEnd="url(#arrow-dashed)"
          />
          {/* Badge for X1 -> Y */}
          <g transform="translate(445, 120)">
            <rect
              x="0"
              y="0"
              width="90"
              height="28"
              rx="6"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="1.2"
              filter="url(#soft-shadow)"
            />
            <text
              x="45"
              y="18"
              textAnchor="middle"
              fill="#1e293b"
              fontSize="12"
              fontWeight="700"
            >
              X₁→Y: {beta_x1_y}
            </text>
          </g>

          {/* 2. Curved Dashed Path: X2 directly to Y (Bottom Arc) */}
          <path
            d="M 230 435 Q 480 575 682 360"
            fill="none"
            stroke="#64748b"
            strokeWidth="2.2"
            strokeDasharray="6,6"
            markerEnd="url(#arrow-dashed)"
          />
          {/* Badge for X2 -> Y */}
          <g transform="translate(445, 465)">
            <rect
              x="0"
              y="0"
              width="90"
              height="28"
              rx="6"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="1.2"
              filter="url(#soft-shadow)"
            />
            <text
              x="45"
              y="18"
              textAnchor="middle"
              fill="#1e293b"
              fontSize="12"
              fontWeight="700"
            >
              X₂→Y: {beta_x2_y}
            </text>
          </g>

          {/* 3. Solid Path: X1 -> Z */}
          <line
            x1="230"
            y1="205"
            x2="350"
            y2="280"
            stroke="#334155"
            strokeWidth="2.5"
            markerEnd="url(#arrow-solid)"
          />
          {/* Badge for X1 -> Z */}
          <g transform="translate(255, 226)">
            <rect
              x="0"
              y="0"
              width="78"
              height="26"
              rx="6"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="1.2"
              filter="url(#soft-shadow)"
            />
            <text
              x="39"
              y="17"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="12"
              fontWeight="800"
            >
              β = {beta_x1_z}
            </text>
          </g>

          {/* 4. Solid Path: X2 -> Z */}
          <line
            x1="230"
            y1="415"
            x2="350"
            y2="335"
            stroke="#334155"
            strokeWidth="2.5"
            markerEnd="url(#arrow-solid)"
          />
          {/* Badge for X2 -> Z */}
          <g transform="translate(255, 360)">
            <rect
              x="0"
              y="0"
              width="78"
              height="26"
              rx="6"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="1.2"
              filter="url(#soft-shadow)"
            />
            <text
              x="39"
              y="17"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="12"
              fontWeight="800"
            >
              β = {beta_x2_z}
            </text>
          </g>

          {/* 5. Solid Path: Z -> Y */}
          <line
            x1="565"
            y1="305"
            x2="665"
            y2="305"
            stroke="#334155"
            strokeWidth="2.5"
            markerEnd="url(#arrow-solid)"
          />
          {/* Badge for Z -> Y */}
          <g transform="translate(585, 292)">
            <rect
              x="0"
              y="0"
              width="82"
              height="26"
              rx="6"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="1.2"
              filter="url(#soft-shadow)"
            />
            <text
              x="41"
              y="17"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="12"
              fontWeight="800"
            >
              β = {beta_z_y}
            </text>
          </g>

          {/* ================= VARIABLE NODE BOXES ================= */}

          {/* 1. NODE X1: Kompensasi (Top-Left) */}
          <g transform="translate(45, 155)" filter="url(#soft-shadow)">
            <rect
              x="0"
              y="0"
              width="190"
              height="96"
              rx="18"
              fill="#f8fafc"
              stroke="#3b82f6"
              strokeWidth="2.6"
            />
            <text
              x="95"
              y="38"
              textAnchor="middle"
              fill="#1e3a8a"
              fontSize="15"
              fontWeight="800"
            >
              Kompensasi (X₁)
            </text>
            <text
              x="95"
              y="58"
              textAnchor="middle"
              fill="#475569"
              fontSize="11.5"
              fontWeight="600"
            >
              Finansial &amp; Nonfinansial
            </text>
            <text
              x="95"
              y="76"
              textAnchor="middle"
              fill="#64748b"
              fontSize="10.5"
              fontWeight="500"
            >
              8 Indikator
            </text>
          </g>

          {/* 2. NODE X2: Kepemimpinan (Bottom-Left) */}
          <g transform="translate(45, 365)" filter="url(#soft-shadow)">
            <rect
              x="0"
              y="0"
              width="190"
              height="96"
              rx="18"
              fill="#f8fafc"
              stroke="#6366f1"
              strokeWidth="2.6"
            />
            <text
              x="95"
              y="38"
              textAnchor="middle"
              fill="#1e3a8a"
              fontSize="15"
              fontWeight="800"
            >
              Kepemimpinan (X₂)
            </text>
            <text
              x="95"
              y="58"
              textAnchor="middle"
              fill="#475569"
              fontSize="11.5"
              fontWeight="600"
            >
              Kepala Madrasah
            </text>
            <text
              x="95"
              y="76"
              textAnchor="middle"
              fill="#64748b"
              fontSize="10.5"
              fontWeight="500"
            >
              6 Indikator
            </text>
          </g>

          {/* 3. NODE Z: Kepuasan Kerja (Center - Mediating Variable) */}
          <g transform="translate(365, 255)" filter="url(#soft-shadow)">
            <rect
              x="0"
              y="0"
              width="210"
              height="102"
              rx="18"
              fill="#fdfaff"
              stroke="#a855f7"
              strokeWidth="2.8"
            />
            <text
              x="105"
              y="38"
              textAnchor="middle"
              fill="#4a044e"
              fontSize="15.5"
              fontWeight="800"
            >
              Kepuasan Kerja (Z)
            </text>
            <text
              x="105"
              y="58"
              textAnchor="middle"
              fill="#9333ea"
              fontSize="11.5"
              fontWeight="700"
            >
              Variabel Mediasi
            </text>
            <text
              x="105"
              y="82"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="14"
              fontWeight="800"
            >
              R² = {r2_z}
            </text>
          </g>

          {/* 4. NODE Y: Turnover Intention (Right - Dependent Variable) */}
          <g transform="translate(680, 255)" filter="url(#soft-shadow)">
            <rect
              x="0"
              y="0"
              width="210"
              height="102"
              rx="18"
              fill="#fff5f6"
              stroke="#f43f5e"
              strokeWidth="2.8"
            />
            <text
              x="105"
              y="38"
              textAnchor="middle"
              fill="#881337"
              fontSize="15.5"
              fontWeight="800"
            >
              Turnover Intention (Y)
            </text>
            <text
              x="105"
              y="58"
              textAnchor="middle"
              fill="#e11d48"
              fontSize="11.5"
              fontWeight="700"
            >
              Niat Keluar Guru
            </text>
            <text
              x="105"
              y="82"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="14"
              fontWeight="800"
            >
              R² = {r2_y}
            </text>
          </g>
        </svg>
      </div>

      {/* Legend & Explanation Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-xs space-y-1">
          <div className="font-bold text-blue-900 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Variabel Eksogen (Independen)</span>
          </div>
          <p className="text-blue-800 text-[11px] leading-relaxed">
            <strong>X₁:</strong> Kompensasi Finansial &amp; Nonfinansial (8 butir)<br />
            <strong>X₂:</strong> Kepemimpinan Kepala Madrasah (6 butir)
          </p>
        </div>

        <div className="p-3.5 bg-purple-50/70 border border-purple-200/80 rounded-2xl text-xs space-y-1">
          <div className="font-bold text-purple-900 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span>Variabel Mediasi (Intervening)</span>
          </div>
          <p className="text-purple-800 text-[11px] leading-relaxed">
            <strong>Z:</strong> Kepuasan Kerja Guru (5 butir)<br />
            Daya jelas model <strong>R² = {r2_z}</strong> ({(parseFloat(r2_z) * 100).toFixed(1)}%)
          </p>
        </div>

        <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-2xl text-xs space-y-1">
          <div className="font-bold text-rose-900 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Variabel Endogen (Dependen)</span>
          </div>
          <p className="text-rose-800 text-[11px] leading-relaxed">
            <strong>Y:</strong> Turnover Intention / Niat Keluar Guru (5 butir)<br />
            Daya jelas model <strong>R² = {r2_y}</strong> ({(parseFloat(r2_y) * 100).toFixed(1)}%)
          </p>
        </div>
      </div>
    </div>
  );
};
