import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as z from "zod";
import { AppError } from "./classes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeText(text: string) {
  return text[0].toUpperCase() + text.slice(1).toLowerCase();
}

export function sanitizePayload<T extends z.ZodTypeAny>(
  payload: unknown,
  schema: T,
): z.infer<T> {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    const messages = parsed.error.issues.map((issue) => {
      const field = issue.path.join(".");
      const fieldPrefix = field ? `${field}: ` : "";

      if (issue.code === "unrecognized_keys") {
        return `Extra fields not allowed: ${issue.keys.join(", ")}`;
      }

      return `${fieldPrefix}${issue.message}`;
    });
    throw new AppError("Validation failed: " + messages.join("; "), 400);
  }
  return parsed.data;
}

export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblings: number = 1,
) {
  const range: (number | string)[] = [];
  const totalPageNumbers = siblings * 2 + 5;

  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblings, 1);
  const rightSiblingIndex = Math.min(currentPage + siblings, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblings;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "...", totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblings;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1,
    );
    return [1, "...", ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i,
    );
    return [1, "...", ...middleRange, "...", totalPages];
  }

  return range;
}

export function debounce<T extends (...args: string[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>): void => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
