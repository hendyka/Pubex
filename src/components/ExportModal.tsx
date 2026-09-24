import React, { useState } from 'react';
import {
  X,
  Share2,
  Calendar,
  MessageSquare,
  Copy,
  Check,
  Printer,
  Link2,
  FileDown,
} from 'lucide-react';
import { TimelineResult, PubexConfig } from '../types';
import { generateICSContent, generateWhatsAppMessage } from '../utils/calculator';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeline: TimelineResult;
  config: PubexConfig;
  onPrint: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  timeline,
  config,
  onPrint,
}) => {
  const [copiedType, setCopiedType] = useState<'wa' | 'link' | null>(null);

  if (!isOpen) return null;

  const waText = generateWhatsAppMessage(timeline, config);

  const getShareableURL = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('date', config.targetDate);
    url.searchParams.set('mode', config.calculationMode);
    if (config.stockCode) url.searchParams.set('code', config.stockCode);
    if (config.companyName) url.searchParams.set('name', config.companyName);
    if (config.format) url.searchParams.set('format', config.format);
    return url.toString();
  };

  const copyWhatsApp = () => {
    navigator.clipboard.writeText(waText);
    setCopiedType('wa');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(getShareableURL());
    setCopiedType('link');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const downloadICS = () => {
    const icsData = generateICSContent(timeline, config);
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Timeline_Pubex_${config.stockCode || 'Emiten'}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Ekspor &amp; Bagikan Timeline Pubex
              </h3>
              <p className="text-xs text-slate-500">
                Kirimkan pengingat kepatuhan BEI kepada tim Corporate Secretary &amp; Direksi.
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

        {/* Content options */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* Option 1: Calendar File (.ics) */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all bg-white flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Unduh File Kalender (.ICS)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sinkronkan 4 milestone deadline Public Expose ke Google Calendar, Outlook, atau Apple Calendar (termasuk alarm H-1).
              </p>
            </div>
            <button
              onClick={downloadICS}
              className="px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shrink-0 inline-flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Unduh .ICS</span>
            </button>
          </div>

          {/* Option 2: Copy WA Memo */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Format Memo WhatsApp / Email</span>
              </div>
              <button
                onClick={copyWhatsApp}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {copiedType === 'wa' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Teks Memo</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-700 whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed">
              {waText}
            </pre>
          </div>

          {/* Option 3: Shareable URL */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <Link2 className="w-4 h-4 text-slate-700" />
                <span>Tautan Langsung (Shareable Link)</span>
              </div>
              <button
                onClick={copyShareLink}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
              >
                {copiedType === 'link' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tautan Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>
            </div>
            <input
              type="text"
              readOnly
              value={getShareableURL()}
              className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-md text-slate-600 focus:outline-none"
            />
          </div>

          {/* Option 4: Print Memo */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Cetak Lembar Memo Kepatuhan (Print / PDF)</span>
              </div>
              <p className="text-xs text-slate-500">
                Format resmi rapi siap ditandatangani atau diarsipkan sebagai dokumen kepatuhan internal.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onPrint();
              }}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Memo</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
