"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Street } from "@/generated/prisma/client";
import { Role } from "@/generated/prisma/enums";
import PaginationWrapped from "../../navigation/paginationWrapped";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ALL_STREETS_QKEY } from "@/lib/constants/general";
import TableSkeleton from "../../tableSkeleton";
import StatusRolePill from "../../statusRolePill";
import { Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import { User } from "@/lib/auth";
import useGetSearchParams from "@/lib/hooks/useGetSearchParams";
import StreetsActionMenu from "./streetsActionMenu";
import AddEditStreetModal from "./addEditStreetModal";
import { getPaginatedStreets } from "@/lib/dal/service-areas/streets/getStreets";
import DeativateOrActivateStreet from "./deactivateOrActivateStreet";
import { getActiveFilters } from "@/lib/utils";
import SearchResultFilterText from "../../inputsAndFilters/searchResultFilterText";

export default function StreetsTable({ wardId }: { wardId: string }) {
  const { page, limit, isActive, search } = useGetSearchParams();
  const { data: session } = useSession();
  const user = session?.user as User | undefined;
  const canEdit = user?.role === Role.ADMIN || user?.role === Role.OPERATIONS;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [changeStatusModalOpen, setChangeStatusModalOpen] = useState(false);
  const [selectedStreet, setSelectedStreet] = useState<Street | null>(null);

  const payload = { page, limit, searchQuery: search, isActive, wardId };
  const { data, isPending, error, isError, isPlaceholderData } = useQuery({
    queryKey: [ALL_STREETS_QKEY, payload],
    queryFn: () => getPaginatedStreets(payload),
    placeholderData: keepPreviousData,
  });

  //   Populated State
  const tableHeader = ["Code", "Name", "Properties", "Status", "Action"];

  const tableHeaderComponents = tableHeader.map((item, index) => (
    <TableHead key={index}>{item}</TableHead>
  ));

  const rowComponents = useMemo(() => {
    const tableData =
      data?.data?.streets ??
      ([] as ({
        _count: {
          properties: number;
        };
      } & Street)[]);
    return tableData.length < 1 ? (
      <TableRow>
        <TableCell colSpan={5} className="text-center!">
          No data to display
        </TableCell>
      </TableRow>
    ) : (
      tableData.map((item, index) => {
        const propertyCount = item._count.properties;
        return (
          <TableRow key={index} className="group">
            <TableCell>{item.code}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{propertyCount}</TableCell>
            <TableCell>
              <StatusRolePill type="status" isActive={item.isActive} />
            </TableCell>
            <TableCell>
              <StreetsActionMenu
                street={item}
                setStreet={setSelectedStreet}
                disabled={!canEdit}
                setEditModalOpen={setEditModalOpen}
                setChangeStatusOpen={setChangeStatusModalOpen}
              />
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
            : "Failed to get Street details"
          : "Failed to get  Street details";
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
      {selectedStreet && (
        <>
          {editModalOpen && (
            <AddEditStreetModal
              action="edit"
              street={selectedStreet}
              isOpen={editModalOpen}
              setIsOpen={setEditModalOpen}
              wardId={selectedStreet.wardId}
            />
          )}
          {changeStatusModalOpen && (
            <DeativateOrActivateStreet
              street={selectedStreet}
              alertOpen={changeStatusModalOpen}
              setAlertOpen={setChangeStatusModalOpen}
            />
          )}
        </>
      )}
    </div>
  );
}
