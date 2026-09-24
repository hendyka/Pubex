# 📊 Kalkulator Timeline Public Expose (Paparan Publik - Peraturan BEI No. I-E)

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://publicexpose-iota.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://github.com/hendyka/Pubex/blob/main/LICENSE.md)
[![BEI Compliance](https://img.shields.io/badge/BEI-Peraturan%20I--E-blue?style=for-the-badge)](https://www.idx.co.id)

> **Aplikasi web untuk menghitung dan mensimulasikan alur waktu (timeline) serta batas akhir (deadlines) pelaksanaan Public Expose (Paparan Publik) Perusahaan Terbuka (Tbk) secara otomatis sesuai Peraturan BEI Nomor I-E.**

🚀 **Live Application:** [https://publicexpose-iota.vercel.app/](https://publicexpose-iota.vercel.app/)

---

## 📌 Latar Belakang & Masalah

Setiap Perusahaan Terbuka (Emiten) yang mencatatkan sahamnya di Bursa Efek Indonesia (BEI) **wajib mengadakan Public Expose (Paparan Publik) Tahunan sekurang-kurangnya 1 (satu) kali dalam setahun**. 

Dalam penyusunan jadwal Public Expose, *Corporate Secretary* dan tim *Investor Relations* kerap menghadapi kendala dalam menentukan tenggat waktu karena:

1. **Aturan Hari Bursa:** Seluruh perhitungan tenggat waktu sebelum dan sesudah Public Expose dihitung berdasarkan **Hari Bursa** (Senin–Jumat, di luar libur nasional dan hari libur perdagangan Bursa).
2. **Koordinasi Kritis:** Penyampaian materi dan pengumuman rencana ke Bursa harus dilakukan jauh-jauh hari sebelum tanggal pelaksanaan.
3. **Risiko Sanksi:** Keterlambatan dalam penyampaian laporan pelaksanaan atau materi dapat berakibat pada denda administratif dan sanksi peringatan dari Bursa Efek Indonesia (sesuai Peraturan BEI No. I-H).

Aplikasi **Pubex Calculator** hadir sebagai solusi praktis untuk mengalkulasi seluruh tanggal penting secara presisi, otomatis, dan patuh regulasi.

---

## 🚀 Fitur Utama

- ⏱️ **Kalkulasi Timeline Otomatis:** Cukup masukkan target **Tanggal Pelaksanaan Public Expose**, sistem akan langsung mengalkulasi seluruh batas waktu *milestone* secara otomatis.
- 📆 **Penanganan Hari Bursa:** Mengabaikan akhir pekan (Sabtu-Minggu) dan memperhitungkan kalender libur Bursa Efek Indonesia.
- 📋 **Sesuai Peraturan BEI No. I-E:** Mencakup alur pemberitahuan rencana, pengumuman publik, penyerahan materi, hingga batas akhir penyampaian laporan pelaksanaan.
- 📱 **Desain Responsif & Cepat:** Berbasis web modern yang mudah diakses dari smartphone maupun PC.
- 📤 **Ekspor / Cetak Ringkasan:** Memudahkan koordinasi internal antara *Corporate Secretary*, Direksi, dan konsultan *Public Relations*.

---

## 📊 Matriks Ketentuan Waktu Public Expose (Peraturan BEI No. I-E)

Berdasarkan **Peraturan BEI No. I-E (Kep-00015/BEI/01-2021 & Kep-00087/BEI/12-2025)** tentang Kewajiban Penyampaian Informasi:

| Tahapan Kegiatan | Ketentuan Waktu | Dasar Hukum | Jenis Hari |
| :--- | :--- | :--- | :--- |
| **Pemberitahuan Rencana Pubex ke BEI** | Paling lambat **3 Hari Bursa** sebelum tanggal pelaksanaan | Ketentuan III.3.3.1 | **Hari Bursa** |
| **Pengumuman Pubex ke Publik/Investor** | Paling lambat **3 Hari Bursa** sebelum tanggal pelaksanaan | Ketentuan III.3.3.1 | **Hari Bursa** |
| **Penyampaian Materi Pubex ke BEI** | Paling lambat **3 Hari Bursa** sebelum tanggal pelaksanaan | Ketentuan III.3.3.2 | **Hari Bursa** |
| **PELAKSANAAN PUBLIC EXPOSE** | **Hari H (Target Pelaksanaan)** | Ketentuan III.3.1 | - |
| **Laporan Hasil / Risalah Pubex ke BEI** | Paling lambat **3 Hari Bursa** setelah tanggal pelaksanaan | Ketentuan III.3.3.3 | **Hari Bursa** |

---

## 🧮 Logika Perhitungan Tanggal

Format matematis penentuan tanggal $T$ dihitung berdasarkan rumus selisih Hari Bursa:

1. **Tahap Pra-Pelaksanaan (H-3 Hari Bursa):**

$$
T_{\text{Pemberitahuan/Materi}} \le T_{\text{Pelaksanaan}} - 3 \text{ Hari Bursa}
$$

*(Hari Sabtu, Minggu, dan Hari Libur Bursa tidak dihitung dalam pengurangan $3$ Hari Bursa).*

2. **Tahap Pasca-Pelaksanaan (H+3 Hari Bursa):**

$$
T_{\text{Laporan Hasil}} \le T_{\text{Pelaksanaan}} + 3 \text{ Hari Bursa}
$$

---

## 🔄 Flowchart Alur Public Expose

```text
[ Input: Tanggal Target Public Expose ]
                   │
                   ▼
     ┌──────────────────────────┐
     │   Kalkulasi Hari Bursa   │
     └─────────────┬────────────┘
                   │
                   ├─► Pemberitahuan Rencana ke BEI   (H-3 Hari Bursa)
                   ├─► Pengumuman ke Publik / Investor (H-3 Hari Bursa)
                   └─► Penyampaian Materi ke BEI      (H-3 Hari Bursa)
                   │
                   ▼
      [ 🎯 PELAKSANAAN PUBLIC EXPOSE ]
                   │
                   ▼
                   └─► Laporan Hasil / Risalah ke BEI  (H+3 Hari Bursa)
```

---

## 💻 Cara Menjalankan Proyek Secara Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) (v16.x atau lebih baru)
- Paket manajer (`npm`, `yarn`, atau `pnpm`)

### Langkah-Langkah

```bash
# 1. Clone repositori ini
git clone https://github.com/hendyka/Pubex.git

# 2. Masuk ke folder proyek
cd Pubex

# 3. Install dependensi
npm install

# 4. Jalankan server pengembangan
npm run dev
```

Buka peramban Anda dan akses [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Teknologi yang Digunakan

- **Frontend Framework:** Next.js / React
- **Styling:** Tailwind CSS
- **Deployment Platform:** [Vercel](https://vercel.com/)

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** – Anda bebas untuk menggunakan, menyalin, memodifikasi, menggabungkan, mempublikasikan, dan mendistribusikan perangkat lunak ini secara gratis. Lihat berkas [LICENSE](https://github.com/hendyka/Pubex/blob/main/LICENSE.md) untuk detail selengkapnya.

---

## 👤 Pengembang & Kontak

* **Developer:** [Hendika Darma Listianto](https://www.linkedin.com/in/hendika-listianto-706b27352/)
* **GitHub:** [@hendyka](https://github.com/hendyka)
* **Web App:** [https://rups-new.vercel.app/](https://publicexpose-iota.vercel.app/)
