import React, { useState, useEffect, useMemo } from 'react';
import {
  Header,
} from './components/Header';
import { ConfigCard } from './components/ConfigCard';
import { TimelineVisualizer } from './components/TimelineVisualizer';
import { DayAuditTable } from './components/DayAuditTable';
import { SanctionsGuide } from './components/SanctionsGuide';
import { RegulationModal } from './components/RegulationModal';
import { HolidayManagerModal } from './components/HolidayManagerModal';
import { ExportModal } from './components/ExportModal';
import { PrintView } from './components/PrintView';
import { INITIAL_HOLIDAYS, parseHolidaysCSV } from './data/holidays';
import { PubexConfig, Holiday } from './types';
import {
  calculateTimeline,
  toDateString,
  addTradingDays,
} from './utils/calculator';

const STORAGE_KEY_CONFIG = 'pubex_timeline_config_v2';
const STORAGE_KEY_HOLIDAYS = 'pubex_timeline_holidays_v1';

export default function App() {
  // Today's date as ISO string (YYYY-MM-DD)
  const todayStr = useMemo(() => {
    return toDateString(new Date());
  }, []);

  // Holidays state
  const [holidays, setHolidays] = useState<Holiday[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HOLIDAYS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return INITIAL_HOLIDAYS;
  });

  // Config state: Default mode 'forward_from_announcement' with today's date
  const [config, setConfig] = useState<PubexConfig>(() => {
    // Check URL parameters first
    const params = new URLSearchParams(window.location.search);
    const urlDate = params.get('date');
    const urlMode = params.get('mode') as PubexConfig['calculationMode'] | null;
    const urlCode = params.get('code');
    const urlName = params.get('name');
    const urlFormat = params.get('format') as PubexConfig['format'] | null;

    if (urlDate) {
      return {
        calculationMode: urlMode || 'forward_from_announcement',
        targetDate: urlDate,
        companyName: urlName || 'PT Perusahaan Terbuka Tbk',
        stockCode: urlCode || 'EMTN',
        pubexType: 'tahunan',
        format: urlFormat || 'elektronik',
        venue: 'Gedung Bursa Efek Indonesia / Webinar Zoom Live',
        eventTime: '14:00 - 16:00 WIB',
        directors: 'Direktur Utama & Direktur Keuangan',
      };
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }

    return {
      calculationMode: 'forward_from_announcement',
      targetDate: todayStr,
      companyName: 'PT Perusahaan Terbuka Tbk',
      stockCode: 'EMTN',
      pubexType: 'tahunan',
      format: 'elektronik',
      venue: 'Gedung Bursa Efek Indonesia / Webinar Zoom Live',
      eventTime: '14:00 - 16:00 WIB',
      directors: 'Direktur Utama & Direktur Keuangan',
    };
  });

  // Active view tab: timeline | audit | guidelines
  const [activeTab, setActiveTab] = useState<'timeline' | 'audit' | 'guidelines'>('timeline');

  // Modals
  const [isRegulationOpen, setIsRegulationOpen] = useState(false);
  const [isHolidaysOpen, setIsHolidaysOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Dynamic fetch: Whenever /public/holidays.csv is edited/updated, automatically load it
  useEffect(() => {
    let isMounted = true;
    fetch(`/holidays.csv?v=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.text();
      })
      .then((text) => {
        if (!isMounted) return;
        const parsed = parseHolidaysCSV(text);
        if (parsed.length > 0) {
          setHolidays(parsed);
        }
      })
      .catch((err) => {
        // Fallback gracefully to default INITIAL_HOLIDAYS if fetch fails
        console.warn('Could not fetch /holidays.csv, using default bundle:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch (e) {
      // Ignore
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HOLIDAYS, JSON.stringify(holidays));
    } catch (e) {
      // Ignore
    }
  }, [holidays]);

  // Handle configuration changes
  const handleConfigChange = (updated: Partial<PubexConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleResetToDefault = () => {
    setConfig({
      calculationMode: 'forward_from_announcement',
      targetDate: todayStr,
      companyName: 'PT Perusahaan Terbuka Tbk',
      stockCode: 'EMTN',
      pubexType: 'tahunan',
      format: 'elektronik',
      venue: 'Gedung Bursa Efek Indonesia / Webinar Zoom Live',
      eventTime: '14:00 - 16:00 WIB',
      directors: 'Direktur Utama & Direktur Keuangan',
    });
  };

  // Holiday management handlers
  const handleToggleHoliday = (date: string) => {
    setHolidays((prev) =>
      prev.map((h) => (h.date === date ? { ...h, enabled: !h.enabled } : h))
    );
  };

  const handleAddHoliday = (newH: Holiday) => {
    setHolidays((prev) => [newH, ...prev]);
  };

  const handleResetHolidays = () => {
    setHolidays(INITIAL_HOLIDAYS);
  };

  const handleImportCSVHolidays = (imported: Holiday[]) => {
    setHolidays(imported);
  };

  // Calculate timeline result
  const timeline = useMemo(() => {
    return calculateTimeline(config, holidays);
  }, [config, holidays]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Screen Header */}
      <div className="print:hidden">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenRegulation={() => setIsRegulationOpen(true)}
          onOpenHolidays={() => setIsHolidaysOpen(true)}
          onOpenExport={() => setIsExportOpen(true)}
          onPrint={handlePrint}
        />
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 print:hidden">
        {/* Top Info Banner - Modern Eye-Catching Hero */}
        <div className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-5 sm:p-6 text-white shadow-xl border border-indigo-900/50">
          {/* Subtle glowing ambient background spots */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-200 border border-blue-500/30 font-mono">
                  Kep-00087/BEI/12-2025 · Peraturan I-E
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                Kalkulator Timeline Public Expose BEI
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Penghitung otomatis 4 tahapan kepatuhan Paparan Publik Perusahaan Tercatat dengan perhitungan Hari Bursa akurat, checklist dokumen, dan kalender interaktif.
              </p>
            </div>

            <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
              <span className="text-[11px] text-slate-400 font-medium">Metode Perhitungan:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-600/40 shadow-xs">
                <span>Hari Bursa (Trading Days)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Date & Event Configuration Box */}
        <ConfigCard
          config={config}
          onChange={handleConfigChange}
          holidays={holidays}
          onResetToDefault={handleResetToDefault}
        />

        {/* Active Tab View */}
        {activeTab === 'timeline' && (
          <TimelineVisualizer timeline={timeline} />
        )}

        {activeTab === 'audit' && (
          <DayAuditTable timeline={timeline} />
        )}

        {activeTab === 'guidelines' && (
          <SanctionsGuide />
        )}
      </main>

      {/* Printable Report Component */}
      <PrintView timeline={timeline} config={config} />

      {/* Modals */}
      <RegulationModal
        isOpen={isRegulationOpen}
        onClose={() => setIsRegulationOpen(false)}
      />

      <HolidayManagerModal
        isOpen={isHolidaysOpen}
        onClose={() => setIsHolidaysOpen(false)}
        holidays={holidays}
        onToggleHoliday={handleToggleHoliday}
        onAddHoliday={handleAddHoliday}
        onResetHolidays={handleResetHolidays}
        onImportCSV={handleImportCSVHolidays}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        timeline={timeline}
        config={config}
        onPrint={handlePrint}
      />

      {/* Screen Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Pubex Timeline BEI</span>
            <span>—</span>
            <span>Alat Bantu Kepatuhan Corporate Secretary &amp; Tim Legal Pasar Modal</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Ref: Kep-00087/BEI/12-2025 Peraturan Nomor I-E
          </div>
        </div>
      </footer>
    </div>
  );
}
