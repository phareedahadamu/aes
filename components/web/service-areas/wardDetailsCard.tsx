"use client";

import { useQuery } from "@tanstack/react-query";
import { WARD_BY_ID_QKEY } from "@/lib/constants/general";
import { getWardById } from "@/lib/dal/service-areas/getServiceAreas";
import PageDetailsCardSkeleton from "../pageDetailsCardSkeleton";
import AddEditWardModal from "./addEditWardModal";
import { useState } from "react";
import StatusRolePill from "../statusRolePill";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";

export default function WardDetailsCard({ wardId }: { wardId: string }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data, isPending } = useQuery({
    queryKey: [WARD_BY_ID_QKEY, { wardId }],
    queryFn: () => getWardById({ wardId }),
    throwOnError: true,
  });
  if (isPending) return <PageDetailsCardSkeleton />;
  const name = data?.data?.name ?? "-";
  const code = data?.data?.code ?? "-";
  const isActive = data?.data?.isActive ?? false;
  const streetCount = data?.data?._count.streets ?? 0;

  return (
    <div className="w-full bg-background flex flex-col items-start p-4 rounded-mid gap-4">
      <div className="w-full flex justify-between items-center">
        <h2 className="uppercase font-medium text-2xl">{code}</h2>
        <Button variant="link" onClick={() => setIsEditModalOpen(true)}>
          <SquarePen />
          Edit
        </Button>
      </div>
      <div className="grid grid-cols-2 w-fit gap-y-1 gap-x-2">
        <span className="font-medium text-muted-foreground">Name</span>
        <span className="font-medium">{name}</span>
        <span className="font-medium text-muted-foreground">Status</span>
        <StatusRolePill type="status" isActive={isActive} />
        <span className="font-medium text-muted-foreground">Streets</span>
        <span className="font-medium">{streetCount}</span>
      </div>
      {isEditModalOpen && data?.data && (
        <AddEditWardModal
          action="edit"
          ward={data?.data}
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
        />
      )}
    </div>
  );
}
