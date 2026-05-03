import { Role } from "@/generated/prisma/enums";
import { normalizeText } from "@/lib/utils";

type StatusProps = {
  type: "status";
  isActive: boolean;
  role?: never;
};

type RoleProps = {
  type: "role";
  role: Role | "Super Admin";
  isActive?: never;
};

type StatusRolePillProps = StatusProps | RoleProps;

export default function StatusRolePill({
  type,
  isActive,
  role,
}: StatusRolePillProps) {
  if (type === "status")
    return (
      <span
        className={`${isActive ? "border-success bg-success/25 text-success" : "text-secondary border-secondary bg-secondary/25"} text-lg rounded-full border text-center min-w-26.25! px-3 leading-6! h-6!`}
      >
        {isActive ? "Active" : "Disabled"}
      </span>
    );
  return (
    <span
      className={`${role === "REPORTS" ? "border-primary bg-primary/25 text-primary" : role === "ADMIN" ? "border-[#868400] bg-[#868400]/25 text-[#868400]" : role === "OPERATIONS" ? "text-[#871796] border-[#871796] bg-[#871796]/25" : "text-[#893AF0] border-[#893AF0] bg-[#893AF0]/25"} text-lg rounded-full border text-center min-w-28! leading-6! px-3 h-6!`}
    >
      {role === "Super Admin" ? role : normalizeText(role)}
    </span>
  );
}
