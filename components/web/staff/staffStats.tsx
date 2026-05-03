"use client";
import { useQuery } from "@tanstack/react-query";
import { getStaffStats } from "@/lib/dal/staff/getStaff";
import {
  UserRoundCog,
  UserRoundCheck,
  UserRoundKey,
  UserRoundX,
  Loader2,
} from "lucide-react";
import { ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { STAFF_METRICS_QKEY } from "@/lib/constants/general";
export default function StaffStats() {
  const { data, isPending, error } = useQuery({
    queryKey: [STAFF_METRICS_QKEY],
    queryFn: getStaffStats,
  });
  const stats: {
    key: string;
    title: string;
    icon: ReactNode;
  }[] = [
    {
      key: "totalStaff",
      title: "Total Staff",
      icon: (
        <span className="bg-[#F6F6F6] rounded-mid p-1.5">
          <UserRoundCog size={24} color="#1F78D2" />
        </span>
      ),
    },
    {
      key: "activeStaff",
      title: "Active Staff",
      icon: (
        <span className="bg-[#F6F6F6] rounded-mid p-1.5">
          <UserRoundCheck size={24} color="#1BB15C" />
        </span>
      ),
    },
    {
      key: "pendingInvitations",
      title: "Pending invites",
      icon: (
        <span className="bg-[#FEF5E6] rounded-mid p-1.5">
          <UserRoundKey color="#F29A04" size={24} />
        </span>
      ),
    },
    {
      key: "inactiveStaff",
      title: "Disabled Staff",
      icon: (
        <span className="bg-[#FBEAE8] rounded-mid p-1.5">
          <UserRoundX color="#C52917" size={24} />
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
        "Something went wrong while retrieving staff stats. Try again later",
      );
    }
  }, [data, error]);
  return (
    <section className="w-full grid grid-cols-2 lg:grid-cols-4 lg:gap-x-[10.67px] gap-x-4 gap-y-5 ">
      {statComponents}
    </section>
  );
}
