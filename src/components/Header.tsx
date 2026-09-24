import React from 'react';
import { Calendar, FileText, Share2, Printer, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenRegulation: () => void;
  onOpenHolidays: () => void;
  onOpenExport: () => void;
  onPrint: () => void;
  activeTab: 'timeline' | 'audit' | 'guidelines';
  setActiveTab: (tab: 'timeline' | 'audit' | 'guidelines') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRegulation,
  onOpenHolidays,
  onOpenExport,
  onPrint,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Logo & Branding */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 text-white flex items-center justify-center font-extrabold text-sm tracking-wider shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
                PE
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  Pubex Timeline BEI
                </span>
                <span className="text-[11px] font-mono text-slate-500 hidden sm:block">
                  Kep-00087/BEI/12-2025 · Peraturan I-E
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'timeline'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              4 Tahap Timeline
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'audit'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              Matriks Kalender
            </button>
            <button
              onClick={() => setActiveTab('guidelines')}
              className={`hidden md:inline-flex px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'guidelines'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              Panduan Kepatuhan
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenRegulation}
              title="Lihat Regulasi Kep-00087/BEI/12-2025"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/90 rounded-lg transition-colors border border-slate-200/50"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Regulasi</span>
            </button>

            <button
              onClick={onOpenHolidays}
              title="Kalender Libur Bursa BEI (CSV)"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/90 rounded-lg transition-colors border border-slate-200/50"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Libur BEI</span>
            </button>

            <button
              onClick={onPrint}
              title="Cetak Memo Kepatuhan"
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/90 rounded-lg transition-colors border border-slate-200/50"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Cetak</span>
            </button>

            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all shadow-md shadow-blue-500/20 active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan &amp; Ekspor</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
