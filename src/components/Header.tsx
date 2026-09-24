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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider">
                PE
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                  Pubex Timeline BEI
                </span>
                <span className="text-[11px] font-mono text-slate-500 hidden sm:block">
                  Kep-00087/BEI/12-2025 · Peraturan I-E
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: Navigation Links / View Switchers */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                activeTab === 'timeline'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              4 Tahap Timeline
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                activeTab === 'audit'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Audit Hari Bursa
            </button>
            <button
              onClick={() => setActiveTab('guidelines')}
              className={`hidden md:inline-flex px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                activeTab === 'guidelines'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Regulasi</span>
            </button>

            <button
              onClick={onOpenHolidays}
              title="Kalender Libur Bursa BEI"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Libur BEI</span>
            </button>

            <button
              onClick={onPrint}
              title="Cetak Memo Kepatuhan"
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Cetak</span>
            </button>

            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-sm"
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
