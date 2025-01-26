'use client';
import { Button } from "@/components/ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { BookingCalendar } from "../calendar/booking-calendar";
import { useState } from "react";

export const SelectDate = ({ onDateSelect }: { onDateSelect: (date: Date, time: string) => void }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleDateTimeSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    onDateSelect(date, time);
  };


  return (
    <DrawerContent>
      <section className="mx-auto">
        <BookingCalendar onDateTimeSelect={handleDateTimeSelect} />
      </section>

      <DrawerFooter className="flex mx-[2.6rem] items-center  justify-center">
        <DrawerClose asChild >
          <Button
          variant="default"
            className="w-full p-7 text-[16px] font-semibold"
            disabled={!selectedDate || !selectedTime} 
          >
            Selecionar data
          </Button>
          
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  );
};
