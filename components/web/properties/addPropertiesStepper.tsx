"use client";
import { ADDPROPERTYSTEPS } from "@/lib/types/properties";
import { Check } from "lucide-react";

export default function AddPropertiesStepper({
  currentIndex,
}: {
  currentIndex: number;
}) {
  const steps = ADDPROPERTYSTEPS.map((step) => {
    const completed = currentIndex > step.index;
    const active = currentIndex === step.index;
    return (
      <div
        key={step.index}
        className={`${step.index === 0 ? "grow-0" : "grow"} flex`}
      >
        {step.index > 0 && (
          <div className="w-full h-full pb-10 flex items-end">
            <div
              className={`w-full rounded-full h-1 min-w-0  ${completed || active ? "bg-secondary" : "bg-border"}`}
            />
          </div>
        )}
        <div className="flex flex-col items-center">
          <div
            className={`rounded-full border size-12 leading-12 ${completed ? "border-secondary" : "border-border"} ${active ? "bg-secondary" : "bg-background"} ${completed ? "text-secondary" : active ? "text-background" : "text-muted-foreground"} flex justify-center text-base font-medium items-center`}
          >
            {completed ? (
              <Check size={24} className="text-inherit" />
            ) : (
              step.index + 1
            )}
          </div>
          <span
            className={`${active || completed ? "text-secondary" : "text-muted-foreground"} font-medium text-lg leading-6`}
          >
            {step.name}
          </span>
        </div>
      </div>
    );
  });
  return <div className="flex w-full">{steps}</div>;
}
