export interface IPropertyUnitsMetrics {
  totalUnits: number;
  activeUnits: number;
  inactiveUnits: number;
}

export interface IGetPropertyUnitsProps {
  page?: number;
  limit?: number;
  searchQuery?: string;
  isActive?: boolean;
}
