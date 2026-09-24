import React, { useState } from 'react';
import {
  X,
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Search,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Upload,
  Copy,
  Check,
} from 'lucide-react';
import { Holiday } from '../types';
import {
  HOLIDAYS_CSV_RAW,
  parseHolidaysCSV,
  serializeHolidaysToCSV,
} from '../data/holidays';

interface HolidayManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  holidays: Holiday[];
  onToggleHoliday: (date: string) => void;
  onAddHoliday: (holiday: Holiday) => void;
  onResetHolidays: () => void;
  onImportCSV?: (newHolidays: Holiday[]) => void;
}

export const HolidayManagerModal: React.FC<HolidayManagerModalProps> = ({
  isOpen,
  onClose,
  holidays,
  onToggleHoliday,
  onAddHoliday,
  onResetHolidays,
  onImportCSV,
}) => {
  const [activeView, setActiveView] = useState<'list' | 'csv'>('list');
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newDate, setNewDate] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newIsJoint, setNewIsJoint] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // CSV editor state
  const [csvText, setCsvText] = useState<string>(() => serializeHolidaysToCSV(holidays));
  const [csvError, setCsvError] = useState<string | null>(null);
  const [csvSuccess, setCsvSuccess] = useState<string | null>(null);
  const [copiedCsv, setCopiedCsv] = useState(false);

  if (!isOpen) return null;

  const filteredHolidays = holidays.filter((h) => {
    const matchesYear = selectedYear === 'all' || h.date.startsWith(selectedYear);
    const matchesQuery =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.date.includes(searchQuery);
    return matchesYear && matchesQuery;
  });

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate || !newName.trim()) return;

    onAddHoliday({
      date: newDate,
      name: newName.trim(),
      isJointHoliday: newIsJoint,
      isExchangeHoliday: true,
      enabled: true,
    });

    setNewDate('');
    setNewName('');
    setNewIsJoint(false);
    setShowAddForm(false);
  };

  const handleSwitchToCsv = () => {
    setCsvText(serializeHolidaysToCSV(holidays));
    setCsvError(null);
    setCsvSuccess(null);
    setActiveView('csv');
  };

  const handleApplyCsv = () => {
    try {
      setCsvError(null);
      const parsed = parseHolidaysCSV(csvText);
      if (parsed.length === 0) {
        setCsvError('Tidak ada data libur yang valid ditemukan dalam CSV.');
        return;
      }

      if (onImportCSV) {
        onImportCSV(parsed);
      }
      setCsvSuccess(`Berhasil memuat ${parsed.length} data hari libur!`);
      setTimeout(() => {
        setCsvSuccess(null);
        setActiveView('list');
      }, 1200);
    } catch (err: any) {
      setCsvError(`Gagal membaca CSV: ${err.message || 'Format tidak valid'}`);
    }
  };

  const handleDownloadCSV = () => {
    const textToDownload = serializeHolidaysToCSV(holidays);
    const blob = new Blob([textToDownload], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'holidays_bei_rups.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCsvText(content);
        setActiveView('csv');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCopyCsv = () => {
    navigator.clipboard.writeText(csvText);
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Kalender Hari Libur Bursa Efek Indonesia (BEI)
              </h3>
              <p className="text-xs text-slate-500">
                Daftar hari libur nasional &amp; cuti bersama acuan perhitungan Hari Bursa (Format CSV RUPS_New).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs (Daftar List vs Editor CSV) */}
        <div className="px-5 pt-3 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('list')}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                activeView === 'list'
                  ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Daftar Kalender ({holidays.length} Hari)
            </button>
            <button
              onClick={handleSwitchToCsv}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeView === 'csv'
                  ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Edit / Paste CSV Langsung</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 pb-2">
            <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md shadow-xs">
              <Upload className="w-3 h-3 text-slate-500" />
              <span>Upload CSV</span>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={handleDownloadCSV}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md shadow-xs"
              title="Unduh format CSV"
            >
              <Download className="w-3 h-3 text-slate-500" />
              <span>Unduh CSV</span>
            </button>
          </div>
        </div>

        {activeView === 'list' ? (
          <>
            {/* Filter bar */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {['2025', '2026', '2027', 'all'].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      selectedYear === yr
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {yr === 'all' ? 'Semua' : yr}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama libur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Content List */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-2 flex-1">
              {filteredHolidays.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  Tidak ada hari libur yang cocok dengan pencarian.
                </div>
              ) : (
                filteredHolidays.map((holiday) => (
                  <div
                    key={holiday.date}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all text-xs ${
                      holiday.enabled
                        ? 'bg-white border-slate-200'
                        : 'bg-slate-50 border-slate-200 opacity-50'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">
                          {holiday.date}
                        </span>
                        {holiday.isJointHoliday && (
                          <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                            Cuti Bersama
                          </span>
                        )}
                        {holiday.isExchangeHoliday && (
                          <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                            Khusus BEI
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 font-medium">{holiday.name}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleHoliday(holiday.date)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        holiday.enabled
                          ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {holiday.enabled ? 'Aktif (Dihitung Libur)' : 'Dinonaktifkan'}
                    </button>
                  </div>
                ))
              )}

              {/* Add custom form */}
              {showAddForm ? (
                <form
                  onSubmit={handleAddNew}
                  className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3 mt-4 text-xs"
                >
                  <span className="font-bold text-slate-900 block">
                    Tambah Hari Libur Khusus Bursa / Perubahan Jadwal
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">
                        Tanggal (YYYY-MM-DD)
                      </label>
                      <input
                        type="date"
                        required
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[11px] mb-1">
                        Nama Hari Libur / Edaran BEI
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Libur Tambahan Pengumuman BEI"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isJoint"
                      checked={newIsJoint}
                      onChange={(e) => setNewIsJoint(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <label htmlFor="isJoint" className="text-slate-700">
                      Kategori Cuti Bersama
                    </label>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-blue-700 text-white rounded font-medium hover:bg-blue-800"
                    >
                      Simpan Hari Libur
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="w-full py-2.5 mt-2 border-2 border-dashed border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Hari Libur / Penyesuaian Khusus BEI</span>
                </button>
              )}
            </div>
          </>
        ) : (
          /* CSV Raw Editor View */
          <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                Format: <code className="text-blue-700 font-mono">Hari,Tgl,Bulan,Tahun,Keterangan</code>
              </span>
              <button
                type="button"
                onClick={handleCopyCsv}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
              >
                {copiedCsv ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Semua CSV</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={14}
              placeholder="Paste data CSV di sini..."
              className="w-full flex-1 p-3 text-xs font-mono bg-slate-900 text-emerald-400 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />

            {csvError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{csvError}</span>
              </div>
            )}

            {csvSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{csvSuccess}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setCsvText(HOLIDAYS_CSV_RAW)}
                className="text-xs text-slate-500 hover:text-blue-600 underline"
              >
                Muat Ulang CSV Bawaan (2026-2027)
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveView('list')}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleApplyCsv}
                  className="px-4 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-medium hover:bg-blue-800 shadow-xs"
                >
                  Terapkan Perubahan CSV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between rounded-b-2xl">
          <button
            type="button"
            onClick={onResetHolidays}
            className="text-xs font-medium text-slate-600 hover:text-rose-700 inline-flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Kalender Standar BEI</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
