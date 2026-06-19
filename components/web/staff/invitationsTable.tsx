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
import { getPaginatedInvitations } from "@/lib/dal/staff/getStaff";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ALL_INVITATIONS_QKEY, PAGE_LIMITS } from "@/lib/constants/general";
import TableSkeleton from "../tableSkeleton";
import StatusRolePill from "../statusRolePill";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import InvitationsActionMenu from "./invitationsActionMenu";
import { Invitation } from "@/generated/prisma/client";
import RevokeInvitation from "./revokeInvitation";
import ReactivateInvitation from "./reactivateInvitation";

export default function InvitationsTable({
  page,
  emailQuery,
  isUsed,
  isExpired,
  limit,
}: {
  page: number;
  emailQuery: string | undefined;
  isUsed: boolean | undefined;
  isExpired: boolean | undefined;
  limit: PAGE_LIMITS;
}) {
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [reactivateOpen, setReactivateOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] =
    useState<Invitation | null>(null);
  const payload = { page, limit, emailQuery, isUsed, isExpired };

  const { data, isPending, error, isError, isPlaceholderData } = useQuery({
    queryKey: [ALL_INVITATIONS_QKEY, payload],
    queryFn: () => getPaginatedInvitations(payload),
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
            : "Failed to get invitation details"
          : "Failed to get invitation details";
    return <div>{errorMsg}</div>;
  }

  //   Populated State
  const tableHeader = ["Email", "Role", "Status", "Validity", "Action"];

  const tableHeaderComponents = tableHeader.map((item, index) => (
    <TableHead key={index}>{item}</TableHead>
  ));
  const tableData = data.data.invitations;
  const rowComponents =
    tableData.length < 1 ? (
      <TableRow>
        <TableCell colSpan={tableHeader.length} className="text-center!">
          No data to display
        </TableCell>
      </TableRow>
    ) : (
      // TODO ---
      tableData.map((item, index) => {
        const expiresAt = new Date(item.expiresAt);
        const isExpired = expiresAt < new Date();
        return (
          <TableRow key={index}>
            <TableCell>{item.email}</TableCell>
            <TableCell>
              <StatusRolePill type="role" role={item.role} />
            </TableCell>

            <TableCell>{item.used ? "Used" : "Unused"}</TableCell>
            <TableCell>{isExpired ? "Expired" : "Active"}</TableCell>
            <TableCell>
              <InvitationsActionMenu
                invitation={item}
                setRevokeOpen={setRevokeOpen}
                setReactivateOpen={setReactivateOpen}
                setInvitation={setSelectedInvitation}
              />
            </TableCell>
          </TableRow>
        );
      })
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
        itemCount={pagination.itemCount}
      />
      {selectedInvitation && revokeOpen && (
        <RevokeInvitation
          invitation={selectedInvitation}
          setRevokeOpen={setRevokeOpen}
          revokeOpen={revokeOpen}
        />
      )}
      {selectedInvitation && reactivateOpen && (
        <ReactivateInvitation
          invitation={selectedInvitation}
          setReactivateOpen={setReactivateOpen}
          reactivateOpen={reactivateOpen}
        />
      )}
    </div>
  );
}
