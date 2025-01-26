
import { DayAvailability, TimeSlot } from "@/@types/calendar"
import { format, setHours, setMinutes, addDays, isSameDay, isWithinInterval, startOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"

export function generateTimeSlots(start: number, end: number): TimeSlot[] {
  const slots: TimeSlot[] = []
  for (let i = start; i < end; i++) {
    slots.push({ time: `${i.toString().padStart(2, "0")}:00`, available: true })
    slots.push({ time: `${i.toString().padStart(2, "0")}:30`, available: true })
  }
  return slots
}

export function generateMockData(startDate: Date, days: number): DayAvailability[] {
  const data: DayAvailability[] = [];
  const currentDate = startOfDay(new Date(startDate));
  // const endDate = addDays(currentDate, days);

  for (let i = 0; i < days; i++) {
    const iterationDate = addDays(currentDate, i);
    const isSunday = iterationDate.getDay() === 0;
    const dayData: DayAvailability = {
      date: iterationDate,
      available: !isSunday,
      timeSlots: {
        manha: generateTimeSlots(9, 12),
        tarde: generateTimeSlots(12, 16),
        noite: generateTimeSlots(16, 19),
      },
    };

    if (isSunday) {
      Object.values(dayData.timeSlots).forEach(slots => {
        slots.forEach(slot => slot.available = false);
      });
    }

    // Simulate January 27th with 2 morning slots unavailable
    if (format(iterationDate, 'dd/MM') === '27/01') {
      dayData.timeSlots.manha[0].available = false; // 09:00
      dayData.timeSlots.manha[1].available = false; // 09:30
    }

    data.push(dayData);
  }

  return data;
}

export function getAvailabilityForDate(
  date: Date,
  availabilityData: DayAvailability[],
): DayAvailability | undefined {
  return availabilityData.find((day) => isSameDay(day.date, date))
}

export function formatDate(date: Date): string {
  return format(date, "d 'de' MMMM ' ", { locale: ptBR })
}

export function formatTime(date: Date, time: string): string {
  const [hours, minutes] = time.split(":").map(Number)
  const dateTime = setMinutes(setHours(date, hours), minutes)
  return format(dateTime, "HH:mm '")
}

export function isWithinBookingInterval(date: Date, startDate: Date, days: number): boolean {
  const endDate = addDays(startDate, days - 1);
  return isWithinInterval(date, { start: startDate, end: endDate });
}
