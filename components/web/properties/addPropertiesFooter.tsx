"use client";

import { Button } from "@/components/ui/button";
import { AddPropertyStepType } from "@/lib/types/properties";
import { ChevronLeft } from "lucide-react";

export default function AddPropertiesFooter({
  currentStep,
  handleBack,
  handleContinue,
}: {
  currentStep: AddPropertyStepType;
  handleBack: () => void;
  handleContinue: () => void;
}) {
  return (
    <div className="w-full justify-end flex gap-2">
      {currentStep !== "Owner" && (
        <Button
          type="button"
          onClick={handleBack}
          variant="outline"
          className="text-chart-3 font-medium px-6.5! py-1.5!"
        >
          <ChevronLeft />
          Back
        </Button>
      )}
      {currentStep !== "Preview" && (
        <Button
          type="button"
          onClick={handleContinue}
          variant="secondary"
          className="text-background font-medium px-6.5! py-1.5!"
        >
          Continue
        </Button>
      )}
      {currentStep === "Preview" && (
        <Button
          type="submit"
          variant="secondary"
          className="text-background font-medium px-6.5! py-1.5!"
        >
          Save
        </Button>
      )}
    </div>
  );
}
