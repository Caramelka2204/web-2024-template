export type ScheduleType = 'lecture' | 'club' | 'event';

export interface ScheduleItem {
  id: string;
  type: ScheduleType;
  title: string;
  time: string;
  place: string;
  duration: string;
  teacher: string;
  maxParticipants: number;
  participants: string[];
  groupVisibility?: string[]; // для лекций
  assignment?: string; // для лекций
} 