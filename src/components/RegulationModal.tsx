import React from 'react';
import { X, BookOpen, ExternalLink, ShieldAlert, CheckCircle, Scale } from 'lucide-react';

interface RegulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegulationModal: React.FC<RegulationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Regulasi Resmi Public Expose BEI
              </h3>
              <span className="text-xs font-mono text-slate-500">
                Kep-00087/BEI/12-2025 · Peraturan Nomor I-E
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Summary Box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Peraturan Nomor I-E: Kewajiban Penyampaian Informasi
            </h4>
            <p className="text-slate-600">
              Berdasarkan Keputusan Direksi PT Bursa Efek Indonesia Nomor Kep-00087/BEI/12-2025, setiap Perusahaan Tercatat memiliki kewajiban menyelenggarakan Public Expose sekurang-kurangnya 1 (satu) kali dalam setahun dan wajib mematuhi tenggat waktu pelaporan dalam satuan <strong>Hari Bursa</strong>.
            </p>
          </div>

          {/* Exact Text Sections */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Naskah Asli Peraturan: Angka III.3.3 Tata Cara Pelaksanaan Public Expose
            </h4>

            {/* III.3.3.1 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-2 mb-2 font-mono font-bold text-slate-900 text-sm">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs">
                  III.3.3.1
                </span>
                <span>Laporan Rencana Penyelenggaraan Public Expose</span>
              </div>
              <p className="italic text-slate-800 mb-2">
                &ldquo;Perusahaan Tercatat wajib menyampaikan keterbukaan informasi mengenai rencana penyelenggaraan Public Expose paling lambat <strong>10 (sepuluh) Hari Bursa</strong> sebelum penyelenggaraan Public Expose dimaksud, dan informasi tersebut memuat antara lain hal-hal sebagai berikut:&rdquo;
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600 font-mono text-[11px]">
                <li><strong>III.3.3.1.1.</strong> tanggal dan jam penyelenggaraan Public Expose;</li>
                <li><strong>III.3.3.1.2.</strong> tempat penyelenggaraan Public Expose;</li>
                <li><strong>III.3.3.1.3.</strong> direktur yang akan hadir pada Public Expose.</li>
              </ul>
            </div>

            {/* III.3.3.2 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-2 mb-2 font-mono font-bold text-slate-900 text-sm">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs">
                  III.3.3.2
                </span>
                <span>Penyampaian Materi Public Expose</span>
              </div>
              <p className="italic text-slate-800 mb-2">
                &ldquo;Perusahaan Tercatat wajib menyampaikan materi Public Expose kepada Bursa paling lambat <strong>3 (tiga) Hari Bursa</strong> sebelum tanggal penyelenggaraan Public Expose, yang antara lain meliputi hal-hal sebagai berikut:&rdquo;
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600 font-mono text-[11px]">
                <li><strong>III.3.3.2.1.</strong> telaahan kinerja keuangan dan operasi yang terkini yang dapat diungkapkan;</li>
                <li><strong>III.3.3.2.2.</strong> kendala-kendala yang dihadapi, termasuk kondisi ketidakpastian (jika ada);</li>
                <li><strong>III.3.3.2.3.</strong> upaya untuk meningkatkan kinerja Perusahaan Tercatat;</li>
                <li><strong>III.3.3.2.4.</strong> target kinerja perusahaan tahun berjalan;</li>
                <li><strong>III.3.3.2.5.</strong> proyeksi keuangan (jika ada). Dalam hal Perusahaan Tercatat menyampaikan proyeksi keuangan, maka proyeksi keuangan tersebut harus disertai hasil review dari Akuntan Publik;</li>
                <li><strong>III.3.3.2.6.</strong> hal-hal lain yang dipandang perlu diungkapkan kepada publik oleh Perusahaan Tercatat.</li>
              </ul>
            </div>

            {/* III.3.3.3 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-2 mb-2 font-mono font-bold text-slate-900 text-sm">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs">
                  III.3.3.3
                </span>
                <span>Penyelenggaraan Public Expose (Hari H)</span>
              </div>
              <p className="italic text-slate-800">
                &ldquo;Penyelenggaraan Public Expose dilaksanakan di kantor Bursa atau di tempat lain, pada waktu dan tempat yang memungkinkan kehadiran para pemodal, analis, fund manager, wakil Anggota Bursa Efek dan media massa.&rdquo;
              </p>
            </div>

            {/* III.3.3.4 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-2 mb-2 font-mono font-bold text-slate-900 text-sm">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs">
                  III.3.3.4
                </span>
                <span>Laporan Hasil Pelaksanaan Public Expose</span>
              </div>
              <p className="italic text-slate-800 mb-2">
                &ldquo;Perusahaan Tercatat wajib menyampaikan kepada Bursa laporan pelaksanaan Public Expose paling lambat <strong>3 (tiga) Hari Bursa</strong> setelah pelaksanaan Public Expose, yang antara lain memuat ringkasan pertanyaan peserta Public Expose dan jawaban dari Perusahaan Tercatat serta resume hasil Public Expose tersebut, dengan melampirkan salinan daftar hadir.&rdquo;
              </p>
            </div>
          </div>

          {/* Sanksi & Keterlambatan */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-900">
              <ShieldAlert className="w-4 h-4 text-rose-700" />
              <span>Sanksi Keterlambatan Penyampaian Laporan ke BEI</span>
            </div>
            <p className="text-xs text-rose-900">
              Sesuai ketentuan Peraturan I-H tentang Sanksi Bursa Efek Indonesia:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-800 pl-1">
              <li><strong>Peringatan Tertulis I:</strong> Diberikan atas keterlambatan hingga hari ke-30 kalender.</li>
              <li><strong>Peringatan Tertulis II &amp; Denda Finansial:</strong> Denda keterlambatan hingga puluhan juta rupiah.</li>
              <li><strong>Suspensi Perdagangan Saham:</strong> Penghentian sementara perdagangan efek apabila kewajiban Public Expose tahunan tidak dipenuhi sampai batas akhir tahun buku.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between rounded-b-2xl">
          <span className="text-[11px] text-slate-500 font-mono">
            Sumber: Salinan Resmi Kep-00087/BEI/12-2025
          </span>
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
