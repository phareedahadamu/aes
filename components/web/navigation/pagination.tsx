"use client";
import { getPaginationRange } from "@/lib/utils";
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_LIMITS } from "@/lib/constants/general";

export default function Pagination({
  currentPage,
  totalPages,
  currentLimit,
  totalItems,
}: {
  currentPage: number;
  totalPages: number;
  currentLimit?: PAGE_LIMITS;
  totalItems: number;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  if (totalPages <= 1 && !currentLimit) return null;

  const createPageURL = (value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", value.toString());
    return `?${params.toString()}`;
  };

  const handleLimitChange = (newLimit: string | null) => {
    if (!newLimit) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newLimit);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const range = getPaginationRange(currentPage, totalPages);
  const displayedBtns = range.map((item, index) => {
    return (
      <PaginationItem key={index}>
        {typeof item === "number" ? (
          <PaginationLink
            href={createPageURL(item)}
            isActive={currentPage === item}
            scroll={false}
          >
            {item}
          </PaginationLink>
        ) : (
          <PaginationEllipsis />
        )}
      </PaginationItem>
    );
  });
  return (
    <div className="flex   w-full justify-between">
      {currentLimit && (
        <div className="flex items-center gap-2 w-fit text-lg text-chart-3 text-nowrap">
          <p>
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * currentLimit + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {currentLimit * currentPage > totalPages
                ? totalPages
                : currentLimit * currentPage}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span> results
          </p>
          <span>|</span>
          <p>Rows per page</p>
          <Select
            value={currentLimit.toString()}
            onValueChange={handleLimitChange}
          >
            <SelectTrigger className="text-lg">
              <SelectValue placeholder={currentLimit} />
            </SelectTrigger>
            <SelectContent side="top">
              {Object.values(PAGE_LIMITS).map((pageSize) => {
                if (typeof pageSize !== "number") return null;
                return (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}
      {totalPages > 1 && (
        <PaginationRoot>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={createPageURL(currentPage - 1)}
                aria-disabled={currentPage <= 1}
                className={
                  currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {displayedBtns}
            <PaginationItem>
              <PaginationNext
                href={createPageURL(currentPage + 1)}
                aria-disabled={currentPage >= totalPages}
                className={
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </PaginationRoot>
      )}
    </div>
  );
}
