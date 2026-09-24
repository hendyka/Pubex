import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Download,
  Info,
} from 'lucide-react';
import { TimelineResult, DayAuditItem } from '../types';

interface DayAuditTableProps {
  timeline: TimelineResult;
}

export const DayAuditTable: React.FC<DayAuditTableProps> = ({ timeline }) => {
  const [filterMode, setFilterMode] = useState<'all' | 'trading_only' | 'holidays_only' | 'milestones_only'>('all');

  const filteredDays = timeline.auditTrail.filter((item) => {
    if (filterMode === 'trading_only') return item.isExchangeTradingDay;
    if (filterMode === 'holidays_only') return !item.isExchangeTradingDay;
    if (filterMode === 'milestones_only') return !!item.milestoneEvent;
    return true;
  });

  const exportCSV = () => {
    const headers = ['Tanggal', 'Hari', 'Tipe Hari', 'Keterangan Libur', 'Hari Bursa Ke', 'Milestone'];
    const rows = timeline.auditTrail.map((d) => [
      d.date,
      d.dayName,
      d.isExchangeTradingDay ? 'Hari Bursa' : d.isWeekend ? 'Akhir Pekan' : 'Libur Nasional',
      d.holidayName || '-',
      d.tradingDayCounter ? String(d.tradingDayCounter) : '-',
      d.milestoneEvent ? `Tahap ${d.milestoneEvent.stageNumber}: ${d.milestoneEvent.title}` : '-',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_hari_bursa_pubex_${timeline.config.stockCode || 'emiten'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const weekendCount = timeline.auditTrail.filter((d) => d.isWeekend).length;
  const holidayCount = timeline.auditTrail.filter((d) => d.isHoliday && !d.isWeekend).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-6 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Audit Perhitungan Tanggal
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Rincian Hari Bursa vs Hari Libur (Day-by-Day Audit)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Transparansi verifikasi perhitungan Hari Bursa sesuai kalender resmi Bursa Efek Indonesia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* Statistical Summary Tags */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Total Hari Kalender:</span>
            <span className="text-base font-bold font-mono text-slate-900">
              {timeline.totalCalendarDaysSpan} Hari
            </span>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
            <span className="text-[11px] text-emerald-700 block">Hari Bursa Aktif:</span>
            <span className="text-base font-bold font-mono text-emerald-900">
              {timeline.totalTradingDaysSpan} Hari Bursa
            </span>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
            <span className="text-[11px] text-amber-700 block">Libur Bursa / Nasional:</span>
            <span className="text-base font-bold font-mono text-amber-900">
              {holidayCount} Hari
            </span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Akhir Pekan:</span>
            <span className="text-base font-bold font-mono text-slate-900">
              {weekendCount} Hari
            </span>
          </div>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mt-4 w-full sm:w-auto self-start">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Hari ({timeline.auditTrail.length})
          </button>
          <button
            onClick={() => setFilterMode('trading_only')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filterMode === 'trading_only'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hanya Hari Bursa ({timeline.totalTradingDaysSpan})
          </button>
          <button
            onClick={() => setFilterMode('holidays_only')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filterMode === 'holidays_only'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hanya Libur/Weekend ({holidayCount + weekendCount})
          </button>
          <button
            onClick={() => setFilterMode('milestones_only')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filterMode === 'milestones_only'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Milestone (4 Tahap)
          </button>
        </div>
      </div>

      {/* Audit Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <th className="py-3 px-4">Tanggal &amp; Hari</th>
              <th className="py-3 px-4">Klasifikasi Hari</th>
              <th className="py-3 px-4">Keterangan / Nama Libur</th>
              <th className="py-3 px-4 text-center">Urutan Hari Bursa</th>
              <th className="py-3 px-4">Batas Waktu / Milestone Tahap Pubex</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDays.map((item, index) => {
              const isMilestone = !!item.milestoneEvent;
              return (
                <tr
                  key={item.date}
                  className={`transition-colors ${
                    isMilestone
                      ? 'bg-blue-50/70 hover:bg-blue-50 font-medium'
                      : !item.isExchangeTradingDay
                      ? 'bg-slate-50/50 text-slate-500 hover:bg-slate-100/60'
                      : 'hover:bg-slate-50/80 text-slate-800'
                  }`}
                >
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <span className="font-mono font-medium text-slate-900 block">
                      {item.date}
                    </span>
                    <span className="text-[11px] text-slate-500">{item.dayName}</span>
                  </td>

                  <td className="py-2.5 px-4 whitespace-nowrap">
                    {item.isExchangeTradingDay ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Hari Bursa Aktif
                      </span>
                    ) : item.isWeekend ? (
                      <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        Akhir Pekan (Tutup)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        Libur Bursa / Nasional
                      </span>
                    )}
                  </td>

                  <td className="py-2.5 px-4 text-slate-700">
                    {item.holidayName ? (
                      <span className="font-medium text-amber-900">
                        {item.holidayName}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">-</span>
                    )}
                  </td>

                  <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-900">
                    {item.tradingDayCounter ? (
                      <span className="text-blue-700">#{item.tradingDayCounter}</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>

                  <td className="py-2.5 px-4">
                    {item.milestoneEvent ? (
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                          Tahap 0{item.milestoneEvent.stageNumber}
                        </span>
                        <span className="font-bold text-slate-900">
                          {item.milestoneEvent.title}
                        </span>
                        <span className="text-blue-700 font-mono text-[11px] font-semibold">
                          ({item.milestoneEvent.dayOffsetLabel})
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>
          Catatan Audit: Hari bursa adalah hari diselenggarakannya perdagangan efek di Bursa Efek Indonesia (Senin s.d. Jumat, tidak termasuk hari libur nasional dan cuti bersama yang ditetapkan pemerintah &amp; BEI).
        </span>
      </div>
    </div>
  );
};
