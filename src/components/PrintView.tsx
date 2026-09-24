import React from 'react';
import { TimelineResult, PubexConfig } from '../types';
import { formatIndonesianDate } from '../utils/calculator';

interface PrintViewProps {
  timeline: TimelineResult;
  config: PubexConfig;
}

export const PrintView: React.FC<PrintViewProps> = ({ timeline, config }) => {
  const printDateStr = formatIndonesianDate(new Date());

  return (
    <div className="hidden print:block p-8 bg-white text-black font-sans max-w-4xl mx-auto text-xs leading-normal">
      {/* Official Header */}
      <div className="border-b-2 border-black pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight">
              MEMORANDUM KEPATUHAN KORPORASI
            </h1>
            <p className="text-sm font-semibold uppercase text-slate-800 mt-1">
              Rencana &amp; Jadwal Penyelenggaraan Public Expose
            </p>
            <p className="text-[11px] font-mono mt-0.5">
              Rujukan Hukum: Kep-00087/BEI/12-2025 · Peraturan Nomor I-E Bursa Efek Indonesia
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-sm block">
              {config.stockCode ? `IDX: ${config.stockCode}` : 'PERUSAHAAN TERCATAT'}
            </span>
            <span className="text-[11px] block mt-1">Tanggal Cetak: {printDateStr}</span>
          </div>
        </div>
      </div>

      {/* Metadata Table */}
      <div className="mb-6 p-3 bg-slate-50 border border-slate-300 rounded">
        <div className="grid grid-cols-2 gap-y-2 gap-x-6">
          <div>
            <span className="font-semibold text-slate-700">Nama Perusahaan:</span>{' '}
            <span className="font-bold">{config.companyName || 'PT Perusahaan Terbuka Tbk'}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Kode Saham (Ticker):</span>{' '}
            <span className="font-mono font-bold">{config.stockCode || '-'}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Jenis Public Expose:</span>{' '}
            <span className="capitalize">Public Expose {config.pubexType}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Format Penyelenggaraan:</span>{' '}
            <span className="capitalize">{config.format}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Tempat / Platform:</span>{' '}
            <span>{config.venue || 'Gedung Bursa Efek Indonesia / Webinar'}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Direktur yang Hadir:</span>{' '}
            <span>{config.directors || 'Direksi Perusahaan'}</span>
          </div>
        </div>
      </div>

      {/* 4 Milestones Table */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase mb-2 border-b border-slate-300 pb-1">
          Jadwal 4 Tahapan Utama Public Expose (Perhitungan Hari Bursa)
        </h2>
        <table className="w-full border-collapse border border-slate-300 text-left">
          <thead>
            <tr className="bg-slate-100 font-bold border-b border-slate-300">
              <th className="p-2 border-r border-slate-300 w-12 text-center">Tahap</th>
              <th className="p-2 border-r border-slate-300">Nama Tahap &amp; Ketentuan</th>
              <th className="p-2 border-r border-slate-300 w-32">Batas Hari Bursa</th>
              <th className="p-2 border-r border-slate-300 w-44">Tenggat Tanggal Resmi</th>
              <th className="p-2">Rujukan Pasal BEI</th>
            </tr>
          </thead>
          <tbody>
            {timeline.milestones.map((m) => (
              <tr key={m.id} className="border-b border-slate-200">
                <td className="p-2 border-r border-slate-300 text-center font-bold font-mono">
                  0{m.stageNumber}
                </td>
                <td className="p-2 border-r border-slate-300">
                  <div className="font-bold">{m.title}</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">{m.subtitle}</div>
                </td>
                <td className="p-2 border-r border-slate-300 font-mono font-bold text-center">
                  {m.dayOffsetLabel}
                </td>
                <td className="p-2 border-r border-slate-300 font-bold font-mono">
                  {m.formattedDate}
                </td>
                <td className="p-2 font-mono text-[10px]">{m.regulationRef}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Checklist Muatan Wajib Sesuai BEI */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase mb-2 border-b border-slate-300 pb-1">
          Daftar Kelengkapan Dokumen Wajib (Compliance Checklist)
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {timeline.milestones.map((m) => (
            <div key={m.id} className="border border-slate-200 p-2.5 rounded">
              <span className="font-bold block mb-1.5 font-mono text-[11px]">
                Tahap 0{m.stageNumber}: {m.title}
              </span>
              <ul className="space-y-1 text-[10px]">
                {m.requiredChecklist.map((c) => (
                  <li key={c.id} className="flex items-start gap-1.5">
                    <span className="border border-black w-3 h-3 inline-block shrink-0 mt-0.5" />
                    <span>
                      <strong>[{c.code}]</strong> {c.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Catatan Sanksi & Pengesahan */}
      <div className="border-t border-slate-300 pt-4">
        <p className="text-[10px] text-slate-600 italic leading-relaxed mb-6">
          * Catatan Kepatuhan: Keterlambatan penyampaian laporan sebagaimana diatur dalam Peraturan Nomor I-E dikenakan sanksi denda finansial dan peringatan tertulis oleh Bursa Efek Indonesia. Seluruh perhitungan di atas didasarkan pada kalender Hari Bursa resmi BEI.
        </p>

        <div className="flex justify-between items-end pt-4 px-6 text-center">
          <div>
            <p className="font-semibold mb-12">Disiapkan Oleh:</p>
            <p className="font-bold underline">Tim Corporate Secretary</p>
            <p className="text-[10px] text-slate-500">Divisi Kepatuhan &amp; Legal</p>
          </div>
          <div>
            <p className="font-semibold mb-12">Disetujui Oleh:</p>
            <p className="font-bold underline">Direktur Perusahaan Tercatat</p>
            <p className="text-[10px] text-slate-500">{config.companyName || 'Perusahaan Tercatat'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
