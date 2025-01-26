export type TimeOfDay = 'manha' | 'tarde' | 'noite';

export type TimeSlot = {
  time: string;
  available: boolean;
};

export type DayAvailability = {
  date: Date;
  available: boolean;
  timeSlots: {
    manha: TimeSlot[];
    tarde: TimeSlot[];
    noite: TimeSlot[];
  };
};
