"use client";
import { getCustomerById } from "@/lib/dal/customers/getCustomers";
import { useQuery } from "@tanstack/react-query";
import { CUSTOMER_BY_ID_QKEY } from "@/lib/constants/general";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { useState } from "react";
import AddEditCustomerModal from "./addEditCustomerModal";
export default function CustomerDetailsCard({
  customerId,
}: {
  customerId: string;
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data, isPending } = useQuery({
    queryKey: [CUSTOMER_BY_ID_QKEY, { customerId }],
    queryFn: () => getCustomerById({ customerId }),
    throwOnError: true,
  });
  if (isPending) {
    return <div>Loading...</div>;
  }
  const customerDetails = data?.data;
  return (
    <div className="bg-background px-4 py-[6.5px] flex flex-col  rounded-mid border border-border gap-2 shadow-[0px_0px_1px_0px_#4242421A,0px_1px_1px_0px_#42424217,0px_3px_2px_0px_#4242420D,0px_6px_2px_0px_#42424203,0px_9px_2px_0px_#42424200] w-full min-w-0 h-full">
      <div className="w-full flex justify-between items-center">
        <h2 className="font-medium text-2xl">{customerDetails?.name ?? "-"}</h2>
        <Button variant="link" onClick={() => setIsEditModalOpen(true)}>
          <SquarePen />
          Edit
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[0.5fr_2.5fr] w-full gap-y-2 gap-x-2 ">
        <span className="font-medium text-muted-foreground  leading-10">
          {" "}
          Email
        </span>
        <p className="font-medium w-full border border-transparent border-b-border leading-10">
          {customerDetails?.email ?? "-"}
        </p>
        <span className="font-medium text-muted-foreground leading-10">
          {" "}
          Phone
        </span>
        <p className="font-medium  w-full  border border-transparent border-b-border leading-10">
          {customerDetails?.phoneNo ?? "-"}
        </p>
        <span className="font-medium text-muted-foreground leading-10">
          {" "}
          Properties
        </span>
        <p className="font-medium  w-full  border border-transparent border-b-border leading-10">
          {customerDetails?._count.properties ?? 0}
        </p>
        <span className="font-medium text-muted-foreground leading-10">
          {" "}
          Address
        </span>
        <p className="font-medium w-full  border border-transparent border-b-border leading-10">
          {customerDetails?.address ?? "-"}
        </p>
      </div>
      {isEditModalOpen && data?.data && (
        <AddEditCustomerModal
          action="edit"
          customer={data?.data}
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
        />
      )}
    </div>
  );
}
