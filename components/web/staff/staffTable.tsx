"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Role } from "@/generated/prisma/client";
import PaginationWrapped from "../navigation/paginationWrapped";
import { getPaginatedStaff } from "@/lib/dal/staff/getStaff";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ALL_STAFF_QKEY, PAGE_LIMITS } from "@/lib/constants/general";
import TableSkeleton from "../tableSkeleton";
import StatusRolePill from "../statusRolePill";
import { Loader2 } from "lucide-react";
import StaffActionMenu from "./staffActionMenu";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { User } from "@/lib/auth";
import DeactivateOrActivateStaff from "./deactivateOrActivateStaff";
import ChangeStaffRole from "./changeStaffRole";

export default function StaffTable({
  page,
  emailQuery,
  isActive,
  role,
  limit,
}: {
  page: number;
  emailQuery: string | undefined;
  isActive: boolean | undefined;
  role: Role | undefined;
  limit: PAGE_LIMITS;
}) {
  const { data: session } = useSession();
  const user = session?.user as User | undefined;
  const [alertOpen, setAlertOpen] = useState(false);
  const [staff, setStaff] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const payload = { page, limit, emailQuery, isActive, role };
  const { data, isPending, error, isError, isPlaceholderData } = useQuery({
    queryKey: [ALL_STAFF_QKEY, payload],
    queryFn: () => getPaginatedStaff(payload),
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
            : "Failed to get staff details"
          : "Failed to get staff details";
    return <div>{errorMsg}</div>;
  }

  //   Populated State
  const tableHeader = ["Name", "Email", "Role", "Status", "Action"];

  const tableHeaderComponents = tableHeader.map((item, index) => (
    <TableHead key={index}>{item}</TableHead>
  ));
  const tableData = data.data.users;
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
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.email}</TableCell>
          <TableCell>
            <StatusRolePill type="role" role={item.role} />
          </TableCell>
          <TableCell>
            <StatusRolePill type="status" isActive={item.isActive} />
          </TableCell>
          <TableCell>
            <StaffActionMenu
              isAuthedStaff={user?.id === item.id}
              isActive={item.isActive}
              setAlertOpen={setAlertOpen}
              setDialogOpen={setDialogOpen}
              staff={item}
              setStaff={setStaff}
            />
          </TableCell>
        </TableRow>
      ))
    );
  const pagination = data.data.pagination;
  return (
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
      />
      {alertOpen && staff && (
        <DeactivateOrActivateStaff
          staff={staff}
          setAlertOpen={setAlertOpen}
          alertOpen={alertOpen}
        />
      )}
      {dialogOpen && staff && (
        <ChangeStaffRole
          staff={staff}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
        />
      )}
    </div>
  );
}
