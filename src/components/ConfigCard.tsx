import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Building2,
  Users,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ArrowRight,
  Info,
  RotateCcw,
} from 'lucide-react';
import { PubexConfig, Holiday } from '../types';
import {
  isTradingDay,
  formatIndonesianDate,
  parseDate,
  toDateString,
  addTradingDays,
} from '../utils/calculator';

interface ConfigCardProps {
  config: PubexConfig;
  onChange: (updated: Partial<PubexConfig>) => void;
  holidays: Holiday[];
  onResetToDefault: () => void;
}

export const ConfigCard: React.FC<ConfigCardProps> = ({
  config,
  onChange,
  holidays,
  onResetToDefault,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const selectedDateObj = parseDate(config.targetDate);
  const dateCheck = isTradingDay(selectedDateObj, holidays);

  // Quick preset helper
  const applyPreset = (daysAhead: number, isTrading = false) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let nextDate: Date;
    if (isTrading) {
      nextDate = addTradingDays(today, daysAhead, holidays);
    } else {
      nextDate = new Date(today);
      nextDate.setDate(nextDate.getDate() + daysAhead);
      // If it falls on weekend/holiday, adjust to next trading day
      while (!isTradingDay(nextDate, holidays).isTrading) {
        nextDate.setDate(nextDate.getDate() + 1);
      }
    }
    onChange({ targetDate: toDateString(nextDate) });
  };

  const shiftToNextTradingDay = () => {
    const current = parseDate(config.targetDate);
    while (!isTradingDay(current, holidays).isTrading) {
      current.setDate(current.getDate() + 1);
    }
    onChange({ targetDate: toDateString(current) });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6">
      {/* Mode Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Mode Perhitungan Timeline
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            {config.calculationMode === 'backward_from_event'
              ? 'Hitung Mundur dari Hari H Pelaksanaan'
              : 'Hitung Maju dari Tanggal Laporan Rencana'}
          </h2>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onChange({ calculationMode: 'backward_from_event' })}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              config.calculationMode === 'backward_from_event'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Target Hari H Pubex
          </button>
          <button
            type="button"
            onClick={() => onChange({ calculationMode: 'forward_from_announcement' })}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              config.calculationMode === 'forward_from_announcement'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dari Tanggal Rencana
          </button>
        </div>
      </div>

      {/* Main Date Selection Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
        <div className="lg:col-span-7 space-y-3">
          <label className="block text-xs font-medium text-slate-700">
            {config.calculationMode === 'backward_from_event'
              ? 'Tanggal Pelaksanaan Public Expose (Hari H)'
              : 'Tanggal Penyampaian Laporan Rencana Penyelenggaraan'}
            <span className="text-rose-500 ml-1">*</span>
          </label>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <input
                type="date"
                value={config.targetDate}
                onChange={(e) => onChange({ targetDate: e.target.value })}
                className="w-full pl-3 pr-4 py-2.5 text-sm font-medium border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white shadow-xs"
              />
            </div>

            <div className="text-sm font-semibold text-slate-800 bg-slate-50 px-3 py-2.5 rounded-lg border border-slate-200 shrink-0">
              {formatIndonesianDate(selectedDateObj)}
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-500">Preset Cepat:</span>
            <button
              type="button"
              onClick={() => applyPreset(10, true)}
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
            >
              +10 Hari Bursa
            </button>
            <button
              type="button"
              onClick={() => applyPreset(14, false)}
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
            >
              2 Minggu Lagi
            </button>
            <button
              type="button"
              onClick={() => applyPreset(30, false)}
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
            >
              1 Bulan Lagi
            </button>
            <button
              type="button"
              onClick={onResetToDefault}
              title="Reset ke pengaturan default"
              className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Non-Trading Day Warning Banner */}
          {!dateCheck.isTrading && (
            <div className="mt-3 p-3.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <span className="font-semibold">
                  Perhatian: Tanggal yang dipilih bukan Hari Bursa Aktif!
                </span>
                <p className="mt-0.5 text-amber-800">
                  {dateCheck.isWeekend
                    ? 'Tanggal jatuh pada akhir pekan (Sabtu/Minggu).'
                    : `Tanggal bertepatan dengan Libur Bursa: ${dateCheck.holidayName}.`}
                  {' '}Sesuai Peraturan BEI Nomor I-E, pelaksanaan Public Expose harus dilakukan pada Hari Bursa.
                </p>
                <button
                  type="button"
                  onClick={shiftToNextTradingDay}
                  className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded font-medium text-xs transition-colors"
                >
                  <span>Geser ke Hari Bursa Terdekat</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Company Profile Preview & Pubex Type */}
        <div className="lg:col-span-5 bg-slate-50/80 rounded-lg p-4 border border-slate-200/80 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Profil Acara &amp; Emiten
              </span>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                {showAdvanced ? 'Tutup Detail' : 'Ubah Detail Emiten'}
                {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-500">Emiten:</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {config.stockCode ? `[${config.stockCode}] ` : ''}
                  {config.companyName || 'PT Perusahaan Terbuka Tbk'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-500">Jenis Pubex:</span>
                <span className="font-medium text-slate-900 capitalize">
                  Public Expose {config.pubexType} (Peraturan I-E)
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-500">Format:</span>
                <span className="font-medium text-slate-900 capitalize">
                  {config.format === 'elektronik' ? 'Elektronik (Webinar/Zoom)' : config.format}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Direktur Hadir:</span>
                <span className="font-medium text-slate-900 truncate max-w-[180px]">
                  {config.directors || 'Direksi Perusahaan'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Perhitungan otomatis memperhitungkan cuti bersama &amp; hari libur BEI.</span>
          </div>
        </div>
      </div>

      {/* Advanced Details Collapsible Form */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Kode Emiten
            </label>
            <input
              type="text"
              placeholder="Contoh: BBCA"
              maxLength={6}
              value={config.stockCode}
              onChange={(e) => onChange({ stockCode: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 text-xs font-mono font-bold uppercase border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nama Perusahaan
            </label>
            <input
              type="text"
              placeholder="Nama Lengkap PT ... Tbk"
              value={config.companyName}
              onChange={(e) => onChange({ companyName: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Tipe Public Expose
            </label>
            <select
              value={config.pubexType}
              onChange={(e) => onChange({ pubexType: e.target.value as any })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
            >
              <option value="tahunan">Tahunan (Wajib min. 1x / tahun)</option>
              <option value="insidentil">Insidentil (Permintaan BEI / Corporate Action)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Format Acara
            </label>
            <select
              value={config.format}
              onChange={(e) => onChange({ format: e.target.value as any })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
            >
              <option value="elektronik">Elektronik / Webinar (Zoom / Teams)</option>
              <option value="fisik">Fisik (Kantor Bursa / Tempat Lain)</option>
              <option value="hybrid">Hybrid (Fisik + Live Webinar)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Tempat / Link Penyelenggaraan (Sesuai III.3.3.1.2)
            </label>
            <input
              type="text"
              placeholder="Contoh: Gedung BEI Tower 1 / Zoom Webinar Live"
              value={config.venue}
              onChange={(e) => onChange({ venue: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nama Direktur yang Hadir (Wajib sesuai III.3.3.1.3)
            </label>
            <input
              type="text"
              placeholder="Contoh: Direktur Utama & Direktur Keuangan"
              value={config.directors}
              onChange={(e) => onChange({ directors: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};
