import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  AlertCircle,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  HelpCircle,
} from 'lucide-react';
import { TimelineResult, StageMilestone } from '../types';

interface TimelineVisualizerProps {
  timeline: TimelineResult;
}

export const TimelineVisualizer: React.FC<TimelineVisualizerProps> = ({ timeline }) => {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [expandedStages, setExpandedStages] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
  });
  const [copiedStageId, setCopiedStageId] = useState<string | null>(null);

  const toggleCheck = (itemId: string) => {
    setCompletedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const toggleExpand = (stageNumber: number) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stageNumber]: !prev[stageNumber],
    }));
  };

  const copyStageTasks = (milestone: StageMilestone) => {
    const text = `*TAHAP ${milestone.stageNumber}: ${milestone.title.toUpperCase()}*\n📅 Batas Waktu: ${milestone.formattedDate} (${milestone.dayOffsetLabel})\n⚖️ Dasar Regulasi: ${milestone.regulationRef}\n\nDaftar Muatan Wajib Sesuai BEI:\n${milestone.requiredChecklist.map((c) => `[ ] ${c.code}: ${c.text}`).join('\n')}\n\nCatatan Praktis:\n${milestone.practicalNotes.map((n) => `• ${n}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedStageId(milestone.id);
    setTimeout(() => setCopiedStageId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Metric Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-xs text-slate-400 block">Total Hari Bursa</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold font-mono text-white">
                {timeline.totalTradingDaysSpan}
              </span>
              <span className="text-xs text-slate-400">Hari Bursa</span>
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Total Rentang Kalender</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold font-mono text-white">
                {timeline.totalCalendarDaysSpan}
              </span>
              <span className="text-xs text-slate-400">Hari Kalender</span>
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Dasar Regulasi BEI</span>
            <div className="mt-1">
              <span className="text-sm font-semibold text-blue-300 block font-mono">
                Peraturan Nomor I-E
              </span>
              <span className="text-[11px] text-slate-400">Kep-00087/BEI/12-2025</span>
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Status Pelaksanaan</span>
            <div className="mt-1">
              <span className="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                Wajib Dilaporkan di SPE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Step Pipeline Header */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200 p-4">
        <div className="grid grid-cols-4 relative">
          <div className="absolute top-5 left-12 right-12 h-0.5 bg-slate-200 -z-0" />
          {timeline.milestones.map((stage) => {
            const isTarget = stage.stageNumber === 3;
            return (
              <div key={stage.id} className="flex flex-col items-center text-center px-2 z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs font-mono transition-transform ${
                    isTarget
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-white border-2 border-slate-700 text-slate-800 shadow-xs'
                  }`}
                >
                  0{stage.stageNumber}
                </div>
                <span className="mt-2 text-xs font-bold text-slate-900 line-clamp-1">
                  {stage.title}
                </span>
                <span className="text-[11px] font-mono font-medium text-blue-700 mt-0.5">
                  {stage.dayOffsetLabel}
                </span>
                <span className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {stage.formattedDate.split(', ')[1]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* The 4 Stage Cards */}
      <div className="space-y-4">
        {timeline.milestones.map((milestone) => {
          const isExpanded = expandedStages[milestone.stageNumber];
          const isPelaksanaan = milestone.stageNumber === 3;
          const stageChecklist = milestone.requiredChecklist;
          const totalItems = stageChecklist.length;
          const doneItems = stageChecklist.filter((item) => completedItems[item.id]).length;
          const isAllChecked = totalItems > 0 && doneItems === totalItems;

          return (
            <div
              key={milestone.id}
              className={`bg-white rounded-xl border transition-all ${
                isPelaksanaan
                  ? 'border-blue-300 ring-1 ring-blue-100 shadow-sm'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 sm:p-5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0 ${
                        isPelaksanaan
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-900 border border-slate-200'
                      }`}
                    >
                      0{milestone.stageNumber}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {milestone.dayOffsetLabel}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {milestone.regulationRef}
                        </span>
                        {isPelaksanaan && (
                          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Hari H Pelaksanaan
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {milestone.title}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {milestone.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Date & Countdown Block */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 gap-2">
                    <div className="text-left md:text-right">
                      <span className="text-xs text-slate-500 block">Batas Waktu Pelaporan:</span>
                      <span className="text-sm sm:text-base font-bold text-slate-900 font-mono">
                        {milestone.formattedDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {milestone.status === 'today' ? (
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          Hari Ini
                        </span>
                      ) : milestone.status === 'past' ? (
                        <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                          Telah Berlalu
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Tersisa {milestone.tradingDaysRemaining} Hari Bursa ({milestone.daysRemaining} hari kalender)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description Text */}
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-start gap-2">
                  <span className="text-slate-400 font-semibold shrink-0">Ringkasan:</span>
                  <span>{milestone.description}</span>
                </div>

                {/* Progress Mini Bar & Controls */}
                <div className="mt-4 flex items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-600">
                      Kesiapan Dokumen:
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-900">
                      {doneItems} / {totalItems}
                    </span>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${totalItems ? (doneItems / totalItems) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyStageTasks(milestone)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                      title="Salin rincian tugas tahap ini"
                    >
                      {copiedStageId === milestone.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Tugas</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleExpand(milestone.stageNumber)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                    >
                      <span>{isExpanded ? 'Sembunyikan Checklist' : 'Lihat Checklist & Poin Wajib'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable Checklist & Compliance Details */}
              {isExpanded && (
                <div className="bg-slate-50/70 border-t border-slate-200 p-4 sm:p-5 rounded-b-xl space-y-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                      Checklist Muatan Wajib Sesuai Kep-00087/BEI/12-2025
                    </span>

                    <div className="space-y-2">
                      {milestone.requiredChecklist.map((item) => {
                        const isChecked = !!completedItems[item.id];
                        return (
                          <div
                            key={item.id}
                            onClick={() => toggleCheck(item.id)}
                            className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                              isChecked
                                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                            }`}
                          >
                            <button
                              type="button"
                              className="mt-0.5 shrink-0 focus:outline-none"
                              aria-label={item.text}
                            >
                              {isChecked ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-400" />
                              )}
                            </button>

                            <div className="flex-1 text-xs">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono font-semibold text-[11px] text-slate-600">
                                  {item.code}
                                </span>
                                {item.required ? (
                                  <span className="text-[10px] font-medium text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                    Wajib
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                    Kondisional
                                  </span>
                                )}
                              </div>
                              <p className={`mt-0.5 ${isChecked ? 'line-through text-slate-500' : 'text-slate-800 font-medium'}`}>
                                {item.text}
                              </p>
                              <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                                Rujukan: {item.regulationRef}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Practical Secretary Notes */}
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                      Catatan Praktis Corporate Secretary / Tim Kepatuhan:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
                      {milestone.practicalNotes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
