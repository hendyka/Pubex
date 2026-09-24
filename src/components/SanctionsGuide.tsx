import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  FileText,
  Clock,
  HelpCircle,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';

export const SanctionsGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Panduan Kepatuhan Public Expose Bursa Efek Indonesia
            </h2>
            <p className="text-xs text-slate-500">
              Rujukan Kep-00087/BEI/12-2025 Peraturan Nomor I-E tentang Kewajiban Penyampaian Informasi
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Public Expose (Paparan Publik) merupakan sarana keterbukaan informasi wajib bagi Perusahaan Tercatat untuk memaparkan performa keuangan, strategi bisnis, kendala usaha, dan proyeksi kepada para pemodal, analis pasar modal, dan publik. Kepatuhan terhadap batas waktu dalam satuan <strong>Hari Bursa</strong> adalah mutlak guna menghindari sanksi administratif dan denda dari PT Bursa Efek Indonesia.
        </p>
      </div>

      {/* The 4 Stage Matrix Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          Matriks 4 Tahapan Utama Public Expose
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Stage 1 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                Tahap 01
              </span>
              <span className="font-mono font-bold text-blue-700">H-10 Hari Bursa</span>
            </div>
            <h4 className="font-bold text-slate-900">Laporan Rencana Penyelenggaraan</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Keterbukaan informasi mengenai tanggal, jam, tempat (atau tautan elektronik), dan nama Direktur yang akan hadir. Disampaikan via SPE / IDXnet.
            </p>
            <span className="text-[10px] text-slate-500 font-mono block">Rujukan: III.3.3.1</span>
          </div>

          {/* Stage 2 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                Tahap 02
              </span>
              <span className="font-mono font-bold text-blue-700">H-3 Hari Bursa</span>
            </div>
            <h4 className="font-bold text-slate-900">Penyampaian Materi Public Expose</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Materi tayang memuat telaahan keuangan, operasional, kendala usaha, target tahunan, dan proyeksi keuangan (jika ada proyeksi wajib review Akuntan Publik).
            </p>
            <span className="text-[10px] text-slate-500 font-mono block">Rujukan: III.3.3.2</span>
          </div>

          {/* Stage 3 */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs bg-blue-700 text-white px-2 py-0.5 rounded">
                Tahap 03
              </span>
              <span className="font-mono font-bold text-blue-700">Hari H Pelaksanaan</span>
            </div>
            <h4 className="font-bold text-slate-900">Penyelenggaraan Public Expose</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Diselenggarakan di kantor Bursa atau tempat lain (termasuk daring/webinar). Wajib dihadiri sekurang-kurangnya 1 orang Direktur Perusahaan Tercatat.
            </p>
            <span className="text-[10px] text-slate-500 font-mono block">Rujukan: III.3.3.3</span>
          </div>

          {/* Stage 4 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                Tahap 04
              </span>
              <span className="font-mono font-bold text-blue-700">H+3 Hari Bursa</span>
            </div>
            <h4 className="font-bold text-slate-900">Laporan Hasil Pelaksanaan</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Laporan resmi ke BEI memuat resume hasil pubex, rangkuman pertanyaan &amp; jawaban peserta, serta salinan daftar hadir resmi.
            </p>
            <span className="text-[10px] text-slate-500 font-mono block">Rujukan: III.3.3.4</span>
          </div>
        </div>
      </div>

      {/* Sanksi & Denda BEI */}
      <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-5 sm:p-6 text-xs text-rose-950 space-y-3">
        <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
          <ShieldAlert className="w-5 h-5 text-rose-700" />
          <span>Sanksi Keterlambatan dan Tidak Memenuhi Kewajiban Pubex</span>
        </div>
        <p className="leading-relaxed">
          Bursa Efek Indonesia memberlakukan pengawasan ketat terhadap kewajiban penyampaian laporan berkala dan insidentil sesuai Peraturan Nomor I-H:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3 bg-white rounded-lg border border-rose-200">
            <span className="font-bold text-rose-900 block mb-1">Peringatan Tertulis I</span>
            <span className="text-[11px] text-rose-800">
              Diterbitkan atas keterlambatan hingga hari kalender ke-30 sejak batas akhir kewajiban pelaporan.
            </span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-rose-200">
            <span className="font-bold text-rose-900 block mb-1">Peringatan Tertulis II &amp; Denda</span>
            <span className="text-[11px] text-rose-800">
              Denda finansial keterlambatan pelaporan dan peringatan resmi jika belum menyampaikan hingga hari ke-60.
            </span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-rose-200">
            <span className="font-bold text-rose-900 block mb-1">Suspensi Perdagangan Efek</span>
            <span className="text-[11px] text-rose-800">
              Penghentian sementara perdagangan saham emiten jika kewajiban Public Expose Tahunan tidak dipenuhi sampai akhir tahun berjalan.
            </span>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          Pertanyaan Sering Diajukan (FAQ) Terkait Public Expose
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">
              1. Mengapa batas waktu dihitung dalam "Hari Bursa" bukan "Hari Kalender"?
            </span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Ketentuan Peraturan Nomor I-E secara tegas menyatakan frasa &ldquo;Hari Bursa&rdquo; (angka III.3.3.1, III.3.3.2, III.3.3.4). Hari Bursa mengesampingkan hari Sabtu, Minggu, libur nasional, dan cuti bersama Bursa Efek Indonesia.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">
              2. Apakah boleh menyelenggarakan Public Expose secara virtual / webinar?
            </span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Boleh. Ketentuan III.3.3.3 membolehkan di kantor bursa atau tempat lain yang memungkinkan kehadiran para pemodal dan analis secara luas. Penyelenggaraan via Zoom Webinar / live streaming diizinkan dengan menyertakan tautan pendaftaran pada keterbukaan informasi H-10.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">
              3. Apakah materi tayang harus diunggah sebelum hari pelaksanaan?
            </span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Ya, wajib diunggah ke Bursa paling lambat 3 Hari Bursa sebelum tanggal acara (III.3.3.2). Hal ini bertujuan agar para analis dan calon peserta dapat mempelajari isi materi dan menyiapkan pertanyaan substantif sebelum sesi dimulai.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">
              4. Apa syarat materi yang memuat proyeksi keuangan emiten?
            </span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Berdasarkan III.3.3.2.5, dalam hal Perusahaan Tercatat menyampaikan proyeksi keuangan, maka proyeksi keuangan tersebut wajib disertai hasil review dari Akuntan Publik.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
