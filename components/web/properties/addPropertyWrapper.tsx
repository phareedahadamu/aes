"use client";
import { Loader2 } from "lucide-react";
import AddEditPropertyModal from "./addPropertiesModal";
import { getCustomerById } from "@/lib/dal/customers/getCustomers";
import { useQuery } from "@tanstack/react-query";
import { CUSTOMER_BY_ID_QKEY } from "@/lib/constants/general";
export default function AddPropertyWrapper({
  customerId,
}: {
  customerId: string;
}) {
  const { data, isPending } = useQuery({
    queryKey: [CUSTOMER_BY_ID_QKEY, { customerId }],
    queryFn: () => getCustomerById({ customerId }),
    throwOnError: true,
  });
  const owner = data?.data;

  return (
    <div className="w-fit relative flex">
      {" "}
      <AddEditPropertyModal
        disabled={isPending}
        action="add"
        origin="customerDetailsPage"
        owner={owner}
      />
      {isPending && (
        <div className="w-full absolute bg-muted/50 h-full flex top-0 left-0 z-100 items-center justify-center">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
