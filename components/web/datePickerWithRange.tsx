"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface DatePickerProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
}
export default function DatePickerWithRange<TFieldValues extends FieldValues>({
  control,
  name,
}: DatePickerProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const date: DateRange | undefined = field.value;

        return (
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  id={name}
                  className="justify-start px-2.5 font-normal w-full"
                >
                  <CalendarIcon
                    data-icon="inline-start"
                    className="mr-2 h-4 w-4"
                  />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              }
            />
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                // Pass the updated range directly back to React Hook Form
                onSelect={field.onChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
}
