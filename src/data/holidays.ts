import { Holiday } from '../types';

/**
 * Raw CSV data representing holidays in the standard format:
 * Hari,Tgl,Bulan,Tahun,Keterangan
 *
 * This format matches the RUPS calculator repository (https://github.com/hendyka/RUPS_New),
 * making it very easy and fast to update, paste, or replace directly.
 */
export const HOLIDAYS_CSV_RAW = `Hari,Tgl,Bulan,Tahun,Keterangan
Kamis,1,Januari,2026,Tahun Baru 2026 Masehi
Jumat,16,Januari,2026,Isra Mikraj Nabi Muhammad SAW
Senin,16,Februari,2026,Cuti Bersama Tahun Baru Imlek 2577 Kongzili
Selasa,17,Februari,2026,Tahun Baru Imlek 2577 Kongzili
Rabu,18,Maret,2026,Cuti Bersama Hari Suci Nyepi Tahun Baru Saka 1948
Kamis,19,Maret,2026,Hari Suci Nyepi Tahun Baru Saka 1948
Jumat,20,Maret,2026,Cuti Bersama Idul Fitri 1447 Hijriah
Senin,23,Maret,2026,Cuti Bersama Idul Fitri 1447 Hijriah
Selasa,24,Maret,2026,Cuti Bersama Idul Fitri 1447 Hijriah
Jumat,3,April,2026,Wafat Yesus Kristus
Jumat,1,Mei,2026,Hari Buruh Internasional
Kamis,14,Mei,2026,Kenaikan Yesus Kristus
Jumat,15,Mei,2026,Cuti Bersama Kenaikan Yesus Kristus
Rabu,27,Mei,2026,Idul Adha 1447 Hijriah
Kamis,28,Mei,2026,Cuti Bersama Hari Raya Idul Adha 1447 Hijriah
Senin,1,Juni,2026,Hari Lahir Pancasila
Selasa,16,Juni,2026,1 Muharam Tahun Baru Islam 1448 Hijriah
Senin,17,Agustus,2026,Proklamasi Kemerdekaan
Selasa,25,Agustus,2026,Maulid Nabi Muhammad SAW
Kamis,24,Desember,2026,Cuti Bersama Kelahiran Yesus Kristus
Jumat,25,Desember,2026,Kelahiran Yesus Kristus
Kamis,31,Desember,2026,Libur Bursa
Jumat,1,Januari,2027,Tahun Baru 2027 Masehi
Selasa,5,Januari,2027,Isra Mikraj Nabi Muhammad S.A.W. 1448 Hijriah
Jumat,5,Februari,2027,Tahun Baru Imlek 2578 Kongzili
Sabtu,6,Februari,2027,Tahun Baru Imlek 2578 Kongzili
Senin,8,Maret,2027,Hari Suci Nyepi (Tahun Baru Saka 1949)
Selasa,9,Maret,2027,Idul Fitri 1448 Hijriah
Rabu,10,Maret,2027,Idul Fitri 1448 Hijriah
Kamis,11,Maret,2027,Idul Fitri 1448 Hijriah
Jumat,12,Maret,2027,Idul Fitri 1448 Hijriah
Senin,15,Maret,2027,Idul Fitri 1448 Hijriah
Kamis,25,Maret,2027,Wafat Yesus Kristus
Jumat,26,Maret,2027,Wafat Yesus Kristus
Minggu,28,Maret,2027,Kebangkitan Yesus Kristus (Paskah)
Sabtu,1,Mei,2027,Hari Buruh Internasional
Kamis,6,Mei,2027,Kenaikan Yesus Kristus
Senin,17,Mei,2027,Idul Adha 1448 Hijriah
Selasa,18,Mei,2027,Idul Adha 1448 Hijriah
Rabu,19,Mei,2027,Hari Raya Waisak 2571 BE
Kamis,20,Mei,2027,Hari Raya Waisak 2571 BE
Selasa,1,Juni,2027,Hari Lahir Pancasila
Minggu,6,Juni,2027,1 Muharam Tahun Baru Islam 1449 Hijriah
Minggu,15,Agustus,2027,Maulid Nabi Muhammad S.A.W.
Selasa,17,Agustus,2027,Proklamasi Kemerdekaan
Sabtu,25,Desember,2027,Kelahiran Yesus Kristus
Minggu,26,Desember,2027,Isra Mikraj Nabi Muhammad S.A.W. 1449 Hijriah
Kamis,31,Desember,2027,Libur Akhir Tahun Bursa Efek Indonesia`;

/**
 * Mapping Indonesian month names to 2-digit month strings.
 */
export const INDONESIAN_MONTH_MAP: Record<string, string> = {
  januari: '01',
  februari: '02',
  maret: '03',
  april: '04',
  mei: '05',
  juni: '06',
  juli: '07',
  agustus: '08',
  september: '09',
  oktober: '10',
  november: '11',
  desember: '12',
};

/**
 * Parses CSV text formatted as:
 * Hari,Tgl,Bulan,Tahun,Keterangan
 * into Holiday[]
 */
export function parseHolidaysCSV(csvText: string): Holiday[] {
  const lines = csvText.trim().split(/\r?\n/);
  const result: Holiday[] = [];
  const seenDates = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Skip header line if present
    if (i === 0 && line.toLowerCase().includes('hari') && line.toLowerCase().includes('tgl')) {
      continue;
    }

    const parts = line.split(',').map((p) => p.trim());
    if (parts.length < 5) continue;

    const [dayName, tgl, bulanStr, tahunStr, ...ketParts] = parts;
    const keterangan = ketParts.join(', ').trim();

    const monthNum = INDONESIAN_MONTH_MAP[bulanStr.toLowerCase()];
    if (!monthNum) continue;

    const dayNum = tgl.padStart(2, '0');
    const yearNum = tahunStr.padStart(4, '0');
    const dateStr = `${yearNum}-${monthNum}-${dayNum}`;

    if (seenDates.has(dateStr)) {
      // If there's an existing entry on same date, append description
      const existing = result.find((h) => h.date === dateStr);
      if (existing && !existing.name.includes(keterangan)) {
        existing.name = `${existing.name} / ${keterangan}`;
      }
      continue;
    }

    seenDates.add(dateStr);

    const isJoint = keterangan.toLowerCase().includes('cuti bersama');
    const isExchange =
      keterangan.toLowerCase().includes('libur bursa') ||
      keterangan.toLowerCase().includes('libur akhir tahun');

    result.push({
      date: dateStr,
      name: keterangan,
      isJointHoliday: isJoint,
      isExchangeHoliday: isExchange,
      enabled: true,
    });
  }

  // Sort chronologically
  result.sort((a, b) => a.date.localeCompare(b.date));
  return result;
}

/**
 * Serializes Holiday[] into CSV text in the same format:
 * Hari,Tgl,Bulan,Tahun,Keterangan
 */
export function serializeHolidaysToCSV(holidays: Holiday[]): string {
  const dayNamesIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNamesIndo = [
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

  const lines = ['Hari,Tgl,Bulan,Tahun,Keterangan'];

  for (const h of holidays) {
    const [yearStr, monthStr, dayStr] = h.date.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10); // 1-12
    const day = parseInt(dayStr, 10);

    const dateObj = new Date(year, month - 1, day);
    const dayName = dayNamesIndo[dateObj.getDay()];
    const monthName = monthNamesIndo[month - 1];

    lines.push(`${dayName},${day},${monthName},${year},${h.name}`);
  }

  return lines.join('\n');
}

/**
 * Initial holiday list parsed directly from the CSV text.
 */
export const INITIAL_HOLIDAYS: Holiday[] = parseHolidaysCSV(HOLIDAYS_CSV_RAW);
