export interface IServiceAreasMetrics {
  totalWards: number;
  totalStreets: number;
  totalProperties: number;
  inactiveAreas: number;
}

export interface IGetServiceAreasProps {
  page?: number;
  limit?: number;
  searchQuery?: string;
  isActive?: boolean;
}

export interface IGetStreetsProps {
  page?: number;
  limit?: number;
  searchQuery?: string;
  isActive?: boolean;
  wardId: string;
}
