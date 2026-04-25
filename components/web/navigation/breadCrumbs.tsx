"use client";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { normalizeText } from "@/lib/utils";

export default function BreadCrumbs() {
  const pathname = usePathname();

  const paths = pathname.split("/").filter((x) => x);

  const pathComponents =
    paths.length < 1
      ? [<span key={0}>Dashboard</span>]
      : paths.map((path, idx) => {
          const splitPath = path.split("-").filter((x) => x);
          const normalizedPath = splitPath.reduce((total, value, idx) => {
            if (idx === 0) return total + normalizeText(value);
            return total + " " + normalizeText(value);
          }, "");

          if (idx === paths.length - 1) {
            return <span key={idx}>{normalizedPath}</span>;
          }
          return (
            <span key={idx} className="flex gap-1.5">
              <Link href={path}>{normalizedPath}</Link>
              <ChevronRight />
            </span>
          );
        });

  return <p>{pathComponents}</p>;
}
