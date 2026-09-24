export type CalculationMode = 'backward_from_event' | 'forward_from_announcement';

export type PubexType = 'tahunan' | 'insidentil';

export type PubexFormat = 'elektronik' | 'fisik' | 'hybrid';

export interface PubexConfig {
  calculationMode: CalculationMode;
  targetDate: string; // YYYY-MM-DD
  companyName: string;
  stockCode: string;
  pubexType: PubexType;
  format: PubexFormat;
  venue: string;
  eventTime: string;
  directors: string;
}

export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
  isJointHoliday: boolean; // Cuti Bersama
  isExchangeHoliday?: boolean; // Libur khusus bursa
  enabled: boolean;
}

export interface ChecklistItem {
  id: string;
  code: string;
  text: string;
  regulationRef: string;
  required: boolean;
}

export interface StageMilestone {
  id: string;
  stageNumber: number;
  title: string;
  subtitle: string;
  regulationRef: string;
  dayOffsetLabel: string;
  tradingDaysOffset: number; // e.g. -10, -3, 0, +3
  date: Date;
  dateString: string;
  formattedDate: string;
  daysRemaining: number;
  tradingDaysRemaining: number;
  status: 'past' | 'today' | 'upcoming';
  description: string;
  requiredChecklist: ChecklistItem[];
  practicalNotes: string[];
}

export interface DayAuditItem {
  date: string;
  dayName: string;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
  isExchangeTradingDay: boolean;
  tradingDayCounter?: number;
  milestoneEvent?: {
    stageNumber: number;
    title: string;
    dayOffsetLabel: string;
  };
}

export interface TimelineResult {
  config: PubexConfig;
  milestones: StageMilestone[];
  startDate: Date;
  endDate: Date;
  totalTradingDaysSpan: number;
  totalCalendarDaysSpan: number;
  auditTrail: DayAuditItem[];
}
