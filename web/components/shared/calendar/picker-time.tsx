'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { formatTime } from '@/utils/date-utils';
import { TimeOfDay, TimeSlot } from '@/@types/calendar';

type TimeSlotPickerProps = {
  timeOfDay: TimeOfDay;
  timeSlots: TimeSlot[];
  onSelectTimeSlot: (time: string) => void;
  selectedDate: Date;
};

export function TimeSlotPicker({ timeSlots, onSelectTimeSlot, selectedDate }: TimeSlotPickerProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleSelectTimeSlot = (time: string) => {
    setSelectedTime(time);
    onSelectTimeSlot(time);
  };

  return (
    <div className="w-full mt-2">
      <div className="grid grid-cols-3 gap-2">
        {timeSlots.map((slot) => (
          <Button
            key={slot.time}
            onClick={() => handleSelectTimeSlot(slot.time)}
            disabled={!slot.available}
            variant={slot.available ? (selectedTime === slot.time ? "default" : "secondary") : "secondary"}
            className={`font-medium p-4 w-full ${selectedTime === slot.time ? " text-black" : ""}`}
          >
            {formatTime(selectedDate, slot.time)}
          </Button>
        ))}
      </div>
    </div>
  );
}
