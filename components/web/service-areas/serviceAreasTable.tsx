"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Ward } from "@/generated/prisma/client";
import { Role } from "@/generated/prisma/enums";
import PaginationWrapped from "../navigation/paginationWrapped";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ALL_SERVICE_AREAS_QKEY } from "@/lib/constants/general";
import TableSkeleton from "../tableSkeleton";
import StatusRolePill from "../statusRolePill";
import { Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import { User } from "@/lib/auth";
import useGetSearchParams from "@/lib/hooks/useGetSearchParams";
import WardsActionMenu from "./wardsActionMenu";
import DeactivateOrActivateWard from "./deactivateOrActivateWard";
import { getPaginatedServiceAreas } from "@/lib/dal/service-areas/getServiceAreas";
import AddEditWardModal from "./addEditWardModal";
import Link from "next/link";
import { getActiveFilters } from "@/lib/utils";
import SearchResultFilterText from "../inputsAndFilters/searchResultFilterText";

type WardType = {
  streets: ({
    _count: {
      properties: number;
    };
  } & { id: string })[];
  _count: {
    streets: number;
  };
} & Ward;
export default function ServiceAreasTable() {
  const { page, limit, isActive, search } = useGetSearchParams();
  const { data: session } = useSession();
  const user = session?.user as User | undefined;
  const canEdit = user?.role === Role.ADMIN;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [changeStatusModalOpen, setChangeStatusModalOpen] = useState(false);
  const [selectedWard, setSelectedWard] = useState<WardType | null>(null);

  const payload = { page, limit, searchQuery: search, isActive };
  const { data, isPending, error, isError, isPlaceholderData } = useQuery({
    queryKey: [ALL_SERVICE_AREAS_QKEY, payload],
    queryFn: () => getPaginatedServiceAreas(payload),
    placeholderData: keepPreviousData,
  });

  //   Populated State
  const tableHeader = [
    "Code",
    "Name",
    "Streets",
    "Properties",
    "Status",
    "Action",
  ];

  const tableHeaderComponents = tableHeader.map((item, index) => (
    <TableHead key={index}>{item}</TableHead>
  ));

  const rowComponents = useMemo(() => {
    const tableData = data?.data?.wards ?? ([] as WardType[]);
    return tableData.length < 1 ? (
      <TableRow>
        <TableCell colSpan={6} className="text-center!">
          No data to display
        </TableCell>
      </TableRow>
    ) : (
      tableData.map((item, index) => {
        const propertyCount = item.streets.reduce(
          (total, property) => total + property._count.properties,
          0,
        );
        return (
          <TableRow key={index} className="group">
            <TableCell className="px-0! ">
              <Link
                href={`/service-areas/${item.id}`}
                className="w-full text-center px-2 h-full inline-flex group-hover:bg-accent"
              >
                {item.code}
              </Link>
            </TableCell>
            <TableCell className="px-0!">
              <Link
                href={`/service-areas/${item.id}`}
                className="w-full text-center px-2 h-full inline-flex group-hover:bg-accent"
              >
                {item.name}
              </Link>
            </TableCell>
            <TableCell className="px-0!">
              <Link
                href={`/service-areas/${item.id}`}
                className="w-full text-center px-2 h-full inline-flex group-hover:bg-accent"
              >
                {item._count.streets}
              </Link>
            </TableCell>
            <TableCell className="px-0!">
              <Link
                href={`/service-areas/${item.id}`}
                className="w-full text-center px-2 h-full inline-flex group-hover:bg-accent"
              >
                {propertyCount}
              </Link>
            </TableCell>
            <TableCell className="px-0!">
              <Link
                href={`/service-areas/${item.id}`}
                className="w-full px-2 inline-flex h-full items-center group-hover:bg-accent"
              >
                <StatusRolePill type="status" isActive={item.isActive} />
              </Link>
            </TableCell>
            <TableCell className="group-hover:bg-accent">
              <div onClick={(e) => e.stopPropagation()}>
                <WardsActionMenu
                  ward={item}
                  setWard={setSelectedWard}
                  disabled={!canEdit}
                  setEditModalOpen={setEditModalOpen}
                  setChangeStatusOpen={setChangeStatusModalOpen}
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
            : "Failed to get Service Area details"
          : "Failed to get  Service Area details";
    return <div>{errorMsg}</div>;
  }
  const pagination = data.data.pagination;

  return (
    <div className="w-full flex flex-col gap-6 ">
      <SearchResultFilterText
        searchQuery={search}
        filters={getActiveFilters({ isActive })}
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
      {selectedWard && (
        <>
          {editModalOpen && (
            <AddEditWardModal
              action="edit"
              ward={selectedWard}
              isOpen={editModalOpen}
              setIsOpen={setEditModalOpen}
            />
          )}
          {changeStatusModalOpen && (
            <DeactivateOrActivateWard
              ward={selectedWard}
              alertOpen={changeStatusModalOpen}
              setAlertOpen={setChangeStatusModalOpen}
            />
          )}
        </>
      )}
    </div>
  );
}
