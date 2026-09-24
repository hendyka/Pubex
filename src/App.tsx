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

const STORAGE_KEY_CONFIG = 'pubex_timeline_config_v1';
const STORAGE_KEY_HOLIDAYS = 'pubex_timeline_holidays_v1';

export default function App() {
  // Determine default target date: 15 trading days from current time
  const defaultTargetDate = useMemo(() => {
    const base = new Date();
    // Default 15 trading days ahead for a realistic upcoming Pubex
    return toDateString(addTradingDays(base, 15, INITIAL_HOLIDAYS));
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

  // Config state
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
        calculationMode: urlMode || 'backward_from_event',
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
      calculationMode: 'backward_from_event',
      targetDate: defaultTargetDate,
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
      calculationMode: 'backward_from_event',
      targetDate: defaultTargetDate,
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
        {/* Top Info Banner */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
            <span className="font-semibold text-slate-800">
              Kalkulator Kepatuhan Public Expose Bursa Efek Indonesia
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600 font-mono">Kep-00087/BEI/12-2025</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <span>Standar Perhitungan:</span>
            <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded font-mono">
              Hari Bursa (Trading Days)
            </span>
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
