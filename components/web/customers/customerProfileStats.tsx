"use client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, House, Banknote } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { CUSTOMER_PROFILE_STATS_QKEY } from "@/lib/constants/general";
import { getCustomerStats } from "@/lib/dal/customers/getCustomers";
export default function CustomerProfileStats({
  customerId,
}: {
  customerId: string;
}) {
  const { data, isPending, error } = useQuery({
    queryKey: [CUSTOMER_PROFILE_STATS_QKEY, { customerId }],
    queryFn: () => getCustomerStats({ customerId }),
  });
  const stats: {
    key: string;
    title: string;
    icon: ReactNode;
  }[] = [
    {
      key: "activeProperties",
      title: "Active Properties",
      icon: (
        <span className="bg-[#F6F6F6] rounded-mid p-1.5">
          <House size={24} color="#1BB15C" />
        </span>
      ),
    },
    {
      key: "inActiveProperties",
      title: "Inactive Properties",
      icon: (
        <span className="bg-[#F6F6F6] rounded-mid p-1.5">
          <House size={24} color="#A6A6A6" />
        </span>
      ),
    },
    {
      key: "activeOutstanding",
      title: "Active Outstanding",
      icon: (
        <span className="bg-[#F6F6F6] rounded-mid p-1.5">
          <Banknote size={24} color="#C52917" />
        </span>
      ),
    },
    {
      key: "totalOutstanding",
      title: "Total Outstanding",
      icon: (
        <span className="bg-[#FEF5E6] rounded-mid p-1.5">
          <Banknote color="#F29A04" size={24} />
        </span>
      ),
    },
  ];
  const statComponents = stats.map((stat, index) => {
    return (
      <div
        key={index}
        className="bg-background px-4 py-[6.5px] flex flex-col h-37.5 rounded-mid border border-border gap-6 shadow-[0px_0px_1px_0px_#4242421A,0px_1px_1px_0px_#42424217,0px_3px_2px_0px_#4242420D,0px_6px_2px_0px_#42424203,0px_9px_2px_0px_#42424200]"
      >
        <div className="w-full flex justify-between items-center">
          <span className="font-medium">{stat.title}</span> {stat.icon}
        </div>
        {isPending ? (
          <Loader2 size="32" className="animate-spin text-chart-2" />
        ) : (
          <span className="font-semibold text-[32px]">
            {data && data.success && data.data && stat.key in data.data
              ? data.data[stat.key as keyof typeof data.data]
              : "-"}
          </span>
        )}
      </div>
    );
  });

  useEffect(() => {
    if (error || (data && !data.success)) {
      toast.error(
        "Something went wrong while retrieving this customer's stats. Try again later",
      );
    }
  }, [data, error]);
  return (
    <section className="w-full grid grid-cols-1 lg:grid-cols-2 lg:gap-x-[10.67px] gap-x-4 gap-y-5">
      {statComponents}
    </section>
  );
}
