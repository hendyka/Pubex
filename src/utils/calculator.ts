import {
  ChecklistItem,
  DayAuditItem,
  Holiday,
  PubexConfig,
  StageMilestone,
  TimelineResult,
} from '../types';

export const INDONESIAN_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const INDONESIAN_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0); // Noon to prevent timezone boundary drift
}

export function formatIndonesianDate(date: Date, withDayName = true): string {
  const dayName = INDONESIAN_DAYS[date.getDay()];
  const day = date.getDate();
  const month = INDONESIAN_MONTHS[date.getMonth()];
  const year = date.getFullYear();

  if (withDayName) {
    return `${dayName}, ${day} ${month} ${year}`;
  }
  return `${day} ${month} ${year}`;
}

export function isTradingDay(date: Date, holidays: Holiday[]): {
  isTrading: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
} {
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const dateStr = toDateString(date);

  const matchedHoliday = holidays.find(
    (h) => h.enabled && h.date === dateStr
  );

  const isHoliday = !!matchedHoliday;
  const isTrading = !isWeekend && !isHoliday;

  return {
    isTrading,
    isWeekend,
    isHoliday,
    holidayName: matchedHoliday?.name,
  };
}

/**
 * Subtract N trading days from a given date
 */
export function subtractTradingDays(startDate: Date, count: number, holidays: Holiday[]): Date {
  if (count <= 0) return new Date(startDate);

  const current = new Date(startDate);
  let remaining = count;

  while (remaining > 0) {
    current.setDate(current.getDate() - 1);
    const check = isTradingDay(current, holidays);
    if (check.isTrading) {
      remaining--;
    }
  }

  return current;
}

/**
 * Add N trading days to a given date
 */
export function addTradingDays(startDate: Date, count: number, holidays: Holiday[]): Date {
  if (count <= 0) return new Date(startDate);

  const current = new Date(startDate);
  let remaining = count;

  while (remaining > 0) {
    current.setDate(current.getDate() + 1);
    const check = isTradingDay(current, holidays);
    if (check.isTrading) {
      remaining--;
    }
  }

  return current;
}

/**
 * Count trading days between two dates (excluding the reference start date, inclusive of end date)
 */
export function countTradingDaysBetween(from: Date, to: Date, holidays: Holiday[]): number {
  const start = new Date(from);
  const end = new Date(to);

  // Normalize
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (start.getTime() === end.getTime()) return 0;

  const isForward = end.getTime() > start.getTime();
  const step = isForward ? 1 : -1;
  const current = new Date(start);
  let tradingCount = 0;

  while (isForward ? current < end : current > end) {
    current.setDate(current.getDate() + step);
    const check = isTradingDay(current, holidays);
    if (check.isTrading) {
      tradingCount++;
    }
  }

  return tradingCount;
}

export function getChecklistForStage(stageNumber: number): ChecklistItem[] {
  switch (stageNumber) {
    case 1:
      return [
        {
          id: 's1-1',
          code: 'III.3.3.1.1',
          text: 'Penyampaian tanggal dan jam penyelenggaraan Public Expose',
          regulationRef: 'Kep-00087/BEI/12-2025 Lampiran III.3.3.1.1',
          required: true,
        },
        {
          id: 's1-2',
          code: 'III.3.3.1.2',
          text: 'Penyampaian tempat penyelenggaraan (atau tautan webinar elektronik/hybrid)',
          regulationRef: 'Kep-00087/BEI/12-2025 Lampiran III.3.3.1.2',
          required: true,
        },
        {
          id: 's1-3',
          code: 'III.3.3.1.3',
          text: 'Nama Direktur Perusahaan Tercatat yang akan hadir pada Public Expose',
          regulationRef: 'Kep-00087/BEI/12-2025 Lampiran III.3.3.1.3',
          required: true,
        },
        {
          id: 's1-4',
          code: 'SPE-BEI',
          text: 'Unggah Keterbukaan Informasi melalui sistem pelaporan elektronik IDXnet / SPE Bursa',
          regulationRef: 'Peraturan Nomor I-E Ketentuan Umum Pelaporan',
          required: true,
        },
      ];
    case 2:
      return [
        {
          id: 's2-1',
          code: 'III.3.3.2.1',
          text: 'Telaahan kinerja keuangan dan operasi yang terkini yang dapat diungkapkan',
          regulationRef: 'Kep-00087/BEI/12-2025 Lampiran III.3.3.2.1',
          required: true,
        },
        {
          id: 's2-2',
          code: 'III.3.3.2.2',
          text: 'Kendala-kendala yang dihadapi, termasuk kondisi ketidakpastian (jika ada)',
          regulationRef: 'Kep-00087/BEI/12-2025 Lampiran III.3.3.2.2',
          required: true,
        },
        {
          id: 's2-3',
          code: 'III.3.3.2.3',
          text: 'Upaya untuk meningkatkan kinerja Perusahaan Tercatat',
          regulationRef: 'Kep-00087/BEI/12-2025 Lampiran III.3.3.2.3',
          required: true,
        },
        {
          id: 's2-4',
          code: 'III.3.3.2.4',
          text: 'Target kinerja perusahaan tahun berjalan',
          regulationRef: 'Kep-00087/BEI/12-2025 Lampiran III.3.3.2.4',
          required: true,
        },
        {
          id: 's2-5',
          code: 'III.3.3.2.5',
          text: 'Proyeksi keuangan (jika ada) - wajib disertai hasil review dari Akuntan Publik',
          regulationRef: 'Kep-00087/BEI/12-2025 Lampiran III.3.3.2.5',
          required: false,
        },
        {
          id: 's2-6',
          code: 'III.3.3.2.6',
          text: 'Hal-hal lain yang dipandang perlu diungkapkan kepada publik oleh Perusahaan Tercatat',
          regulationRef: 'Kep-00087/BEI/12-2025 Lampiran III.3.3.2.6',
          required: false,
        },
      ];
    case 3:
      return [
        {
          id: 's3-1',
          code: 'III.3.3.3.1',
          text: 'Kehadiran minimal 1 (satu) orang Direktur Perusahaan Tercatat yang telah dilaporkan',
          regulationRef: 'Kep-00087/BEI/12-2025 Lampiran III.3.3.1.3 & III.3.3.3',
          required: true,
        },
        {
          id: 's3-2',
          code: 'III.3.3.3.2',
          text: 'Akses terbuka bagi pemodal, analis pasar modal, fund manager, AB Bursa, dan media massa',
          regulationRef: 'Kep-00087/BEI/12-2025 Lampiran III.3.3.3',
          required: true,
        },
        {
          id: 's3-3',
          code: 'III.3.3.3.3',
          text: 'Dokumentasi sesi tanya jawab (Q&A) dan pencatatan daftar hadir peserta secara real-time',
          regulationRef: 'Kep-00087/BEI/12-2025 Lampiran III.3.3.4',
          required: true,
        },
      ];
    case 4:
      return [
        {
          id: 's4-1',
          code: 'III.3.3.4.1',
          text: 'Ringkasan pertanyaan peserta Public Expose dan jawaban dari Perusahaan Tercatat',
          regulationRef: 'Kep-00087/BEI/12-2025 Lampiran III.3.3.4',
          required: true,
        },
        {
          id: 's4-2',
          code: 'III.3.3.4.2',
          text: 'Resume hasil pelaksanaan Public Expose',
          regulationRef: 'Kep-00087/BEI/12-2025 Lampiran III.3.3.4',
          required: true,
        },
        {
          id: 's4-3',
          code: 'III.3.3.4.3',
          text: 'Melampirkan salinan daftar hadir (daftar hadir fisik dan/atau log presensi virtual)',
          regulationRef: 'Kep-00087/BEI/12-2025 Lampiran III.3.3.4',
          required: true,
        },
      ];
    default:
      return [];
  }
}

export function calculateTimeline(config: PubexConfig, holidays: Holiday[]): TimelineResult {
  const targetDateObj = parseDate(config.targetDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let pubexEventDate: Date;
  let stage1Date: Date;

  if (config.calculationMode === 'forward_from_announcement') {
    // Stage 1 is user input date
    stage1Date = targetDateObj;
    // Pubex event must be at least 10 trading days after stage 1
    // Trading day 10 is the earliest compliant execution day
    pubexEventDate = addTradingDays(stage1Date, 10, holidays);
  } else {
    // Default: targetDate is the execution date (Hari H Pubex)
    pubexEventDate = targetDateObj;
    // Stage 1: 10 trading days before Pubex
    stage1Date = subtractTradingDays(pubexEventDate, 10, holidays);
  }

  // Stage 2: 3 trading days before Pubex
  const stage2Date = subtractTradingDays(pubexEventDate, 3, holidays);

  // Stage 4: 3 trading days after Pubex
  const stage4Date = addTradingDays(pubexEventDate, 3, holidays);

  const stagesData = [
    {
      number: 1,
      id: 'tahap-1-laporan-rencana',
      title: 'Laporan Rencana Penyelenggaraan Pubex',
      subtitle: 'Paling lambat 10 Hari Bursa sebelum pelaksanaan',
      regulationRef: 'Kep-00087/BEI/12-2025 Angka III.3.3.1',
      dayOffsetLabel: 'H-10 Hari Bursa',
      tradingDaysOffset: -10,
      date: stage1Date,
      description:
        'Perusahaan Tercatat wajib menyampaikan keterbukaan informasi mengenai rencana penyelenggaraan Public Expose kepada Bursa dan publik melalui SPE Bursa.',
      practicalNotes: [
        'Disampaikan melalui portal SPE / IDXnet kategori Keterbukaan Informasi Rencana Public Expose.',
        'Wajib memuat tanggal, jam, tempat/tautan platform, serta minimal 1 nama Direktur yang hadir.',
        'Jika berbentuk virtual/hybrid, sertakan link registrasi webinar dan petunjuk akses peserta.',
      ],
    },
    {
      number: 2,
      id: 'tahap-2-materi-pubex',
      title: 'Penyampaian Materi Public Expose',
      subtitle: 'Paling lambat 3 Hari Bursa sebelum pelaksanaan',
      regulationRef: 'Kep-00087/BEI/12-2025 Angka III.3.3.2',
      dayOffsetLabel: 'H-3 Hari Bursa',
      tradingDaysOffset: -3,
      date: stage2Date,
      description:
        'Penyampaian materi presentasi dan bahan tayang Public Expose kepada Bursa paling lambat 3 Hari Bursa sebelum tanggal pelaksanaan.',
      practicalNotes: [
        'Materi memuat kinerja keuangan terkini, kendala operasional, target kinerja, dan strategi emiten.',
        'Jika memuat proyeksi keuangan kuantitatif, wajib dilampirkan hasil review Akuntan Publik.',
        'Materi akan dipublikasikan oleh Bursa di situs web IDX agar dapat dipelajari investor sebelum acara.',
      ],
    },
    {
      number: 3,
      id: 'tahap-3-pelaksanaan-pubex',
      title: 'Pelaksanaan Public Expose',
      subtitle: 'Hari H Penyelenggaraan Public Expose',
      regulationRef: 'Kep-00087/BEI/12-2025 Angka III.3.3.3',
      dayOffsetLabel: 'Hari H (Pelaksanaan)',
      tradingDaysOffset: 0,
      date: pubexEventDate,
      description:
        'Penyelenggaraan Public Expose secara transparan di hadapan pemodal, analis, fund manager, anggota bursa, dan media massa.',
      practicalNotes: [
        'Wajib dihadiri oleh Direktur Perusahaan Tercatat yang tercantum dalam pengumuman rencana.',
        'Wajib menyediakan sesi tanya-jawab interaktif dan mencatat seluruh peserta yang hadir.',
        'Simpan rekaman video dan transkrip audio jika diselenggarakan secara daring/elektronik.',
      ],
    },
    {
      number: 4,
      id: 'tahap-4-laporan-hasil',
      title: 'Laporan Hasil Pelaksanaan Public Expose',
      subtitle: 'Paling lambat 3 Hari Bursa setelah pelaksanaan',
      regulationRef: 'Kep-00087/BEI/12-2025 Angka III.3.3.4',
      dayOffsetLabel: 'H+3 Hari Bursa',
      tradingDaysOffset: 3,
      date: stage4Date,
      description:
        'Penyampaian laporan pertanggungjawaban pelaksanaan Public Expose kepada Bursa beserta resume tanya jawab dan daftar hadir.',
      practicalNotes: [
        'Memuat rangkuman lengkap tanya jawab (Q&A resume): nama penanya, institusi, pertanyaan, dan jawaban Direksi.',
        'Melampirkan salinan absensi/daftar hadir resmi (atau export log kehadiran Zoom/platform webinar).',
        'Keterlambatan penyampaian laporan dikenakan sanksi denda dan peringatan tertulis oleh BEI.',
      ],
    },
  ];

  const milestones: StageMilestone[] = stagesData.map((stage) => {
    const stageDate = new Date(stage.date);
    stageDate.setHours(0, 0, 0, 0);

    const diffTime = stageDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status: 'past' | 'today' | 'upcoming' = 'upcoming';
    if (daysRemaining < 0) {
      status = 'past';
    } else if (daysRemaining === 0) {
      status = 'today';
    }

    // Trading days remaining
    let tradingDaysRemaining = 0;
    if (daysRemaining > 0) {
      tradingDaysRemaining = countTradingDaysBetween(today, stageDate, holidays);
    } else if (daysRemaining < 0) {
      tradingDaysRemaining = -countTradingDaysBetween(stageDate, today, holidays);
    }

    return {
      id: stage.id,
      stageNumber: stage.number,
      title: stage.title,
      subtitle: stage.subtitle,
      regulationRef: stage.regulationRef,
      dayOffsetLabel: stage.dayOffsetLabel,
      tradingDaysOffset: stage.tradingDaysOffset,
      date: stage.date,
      dateString: toDateString(stage.date),
      formattedDate: formatIndonesianDate(stage.date),
      daysRemaining,
      tradingDaysRemaining,
      status,
      description: stage.description,
      requiredChecklist: getChecklistForStage(stage.number),
      practicalNotes: stage.practicalNotes,
    };
  });

  // Calculate audit trail from stage 1 to stage 4
  const auditStartDate = new Date(stage1Date);
  const auditEndDate = new Date(stage4Date);

  const auditTrail: DayAuditItem[] = [];
  const curr = new Date(auditStartDate);

  let tradingCounter = 0;
  const milestoneMap = new Map<string, { stageNumber: number; title: string; dayOffsetLabel: string }>();

  milestones.forEach((m) => {
    milestoneMap.set(m.dateString, {
      stageNumber: m.stageNumber,
      title: m.title,
      dayOffsetLabel: m.dayOffsetLabel,
    });
  });

  while (curr <= auditEndDate) {
    const dateStr = toDateString(curr);
    const dayCheck = isTradingDay(curr, holidays);

    if (dayCheck.isTrading) {
      tradingCounter++;
    }

    const milestoneEvent = milestoneMap.get(dateStr);

    auditTrail.push({
      date: dateStr,
      dayName: INDONESIAN_DAYS[curr.getDay()],
      isWeekend: dayCheck.isWeekend,
      isHoliday: dayCheck.isHoliday,
      holidayName: dayCheck.holidayName,
      isExchangeTradingDay: dayCheck.isTrading,
      tradingDayCounter: dayCheck.isTrading ? tradingCounter : undefined,
      milestoneEvent,
    });

    curr.setDate(curr.getDate() + 1);
  }

  const totalCalendarDaysSpan = Math.ceil(
    (auditEndDate.getTime() - auditStartDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const totalTradingDaysSpan = auditTrail.filter((d) => d.isExchangeTradingDay).length;

  return {
    config,
    milestones,
    startDate: stage1Date,
    endDate: stage4Date,
    totalTradingDaysSpan,
    totalCalendarDaysSpan,
    auditTrail,
  };
}

export function generateICSContent(timeline: TimelineResult, config: PubexConfig): string {
  const company = config.stockCode
    ? `[${config.stockCode}] ${config.companyName || 'Perusahaan Tercatat'}`
    : config.companyName || 'Perusahaan Tercatat';

  const formatICSDate = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}${m}${day}`;
  };

  const escapeICS = (str: string): string => {
    return str.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
  };

  const now = new Date();
  const dtstamp = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}${String(
    now.getUTCDate()
  ).padStart(2, '0')}T${String(now.getUTCHours()).padStart(2, '0')}${String(
    now.getUTCMinutes()
  ).padStart(2, '0')}${String(now.getUTCSeconds()).padStart(2, '0')}Z`;

  const events = timeline.milestones.map((m) => {
    const startDate = formatICSDate(m.date);
    // End date is next day for all-day event
    const nextDay = new Date(m.date);
    nextDay.setDate(nextDay.getDate() + 1);
    const endDate = formatICSDate(nextDay);

    const summary = `${company} - Tahap ${m.stageNumber}: ${m.title} (${m.dayOffsetLabel})`;
    const description = `Deadline Kepatuhan BEI (Kep-00087/BEI/12-2025 Peraturan I-E):\\n${m.subtitle}\\n\\nKetentuan Wajib:\\n${m.requiredChecklist.map((c) => `- ${c.code}: ${c.text}`).join('\\n')}`;

    return [
      'BEGIN:VEVENT',
      `UID:pubex-${config.stockCode || 'idx'}-stage-${m.stageNumber}-${startDate}@timeline-bei`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${startDate}`,
      `DTEND;VALUE=DATE:${endDate}`,
      `SUMMARY:${escapeICS(summary)}`,
      `DESCRIPTION:${escapeICS(description)}`,
      `LOCATION:${escapeICS(config.venue || 'Bursa Efek Indonesia / Webinar Virtual')}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:Pengingat Deadline BEI H-1: ${escapeICS(m.title)}`,
      'END:VALARM',
      'END:VEVENT',
    ].join('\r\n');
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Public Expose Timeline BEI//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Timeline Public Expose - ${config.stockCode || 'Perusahaan Tercatat'}`,
    'X-WR-TIMEZONE:Asia/Jakarta',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');
}

export function generateWhatsAppMessage(timeline: TimelineResult, config: PubexConfig): string {
  const code = config.stockCode ? `[${config.stockCode}] ` : '';
  const emiten = `${code}${config.companyName || 'Perusahaan Tercatat'}`;

  const header = `*TIMELINE KEPATUHAN PUBLIC EXPOSE BEI*\n*Perusahaan:* ${emiten}\n*Format Acara:* ${config.format.toUpperCase()} (${config.venue || 'Webinar / Kantor'})\n*Dasar Regulasi:* Kep-00087/BEI/12-2025 Peraturan Nomor I-E\n--------------------------------------------\n`;

  const body = timeline.milestones
    .map((m) => {
      const icon = m.stageNumber === 3 ? '🔴' : '📌';
      return `${icon} *TAHAP ${m.stageNumber}: ${m.title.toUpperCase()}*\n📅 *${m.formattedDate}* (${m.dayOffsetLabel})\n⚖️ _${m.regulationRef}_\n📋 _Poin Kunci:_ ${m.subtitle}\n`;
    })
    .join('\n');

  const footer = `\n--------------------------------------------\nTotal Rentang: ${timeline.totalTradingDaysSpan} Hari Bursa (${timeline.totalCalendarDaysSpan} Hari Kalender)\n*Catatan Penting BEI:* Keterlambatan pelaporan dikenakan denda Rp 1.000.000/hari serta sanksi administratif sesuai ketentuan BEI.\n_Dibuat dengan Kalkulator Timeline Public Expose BEI_`;

  return `${header}${body}${footer}`;
}
