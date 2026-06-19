"use client";
import { Download } from "lucide-react";
import { ExportCategories, ExportModalProps } from "@/lib/types/general";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import IsActiveForm from "./isActiveForm";
import IsUsedExpiredForm from "./isUsedExpiredForm";
import DateRangeForm from "./dateRangeForm";

export default function ExportButton<T extends ExportCategories>({
  title,
  category,
  id,
  disabled = false,
}: ExportModalProps<T>) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Button
        className="hover:bg-accent/25 "
        variant="ghost"
        onClick={() => {
          setModalOpen(true);
        }}
        disabled={disabled}
      >
        <Download className="size-6 text-primary" />
      </Button>
      {modalOpen && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Export Data</DialogTitle>
              <DialogDescription>
                Seamlessly export your {title} data in .xlsx format
              </DialogDescription>
            </DialogHeader>
            {category !== "customers" &&
              category !== "invitations" &&
              category !== "payments" &&
              category !== "payments-for-property" && (
                <IsActiveForm
                  category={category}
                  id={id}
                  setModalOpen={setModalOpen}
                />
              )}
            {category === "invitations" && (
              <IsUsedExpiredForm
                category={category}
                setModalOpen={setModalOpen}
              />
            )}
            {(category === "payments" ||
              category === "payments-for-property") && (
              <DateRangeForm
                category={category}
                setModalOpen={setModalOpen}
                id={id}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
