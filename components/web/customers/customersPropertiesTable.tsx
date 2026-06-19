"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationWrapped from "../navigation/paginationWrapped";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { CUSTOMER_PROPERTIES_QKEY } from "@/lib/constants/general";
import TableSkeleton from "../tableSkeleton";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import useGetSearchParams from "@/lib/hooks/useGetSearchParams";
import { getPaginatedCustomersProperties } from "@/lib/dal/customers/getCustomersProperties";
import Link from "next/link";
import StatusRolePill from "../statusRolePill";
import SearchResultFilterText from "../inputsAndFilters/searchResultFilterText";
import { getActiveFilters } from "@/lib/utils";
import { Property } from "@/generated/prisma/client";

export default function CustomersPropertiesTable({ id }: { id: string }) {
  const { page, limit, search } = useGetSearchParams();

  const payload = { page, limit, searchQuery: search, id };
  const { data, isPending, error, isError, isPlaceholderData } = useQuery({
    queryKey: [CUSTOMER_PROPERTIES_QKEY, payload],
    queryFn: () => getPaginatedCustomersProperties(payload),
    placeholderData: keepPreviousData,
  });
  //   Populated State
  const tableHeader = ["Code", "Address", "Status", "Outstanding"];

  const tableHeaderComponents = tableHeader.map((item, index) => (
    <TableHead key={index}>{item}</TableHead>
  ));

  const rowComponents = useMemo(() => {
    const tableData = data?.data?.properties ?? ([] as Property[]);
    return tableData.length < 1 ? (
      <TableRow>
        <TableCell colSpan={4} className="text-center!">
          No data to display
        </TableCell>
      </TableRow>
    ) : (
      tableData.map((item, index) => {
        return (
          <TableRow key={index} className="group">
            <TableCell className="px-0! ">
              <Link
                href={`/properties/${item.id}`}
                className="w-full text-center px-2 h-full inline-flex group-hover:bg-accent"
              >
                {item.code}
              </Link>
            </TableCell>
            <TableCell className="px-0!">
              <Link
                href={`/properties/${item.id}`}
                className="w-full text-center px-2 h-full inline-flex group-hover:bg-accent"
              >
                {item.address}
              </Link>
            </TableCell>
            <TableCell className="px-0!">
              <Link
                href={`/properties/${item.id}`}
                className="w-full px-2 inline-flex h-full items-center group-hover:bg-accent"
              >
                <StatusRolePill type="status" isActive={item.isActive} />
              </Link>
            </TableCell>
            <TableCell className="px-0!">
              <Link
                href={`/properties/${item.id}`}
                className="w-full text-center px-2 h-full inline-flex group-hover:bg-accent"
              >
                {item.balance}
              </Link>
            </TableCell>
          </TableRow>
        );
      })
    );
  }, [data]);
  //   Loading State
  if (isPending) return <TableSkeleton />;

  //   Error State
  //   TODO----
  if (isError || !data || !data.data || !data.success) {
    const errorMsg =
      (data && !data.success) || (data && !data.data)
        ? data.message
        : isError
          ? error instanceof Error
            ? error.message
            : "Failed to get Customer details"
          : "Failed to get  Customer details";
    return <div>{errorMsg}</div>;
  }
  const pagination = data.data.pagination;

  return (
    <div className="w-full flex flex-col gap-6">
      <SearchResultFilterText
        searchQuery={search}
        filters={getActiveFilters({})}
      />
      <div className="w-full flex flex-col gap-8 ">
        <div
          className={`w-full overflow-x-auto relative ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}
        >
          <Table className="h-full">
            <TableHeader>
              <TableRow>{tableHeaderComponents}</TableRow>
            </TableHeader>
            <TableBody>{rowComponents}</TableBody>
          </Table>
          {isPlaceholderData && (
            <Loader2
              size={20}
              className="animate-spin text-chart2 absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%]"
            />
          )}
        </div>
        <PaginationWrapped
          currentPage={page}
          totalPages={pagination.totalPages}
          currentLimit={limit}
          totalItems={pagination.totalItems}
          itemCount={pagination.itemCount}
        />
      </div>
    </div>
  );
}
