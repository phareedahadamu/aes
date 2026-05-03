import { Role } from "@/generated/prisma/enums";
export interface IStaffMetrics {
  totalStaff: number;
  activeStaff: number;
  inactiveStaff: number;
  pendingInvitations: number;
}

export interface IGetStaffProps {
  page?: number;
  limit?: number;
  emailQuery?: string;
  isActive?: boolean;
  role?: Role;
}
export interface IGetInvitationsProps {
  page?: number;
  limit?: number;
  emailQuery?: string;
  isUsed?: boolean;
  isExpired?: boolean;
}
