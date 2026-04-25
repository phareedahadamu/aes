"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LinkProps } from "next/link";

export default function LinkButton({
  href,
  children,
  className,
  ...props
}: LinkProps & { children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant: "default" }), className)}
      {...props}
    >
      {children}
    </Link>
  );
}
