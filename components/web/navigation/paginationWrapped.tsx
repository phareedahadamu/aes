import { Suspense } from "react";
import Pagination from "./pagination";
import { PAGE_LIMITS } from "@/lib/constants/general";
import { Loader2 } from "lucide-react";

export default function PaginationWrapped({
  currentPage,
  totalPages,
  currentLimit,
  totalItems,
  itemCount,
}: {
  currentPage: number;
  totalPages: number;
  currentLimit?: PAGE_LIMITS;
  totalItems: number;
  itemCount: number;
}) {
  return (
    <Suspense
      fallback={
        <div className="w-full flex justify-center">
          <Loader2 className="text-border size-4.5 animate-spin" />
        </div>
      }
    >
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        currentLimit={currentLimit}
        totalItems={totalItems}
        itemCount={itemCount}
      />
    </Suspense>
  );
}
