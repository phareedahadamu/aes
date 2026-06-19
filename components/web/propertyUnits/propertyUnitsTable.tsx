"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Unit } from "@/generated/prisma/client";
import { Role } from "@/generated/prisma/enums";
import PaginationWrapped from "../navigation/paginationWrapped";
import { getPaginatedPropertyUnits } from "@/lib/dal/property-units/getPropertyUnits";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ALL_PROPERTY_UNITS_QKEY } from "@/lib/constants/general";
import TableSkeleton from "../tableSkeleton";
import StatusRolePill from "../statusRolePill";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { User } from "@/lib/auth";
import useGetSearchParams from "@/lib/hooks/useGetSearchParams";
import PropertyUnitsActionMenu from "./propertyUnitsActionMenu";
import AddEditPropertyUnitsModal from "./addEditPropertyUnitModal";
import DeactivateOrActivatePropertyUnit from "./deactivateOrActivatePropertyUnit";
import { getActiveFilters } from "@/lib/utils";
import SearchResultFilterText from "../inputsAndFilters/searchResultFilterText";

export default function PropertyUnitsTable() {
  const { page, limit, isActive, search } = useGetSearchParams();
  const { data: session } = useSession();
  const user = session?.user as User | undefined;
  const canEdit = user?.role === Role.ADMIN;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [changeStatusModalOpen, setChangeStatusModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const payload = { page, limit, searchQuery: search, isActive };
  const { data, isPending, error, isError, isPlaceholderData } = useQuery({
    queryKey: [ALL_PROPERTY_UNITS_QKEY, payload],
    queryFn: () => getPaginatedPropertyUnits(payload),
    placeholderData: keepPreviousData,
  });
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
            : "Failed to get property units details"
          : "Failed to get property units details";
    return <div>{errorMsg}</div>;
  }

  //   Populated State
  const tableHeader = ["Code", "Name", "Price", "Status", "Action"];

  const tableHeaderComponents = tableHeader.map((item, index) => (
    <TableHead key={index}>{item}</TableHead>
  ));
  const tableData = data.data.units;
  const rowComponents =
    tableData.length < 1 ? (
      <TableRow>
        <TableCell colSpan={tableHeader.length} className="text-center!">
          No data to display
        </TableCell>
      </TableRow>
    ) : (
      tableData.map((item, index) => (
        <TableRow key={index}>
          <TableCell>{item.code}</TableCell>
          <TableCell>{item.name}</TableCell>
          <TableCell>{"₦" + item.price}</TableCell>
          <TableCell>
            <StatusRolePill type="status" isActive={item.isActive} />
          </TableCell>
          <TableCell>
            <PropertyUnitsActionMenu
              unit={item}
              setUnit={setSelectedUnit}
              disabled={!canEdit}
              setEditModalOpen={setEditModalOpen}
              setChangeStatusOpen={setChangeStatusModalOpen}
            />
          </TableCell>
        </TableRow>
      ))
    );
  const pagination = data.data.pagination;
  return (
    <div className="w-full flex flex-col gap-6">
      <SearchResultFilterText
        searchQuery={search}
        filters={getActiveFilters({ isActive })}
      />
      <div className="w-full flex flex-col gap-8">
        <div
          className={`w-full overflow-x-auto relative ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}
        >
          <Table>
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
      {selectedUnit && (
        <>
          {editModalOpen && (
            <AddEditPropertyUnitsModal
              action="edit"
              unit={selectedUnit}
              isOpen={editModalOpen}
              setIsOpen={setEditModalOpen}
            />
          )}
          {changeStatusModalOpen && (
            <DeactivateOrActivatePropertyUnit
              unit={selectedUnit}
              alertOpen={changeStatusModalOpen}
              setAlertOpen={setChangeStatusModalOpen}
            />
          )}
        </>
      )}
    </div>
  );
}
