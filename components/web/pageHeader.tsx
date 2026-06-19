"use client";
import { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export default function PageHeader({
  title,
  description,
  actionButton,
}: {
  title: string | ReactNode;
  description: string | ReactNode;
  actionButton: ReactNode;
}) {
  const router = useRouter();
  return (
    <header className="flex w-full justify-between items-center">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="hover:opacity-85 duration-200 transition-opacity"
        >
          <ChevronLeft className="size-8 " />
        </Button>
        <div className="flex flex-col gap-1.5">
          {typeof title === "string" ? (
            <h2 className="font-medium text-2xl">{title}</h2>
          ) : (
            title
          )}
          {typeof description === "string" ? (
            <p className="text-muted-foreground">{description}</p>
          ) : (
            description
          )}
        </div>
      </div>
      {actionButton}
    </header>
  );
}
