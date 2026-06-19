"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Customer } from "@/generated/prisma/client";
import { Role } from "@/generated/prisma/enums";
import PaginationWrapped from "../navigation/paginationWrapped";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ALL_CUSTOMERS_QKEY } from "@/lib/constants/general";
import TableSkeleton from "../tableSkeleton";
import { Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import { User } from "@/lib/auth";
import useGetSearchParams from "@/lib/hooks/useGetSearchParams";
import { getPaginatedCustomers } from "@/lib/dal/customers/getCustomers";
import AddEditCustomerModal from "./addEditCustomerModal";
import Link from "next/link";
import CustomerActionMenu from "./customersActionMenu";
import SearchResultFilterText from "../inputsAndFilters/searchResultFilterText";
import { getActiveFilters } from "@/lib/utils";

type CustomerType = {
  properties: {
    id: string;
    balance: number;
  }[];
  _count: {
    properties: number;
  };
} & Customer;
export default function CustomersTable() {
  const { page, limit, search } = useGetSearchParams();
  const { data: session } = useSession();
  const user = session?.user as User | undefined;
  const canEdit = user?.role === Role.ADMIN;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(
    null,
  );

  const payload = { page, limit, searchQuery: search };
  const { data, isPending, error, isError, isPlaceholderData } = useQuery({
    queryKey: [ALL_CUSTOMERS_QKEY, payload],
    queryFn: () => getPaginatedCustomers(payload),
    placeholderData: keepPreviousData,
  });
  //   Populated State
  const tableHeader = [
    "Name",
    "Email",
    "Phone",
    "Properties",
    "Total Outstanding",
    "Action",
  ];

  const tableHeaderComponents = tableHeader.map((item, index) => (
    <TableHead key={index}>{item}</TableHead>
  ));

  const rowComponents = useMemo(() => {
    const tableData = data?.data?.customers ?? ([] as CustomerType[]);
    return tableData.length < 1 ? (
      <TableRow>
        <TableCell colSpan={5} className="text-center!">
          No data to display
        </TableCell>
      </TableRow>
    ) : (
      tableData.map((item, index) => {
        const propertyCount = item._count.properties;
        const totalOutstanding = item.properties.reduce(
          (total, property) => total + property.balance,
          0,
        );
        return (
          <TableRow key={index} className="group">
            <TableCell className="px-0! ">
              <Link
                href={`/customers/${item.id}`}
                className="w-full text-center px-2 h-full inline-flex group-hover:bg-accent"
              >
                {item.name}
              </Link>
            </TableCell>
            <TableCell className="px-0!">
              <Link
                href={`/customers/${item.id}`}
                className="w-full text-center px-2 h-full inline-flex group-hover:bg-accent"
              >
                {item.email}
              </Link>
            </TableCell>
            <TableCell className="px-0!">
              <Link
                href={`/customers/${item.id}`}
                className="w-full text-center px-2 h-full inline-flex group-hover:bg-accent"
              >
                {item.phoneNo}
              </Link>
            </TableCell>
            <TableCell className="px-0!">
              <Link
                href={`/customers/${item.id}`}
                className="w-full text-center px-2 h-full inline-flex group-hover:bg-accent"
              >
                {propertyCount}
              </Link>
            </TableCell>
            <TableCell className="px-0!">
              <Link
                href={`/customers/${item.id}`}
                className="w-full text-center px-2 h-full inline-flex group-hover:bg-accent text-destructive"
              >
                {totalOutstanding.toFixed(2)}
              </Link>
            </TableCell>
            <TableCell className="group-hover:bg-accent">
              <div onClick={(e) => e.stopPropagation()}>
                <CustomerActionMenu
                  customer={item}
                  setCustomer={setSelectedCustomer}
                  disabled={!canEdit}
                  setEditModalOpen={setEditModalOpen}
                />
              </div>
            </TableCell>
          </TableRow>
        );
      })
    );
  }, [data, canEdit]);
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
      {selectedCustomer && (
        <>
          {editModalOpen && (
            <AddEditCustomerModal
              action="edit"
              customer={selectedCustomer}
              isOpen={editModalOpen}
              setIsOpen={setEditModalOpen}
            />
          )}
        </>
      )}
    </div>
  );
}
