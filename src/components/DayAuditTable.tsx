import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar as CalendarIcon,
  Info,
  Table,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  X,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { TimelineResult, DayAuditItem, StageMilestone, Holiday } from '../types';
import { INDONESIAN_MONTHS, INDONESIAN_DAYS } from '../utils/calculator';
import { INITIAL_HOLIDAYS } from '../data/holidays';

interface DayAuditTableProps {
  timeline: TimelineResult;
  holidays?: Holiday[];
}

export const DayAuditTable: React.FC<DayAuditTableProps> = ({ timeline, holidays = INITIAL_HOLIDAYS }) => {
  // View mode switcher: Matriks Kalender (as requested) vs Tabel Rincian Harian
  const [subView, setSubView] = useState<'matrix' | 'table'>('matrix');
  const [filterMode, setFilterMode] = useState<'all' | 'trading_only' | 'holidays_only' | 'milestones_only'>('all');
  // State for active popup milestone (clicked or hovered)
  const [activePopupMilestone, setActivePopupMilestone] = useState<{
    milestone: StageMilestone;
    dateStr: string;
    tradingCounter?: number;
  } | null>(null);

  // Quick lookup for holidays from holidays.csv / Holiday data
  const holidaysMap = useMemo(() => {
    const map = new Map<string, Holiday>();
    holidays.forEach((h) => {
      if (h.enabled) {
        map.set(h.date, h);
      }
    });
    return map;
  }, [holidays]);

  // Month navigation in calendar matrix: determine default month from timeline milestones or target
  const initialDate = useMemo(() => {
    if (timeline.milestones.length > 0) {
      return new Date(timeline.milestones[0].date);
    }
    return new Date();
  }, [timeline]);

  const [currentYear, setCurrentYear] = useState<number>(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(initialDate.getMonth()); // 0-indexed

  // When timeline changes (e.g. user changes target date), update calendar view if outside current range
  React.useEffect(() => {
    if (timeline.milestones.length > 0) {
      const milestoneDate = new Date(timeline.milestones[2]?.date || timeline.milestones[0]?.date);
      setCurrentYear(milestoneDate.getFullYear());
      setCurrentMonth(milestoneDate.getMonth());
    }
  }, [timeline.config.targetDate]);

  // Navigate months
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Jump to today
  const handleTodayMonth = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
  };

  // Milestone and audit lookups mapped by 'YYYY-MM-DD'
  const auditMap = useMemo(() => {
    const map = new Map<string, DayAuditItem>();
    timeline.auditTrail.forEach((item) => {
      map.set(item.date, item);
    });
    return map;
  }, [timeline.auditTrail]);

  const milestoneMap = useMemo(() => {
    const map = new Map<string, StageMilestone>();
    timeline.milestones.forEach((m) => {
      map.set(m.dateString, m);
    });
    return map;
  }, [timeline.milestones]);

  // Build calendar matrix cells for currentMonth & currentYear (Sunday to Saturday)
  const calendarCells = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday
    const daysInMonth = lastDayOfMonth.getDate();

    const cells: Array<{
      dayNumber: number;
      dateString: string;
      isCurrentMonth: boolean;
      date: Date;
      isSunday: boolean;
      isSaturday: boolean;
      isWeekend: boolean;
      auditItem?: DayAuditItem;
      holiday?: Holiday;
      milestone?: StageMilestone;
    }> = [];

    // Blank cells before first day of month
    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push({
        dayNumber: 0,
        dateString: '',
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth, 1 - (startDayOfWeek - i)),
        isSunday: i === 0,
        isSaturday: i === 6,
        isWeekend: i === 0 || i === 6,
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const cellDate = new Date(currentYear, currentMonth, d);
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayOfWeek = cellDate.getDay();
      const isSun = dayOfWeek === 0;
      const isSat = dayOfWeek === 6;

      cells.push({
        dayNumber: d,
        dateString: dateStr,
        isCurrentMonth: true,
        date: cellDate,
        isSunday: isSun,
        isSaturday: isSat,
        isWeekend: isSun || isSat,
        auditItem: auditMap.get(dateStr),
        holiday: holidaysMap.get(dateStr),
        milestone: milestoneMap.get(dateStr),
      });
    }

    return cells;
  }, [currentYear, currentMonth, auditMap, milestoneMap, holidaysMap]);

  // Excel (.xls HTML table based, recognized seamlessly by Microsoft Excel, LibreOffice, and Google Sheets)
  const exportExcel = () => {
    const stock = timeline.config.stockCode || 'EMITEN';
    const filename = `matriks_kalender_audit_pubex_${stock}_${currentYear}_${currentMonth + 1}.xls`;

    // Generate comprehensive tabular content formatted for Excel
    const rowsHtml = timeline.auditTrail
      .map((d) => {
        const isM = !!d.milestoneEvent;
        const tipe = d.isExchangeTradingDay ? 'Hari Bursa Aktif' : d.isWeekend ? 'Akhir Pekan' : 'Libur Bursa / Nasional';
        const msLabel = d.milestoneEvent ? `Tahap 0${d.milestoneEvent.stageNumber}: ${d.milestoneEvent.title} (${d.milestoneEvent.dayOffsetLabel})` : '-';
        const bg = isM ? 'bgcolor="#dbeafe"' : !d.isExchangeTradingDay ? 'bgcolor="#f8fafc"' : 'bgcolor="#ffffff"';
        
        return `<tr ${bg}>
          <td style="border:1px solid #cbd5e1; padding:6px; font-family:monospace;">${d.date}</td>
          <td style="border:1px solid #cbd5e1; padding:6px;">${d.dayName}</td>
          <td style="border:1px solid #cbd5e1; padding:6px;">${tipe}</td>
          <td style="border:1px solid #cbd5e1; padding:6px;">${d.holidayName || '-'}</td>
          <td style="border:1px solid #cbd5e1; padding:6px; text-align:center; font-weight:bold;">${d.tradingDayCounter ? '#' + d.tradingDayCounter : '-'}</td>
          <td style="border:1px solid #cbd5e1; padding:6px; font-weight:${isM ? 'bold' : 'normal'};">${msLabel}</td>
        </tr>`;
      })
      .join('');

    const milestonesHtml = timeline.milestones
      .map(
        (m) => `<tr>
          <td style="border:1px solid #cbd5e1; padding:6px; font-weight:bold; background-color:#eff6ff;">Tahap 0${m.stageNumber}</td>
          <td style="border:1px solid #cbd5e1; padding:6px; font-weight:bold;">${m.title}</td>
          <td style="border:1px solid #cbd5e1; padding:6px;">${m.formattedDate}</td>
          <td style="border:1px solid #cbd5e1; padding:6px; text-align:center;">${m.dayOffsetLabel}</td>
          <td style="border:1px solid #cbd5e1; padding:6px;">${m.regulationRef}</td>
        </tr>`
      )
      .join('');

    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Matriks & Audit Bursa</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          th { background-color: #1e293b; color: #ffffff; border: 1px solid #0f172a; padding: 8px; font-family: sans-serif; }
          td { font-family: sans-serif; font-size: 11pt; }
        </style>
      </head>
      <body>
        <h2 style="font-family:sans-serif; color:#0f172a; margin-bottom:4px;">MATRIKS KALENDER & AUDIT HARI BURSA PUBLIC EXPOSE</h2>
        <p style="font-family:sans-serif; color:#475569; font-size:10pt; margin-top:0;">
          Perusahaan: <strong>${timeline.config.companyName} (${timeline.config.stockCode})</strong> | Regulasi: <strong>Kep-00087/BEI/12-2025 Peraturan I-E</strong>
        </p>

        <h3 style="font-family:sans-serif; margin-top:20px;">1. RINGKASAN 4 TAHAP KEPATUHAN PUBLIC EXPOSE</h3>
        <table style="border-collapse:collapse; width:100%; margin-bottom:20px;">
          <thead>
            <tr>
              <th>Tahap</th>
              <th>Nama Batas Waktu</th>
              <th>Tanggal Pelaksanaan</th>
              <th>Ketentuan BEI</th>
              <th>Dasar Regulasi</th>
            </tr>
          </thead>
          <tbody>
            ${milestonesHtml}
          </tbody>
        </table>

        <h3 style="font-family:sans-serif; margin-top:20px;">2. RINCIAN AUDIT HARIAN (DAY-BY-DAY AUDIT TRAIL)</h3>
        <p style="font-family:sans-serif; font-size:9pt; color:#64748b;">
          Total Hari Kalender: <strong>${timeline.totalCalendarDaysSpan} Hari</strong> | Total Hari Bursa Aktif: <strong>${timeline.totalTradingDaysSpan} Hari Bursa</strong>
        </p>
        <table style="border-collapse:collapse; width:100%;">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Hari</th>
              <th>Klasifikasi Hari</th>
              <th>Keterangan Libur / Cuti Bersama</th>
              <th>Urutan Hari Bursa</th>
              <th>Milestone / Batas Waktu</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  // CSV Export for quick raw data
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
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_hari_bursa_pubex_${timeline.config.stockCode || 'emiten'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredDays = timeline.auditTrail.filter((item) => {
    if (filterMode === 'trading_only') return item.isExchangeTradingDay;
    if (filterMode === 'holidays_only') return !item.isExchangeTradingDay;
    if (filterMode === 'milestones_only') return !!item.milestoneEvent;
    return true;
  });

  const weekendCount = timeline.auditTrail.filter((d) => d.isWeekend).length;
  const holidayCount = timeline.auditTrail.filter((d) => d.isHoliday && !d.isWeekend).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden">
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 border-b border-slate-200/80 bg-gradient-to-b from-slate-50/70 to-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Audit &amp; Kalender Bulanan
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Verifikasi Hari Bursa BEI
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-indigo-600" />
              <span>Matriks Kalender &amp; Audit Hari Bursa</span>
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl">
              Melihat penanggalan jadwal Public Expose, hari kerja bursa resmi, dan hari libur pasar modal dalam matriks kalender interaktif.
            </p>
          </div>

          {/* Action buttons & View toggles */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Switcher: Matrix vs Table */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/70 shadow-xs">
              <button
                type="button"
                onClick={() => setSubView('matrix')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  subView === 'matrix'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Matriks Kalender</span>
              </button>
              <button
                type="button"
                onClick={() => setSubView('table')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  subView === 'table'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Tabel Rincian</span>
              </button>
            </div>

            {/* Export Buttons */}
            <button
              onClick={exportExcel}
              title="Unduh format spreadsheet Excel (.xls)"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/90 rounded-xl border border-emerald-300 shadow-xs transition-all hover:scale-105 active:scale-95"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Ekspor Excel (.xls)</span>
            </button>

            <button
              onClick={exportCSV}
              title="Unduh format data mentah CSV"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Metric Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">Total Rentang Kalender:</span>
            <div className="text-lg font-extrabold font-mono text-slate-900 mt-0.5">
              {timeline.totalCalendarDaysSpan} <span className="text-xs font-sans font-semibold text-slate-600">Hari</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 shadow-2xs">
            <span className="text-[11px] text-emerald-800 font-semibold block">Hari Bursa Aktif:</span>
            <div className="text-lg font-extrabold font-mono text-emerald-900 mt-0.5">
              {timeline.totalTradingDaysSpan} <span className="text-xs font-sans font-semibold text-emerald-700">Hari Bursa</span>
            </div>
          </div>
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 shadow-2xs">
            <span className="text-[11px] text-amber-800 font-semibold block">Libur Bursa / Nasional:</span>
            <div className="text-lg font-extrabold font-mono text-amber-900 mt-0.5">
              {holidayCount} <span className="text-xs font-sans font-semibold text-amber-700">Hari</span>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">Akhir Pekan:</span>
            <div className="text-lg font-extrabold font-mono text-slate-800 mt-0.5">
              {weekendCount} <span className="text-xs font-sans font-semibold text-slate-600">Hari</span>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: MATRIKS KALENDER (As requested from screenshot) */}
      {subView === 'matrix' && (
        <div className="p-4 sm:p-6">
          {/* Calendar Month Navigation Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">
                Kalender Tahapan Public Expose
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-500">
                Peringatan dan batas waktu sesuai Kep-00087/BEI/12-2025
              </span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleTodayMonth}
                className="px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
              >
                Bulan Ini
              </button>

              <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
                  title="Bulan sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="px-3 text-xs sm:text-sm font-extrabold text-slate-900 min-w-[140px] text-center font-mono">
                  {INDONESIAN_MONTHS[currentMonth]} {currentYear}
                </div>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
                  title="Bulan berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid Container */}
          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              {/* Day of Week Headers (MIN, SEN, SEL, RAB, KAM, JUM, SAB) */}
              <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                {['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'].map((dayHeader, idx) => {
                  const isSun = idx === 0;
                  const isSat = idx === 6;
                  return (
                    <div
                      key={dayHeader}
                      className={`py-2 text-xs font-extrabold tracking-wider rounded-lg ${
                        isSun
                          ? 'text-rose-600 bg-rose-50/70'
                          : isSat
                          ? 'text-amber-700 bg-amber-50/60'
                          : 'text-slate-700 bg-slate-50'
                      }`}
                    >
                      {dayHeader}
                    </div>
                  );
                })}
              </div>

              {/* Calendar Day Cells */}
              <div className="grid grid-cols-7 gap-2">
                {calendarCells.map((cell, idx) => {
                  if (!cell.isCurrentMonth) {
                    return (
                      <div
                        key={`empty-${idx}`}
                        className="min-h-[105px] rounded-xl bg-slate-50/40 border border-dashed border-slate-200/60 p-2 opacity-35"
                      />
                    );
                  }

                  const isHariH = cell.milestone?.stageNumber === 3;
                  const isTahap1 = cell.milestone?.stageNumber === 1;
                  const isTahap2 = cell.milestone?.stageNumber === 2;
                  const isTahap4 = cell.milestone?.stageNumber === 4;

                  // Holiday is determined either from timeline auditItem OR directly from holidays.csv (holiday)
                  const holidayInfo = cell.auditItem?.holidayName 
                    ? { name: cell.auditItem.holidayName, isCuti: cell.auditItem.holidayName.toLowerCase().includes('cuti') }
                    : cell.holiday
                    ? { name: cell.holiday.name, isCuti: cell.holiday.isJointHoliday }
                    : null;
                  const hasHoliday = !!holidayInfo && !cell.isWeekend;
                  const isTrading = cell.auditItem?.isExchangeTradingDay;

                  // Today check
                  const nowStr = new Date().toISOString().split('T')[0];
                  const isToday = cell.dateString === nowStr;

                  return (
                    <div
                      key={cell.dateString}
                      className={`min-h-[110px] sm:min-h-[120px] rounded-xl border p-2 flex flex-col justify-between transition-all duration-200 relative group ${
                        isHariH
                          ? 'bg-gradient-to-b from-emerald-600 to-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-200 scale-[1.02] z-10'
                          : cell.milestone
                          ? 'bg-gradient-to-b from-blue-50/90 to-indigo-50/60 border-blue-300 shadow-xs'
                          : hasHoliday
                          ? 'bg-rose-50/70 border-rose-200 hover:border-rose-300'
                          : cell.isWeekend
                          ? 'bg-slate-50/60 border-slate-200/70 text-slate-400'
                          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Cell Header: Day Number & Mini Badges */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-extrabold font-mono leading-none ${
                            isHariH
                              ? 'text-white'
                              : cell.isSunday
                              ? 'text-rose-600'
                              : cell.isSaturday
                              ? 'text-amber-600'
                              : hasHoliday
                              ? 'text-rose-700'
                              : 'text-slate-800'
                          }`}
                        >
                          {cell.dayNumber}
                        </span>

                        <div className="flex items-center gap-1">
                          {isToday && (
                            <span
                              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                                isHariH
                                  ? 'bg-white text-emerald-800 font-bold'
                                  : 'bg-blue-600 text-white animate-pulse'
                              }`}
                            >
                              Hari Ini
                            </span>
                          )}

                          {cell.auditItem?.tradingDayCounter && !isHariH && (
                            <span
                              title={`Hari Bursa Ke-#${cell.auditItem.tradingDayCounter}`}
                              className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1 rounded"
                            >
                              #{cell.auditItem.tradingDayCounter}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Cell Content: Milestones & Holiday Badges */}
                      <div className="mt-1 space-y-1">
                        {/* Milestone Event Pills with Interactive Hover & Click Full Detail */}
                        {cell.milestone && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              if (cell.milestone) {
                                setActivePopupMilestone({
                                  milestone: cell.milestone,
                                  dateStr: cell.dateString,
                                  tradingCounter: cell.auditItem?.tradingDayCounter,
                                });
                              }
                            }}
                            className={`p-1.5 rounded-lg text-left shadow-2xs cursor-pointer transition-all duration-150 hover:scale-[1.03] active:scale-95 group/pill relative overflow-hidden ${
                              isHariH
                                ? 'bg-white text-emerald-950 font-extrabold border border-white/80 hover:bg-emerald-50 shadow-sm'
                                : isTahap1
                                ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200/80'
                                : isTahap2
                                ? 'bg-purple-100 text-purple-900 border border-purple-300 hover:bg-purple-200/80'
                                : 'bg-blue-100 text-blue-900 border border-blue-300 hover:bg-blue-200/80'
                            }`}
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] font-extrabold uppercase tracking-tight block">
                                {isHariH ? 'PELAKSANAAN' : `TAHAP 0${cell.milestone.stageNumber}`}
                              </span>
                              <span className="text-[9px] font-mono font-bold block opacity-80 leading-tight">
                                {cell.milestone.dayOffsetLabel}
                              </span>
                            </div>
                            <div className="text-[10px] font-bold line-clamp-2 leading-tight mt-1 text-slate-900">
                              {cell.milestone.title}
                            </div>

                            {/* Floating Tooltip Hover */}
                            <div className="hidden group-hover/pill:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 sm:w-64 p-2.5 bg-slate-900 text-white text-[11px] rounded-xl shadow-2xl border border-slate-700 z-50 pointer-events-none transition-all animate-in fade-in duration-150">
                              <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5 mb-1.5">
                                <span className="font-extrabold text-amber-300 text-[10px] uppercase">
                                  Tahap 0{cell.milestone.stageNumber} · {cell.milestone.dayOffsetLabel}
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono">
                                  Klik untuk detail
                                </span>
                              </div>
                              <p className="font-bold text-white text-xs leading-snug">
                                {cell.milestone.title}
                              </p>
                              <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
                                {cell.milestone.subtitle}
                              </p>
                              <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-blue-300 font-mono flex items-center justify-between">
                                <span>{cell.milestone.formattedDate}</span>
                                <span>{cell.milestone.regulationRef}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Public Holiday Pill (from holiday.csv / calendar) */}
                        {hasHoliday && !cell.milestone && (
                          <div 
                            title={holidayInfo?.name}
                            className="p-1 rounded bg-rose-100 text-rose-800 border border-rose-200/90 text-[10px] font-medium leading-tight shadow-2xs group/holiday relative"
                          >
                            <span className="font-extrabold block text-[9px] uppercase tracking-tight text-rose-900 flex items-center justify-between">
                              <span>{holidayInfo?.isCuti ? 'Cuti Bersama' : 'Libur Bursa'}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            </span>
                            <span className="line-clamp-2 mt-0.5 text-[10px] font-semibold text-rose-900 leading-tight">
                              {holidayInfo?.name}
                            </span>

                            {/* Floating tooltip hover for long holiday names */}
                            <div className="hidden group-hover/holiday:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg shadow-xl border border-slate-700 z-50 pointer-events-none">
                              <span className="text-rose-300 font-bold block mb-0.5">
                                {holidayInfo?.isCuti ? 'Cuti Bersama BEI' : 'Libur Nasional / Bursa'}
                              </span>
                              <p className="text-slate-100 font-medium leading-tight">{holidayInfo?.name}</p>
                            </div>
                          </div>
                        )}

                        {/* Weekend label if no milestone or holiday */}
                        {cell.isWeekend && !cell.milestone && !cell.holiday && (
                          <span className="text-[10px] text-slate-400 font-mono block text-center">
                            Tutup
                          </span>
                        )}

                        {/* Weekend with holiday name */}
                        {cell.isWeekend && cell.holiday && !cell.milestone && (
                          <div 
                            title={cell.holiday.name}
                            className="p-1 rounded bg-rose-50 text-rose-700 border border-rose-200/60 text-[9px] font-medium leading-tight"
                          >
                            <span className="line-clamp-1">{cell.holiday.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Footer micro info */}
                      <div className="mt-auto pt-1">
                        {isHariH && (
                          <span className="text-[10px] font-bold text-emerald-100 block text-center">
                            Hari H Pubex
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Calendar Legend */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Keterangan Warna:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-600" />
              <span className="font-semibold text-slate-800">Hari H Pelaksanaan (Tahap 3)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-amber-200 border border-amber-400" />
              <span className="font-medium text-slate-700">Tahap 1: Laporan Rencana</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-purple-200 border border-purple-400" />
              <span className="font-medium text-slate-700">Tahap 2: Materi Paparan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-blue-200 border border-blue-400" />
              <span className="font-medium text-slate-700">Tahap 4: Laporan Hasil</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-rose-100 border border-rose-300" />
              <span className="font-medium text-slate-700">Libur Bursa / Nasional</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: TABEL RINCIAN (Day-by-Day Audit Table) */}
      {subView === 'table' && (
        <div>
          {/* Table Filters */}
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  filterMode === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                Semua Hari ({timeline.auditTrail.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('trading_only')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  filterMode === 'trading_only'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                Hanya Hari Bursa ({timeline.totalTradingDaysSpan})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('holidays_only')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  filterMode === 'holidays_only'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                Hanya Libur/Weekend ({weekendCount + holidayCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('milestones_only')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  filterMode === 'milestones_only'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                Milestone (4 Tahap)
              </button>
            </div>
          </div>

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
                {filteredDays.map((item) => {
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
        </div>
      )}

      {/* Footer Info */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span>
          Catatan: Hari Bursa dihitung murni hari operasional perdagangan BEI (Senin-Jumat, mengecualikan Hari Libur Nasional &amp; Cuti Bersama). Ekspor Excel memuat ringkasan tahapan lengkap dan audit trail hari bursa.
        </span>
      </div>

      {/* POPUP MODAL: TAMPILAN FULL DETAIL JADWAL KETIKA DIKLIK / DISOROT */}
      {activePopupMilestone && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setActivePopupMilestone(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Badge */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase ${
                      activePopupMilestone.milestone.stageNumber === 3
                        ? 'bg-emerald-600 text-white'
                        : activePopupMilestone.milestone.stageNumber === 1
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : activePopupMilestone.milestone.stageNumber === 2
                        ? 'bg-purple-100 text-purple-900 border border-purple-300'
                        : 'bg-blue-100 text-blue-900 border border-blue-300'
                    }`}
                  >
                    Tahap 0{activePopupMilestone.milestone.stageNumber}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {activePopupMilestone.milestone.dayOffsetLabel}
                  </span>
                  {activePopupMilestone.tradingCounter && (
                    <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      Hari Bursa #{activePopupMilestone.tradingCounter}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 pt-1">
                  {activePopupMilestone.milestone.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActivePopupMilestone(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Info */}
            <div className="py-4 space-y-3.5 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-slate-500 font-medium">
                  <span>Tanggal Penetapan:</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    {activePopupMilestone.milestone.formattedDate}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 font-medium">
                  <span>Dasar Regulasi BEI:</span>
                  <span className="font-mono font-semibold text-blue-700">
                    {activePopupMilestone.milestone.regulationRef}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">
                  Keterangan Lengkap &amp; Deskripsi:
                </span>
                <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100 text-xs">
                  {activePopupMilestone.milestone.description}
                </p>
              </div>

              {activePopupMilestone.milestone.requiredChecklist && activePopupMilestone.milestone.requiredChecklist.length > 0 && (
                <div>
                  <span className="font-bold text-slate-900 block mb-1.5">
                    Checklist Dokumen / Tindakan Wajib:
                  </span>
                  <ul className="space-y-1.5">
                    {activePopupMilestone.milestone.requiredChecklist.map((c) => (
                      <li key={c.id} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{c.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setActivePopupMilestone(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
