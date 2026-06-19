export interface IGetCustomersProps {
  page?: number;
  limit?: number;
  searchQuery?: string;
}

export interface IGetCustomerStatsProps {
  activeProperties: number;
  inActiveProperties: number;
  activeOutstanding: number;
  totalOutstanding: number;
}
export interface IGetCustomersPropertiesProps {
  page?: number;
  limit?: number;
  searchQuery?: string;
  id: string;
}
