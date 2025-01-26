"use client";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { startOfDay } from "date-fns";
import { DayAvailability, TimeOfDay } from "@/@types/calendar";
import {
  formatDate,
  generateMockData,
  getAvailabilityForDate,
  isWithinBookingInterval,
} from "@/utils/date-utils";
import { Button } from "@/components/ui/button";
import { TimeSlotPicker } from "./picker-time";
import { ptBR } from "date-fns/locale";

interface BookingCalendarProps {
  onDateTimeSelect: (date: Date, time: string) => void;
}

export function BookingCalendar({ onDateTimeSelect }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<
    TimeOfDay | undefined
  >(undefined);
  const [, setSelectedTime] = useState<string | undefined>(undefined);
  const [availabilityData, setAvailabilityData] = useState<DayAvailability[]>(
    []
  );
  const [startDate, ,] = useState<Date>(startOfDay(new Date()));

  useEffect(() => {
    const mockData = generateMockData(startDate, 30);
    setAvailabilityData(mockData);
  }, [startDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTimeOfDay(undefined);
    setSelectedTime(undefined);
  };

  const handleTimeOfDaySelect = (timeOfDay: TimeOfDay) => {
    setSelectedTimeOfDay(timeOfDay);
    setSelectedTime(undefined);
  };

  const handleTimeSlotSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onDateTimeSelect(selectedDate, time);
    }
  };

  const selectedDayAvailability = selectedDate
    ? getAvailabilityForDate(selectedDate, availabilityData)
    : undefined;

  return (
    <div className=" md:mx-auto mt-2">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        className="rounded-md border "
        locale={ptBR}
        modifiers={{
          booked: (date) => {
            const availability = getAvailabilityForDate(date, availabilityData);
            return availability ? !availability.available : false;
          },
          available: (date) => {
            const availability = getAvailabilityForDate(date, availabilityData);
            return availability ? availability.available : false;
          },
        }}
        modifiersClassNames={{
          booked: "",
          available: "",
        }}
        disabled={(date) => !isWithinBookingInterval(date, startDate, 30)}
        components={{
          DayContent: ({ date }) => {
            const availability = getAvailabilityForDate(date, availabilityData);
            return (
              <div className="relative w-full h-full flex items-center justify-center">
                {date.getDate()}
                {availability &&
                  isWithinBookingInterval(date, startDate, 30) && (
                    <Badge
                      variant="outline"
                      className={`absolute bottom-0 right-0 w-2 h-2 p-0 rounded-full ${
                        availability.available ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  )}
              </div>
            );
          },
        }}
      />

      {selectedDate && selectedDayAvailability && (
        <div className="mt-2  max-w-[15.5rem] ">
          <section className="text-sm font-medium text-muted-foreground  mb-2 ">
            Dia selecionado:{" "}
            <span className="font-bold text-white">
              {formatDate(selectedDate)}
            </span>
          </section>
          <div className="flex justify-between gap-2">
            {(["manha", "tarde", "noite"] as TimeOfDay[]).map((timeOfDay) => (
              <Button
                key={timeOfDay}
                onClick={() => handleTimeOfDaySelect(timeOfDay)}
                variant={
                  selectedTimeOfDay === timeOfDay ? "default" : "secondary"
                }
                className="capitalize p-4 w-full font-medium"
              >
                {timeOfDay}
              </Button>
            ))}
          </div>
          <hr className="text-white bg-white mt-2"/>
          {selectedTimeOfDay && (
            <TimeSlotPicker
              timeOfDay={selectedTimeOfDay}
              timeSlots={selectedDayAvailability.timeSlots[selectedTimeOfDay]}
              onSelectTimeSlot={handleTimeSlotSelect}
              selectedDate={selectedDate}
            />
          )}
        </div>
      )}
    </div>
  );
}
