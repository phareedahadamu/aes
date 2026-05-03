export interface IPagination {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
export interface FilterGroup {
  group: string;
  param: string;
  allTag: string;
  items: { name: string; value: string; active: boolean }[];
}

export enum Tab {
  STAFF = "staff",
  INVITATIONS = "invitations",
}