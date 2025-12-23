// Brand interfaces
export interface Brand {
  brandId: string;
  brandName: string;
}

export interface CreateBrandDTO {
  brandName: string;
}

// Model interfaces
export interface Model {
  modelId: string;
  modelName: string;
  brandId: string;
}

// Create Model DTO (for POST requests)
export interface CreateModelDTO {
  modelName: string;
  brandId: string;
}

// Vehicle DTO from backend (enriched with brand and model names)
export interface VehicleListDTO {
  regNo: string;
  brand: string;
  model: string;
  vehicleName?: string;
  brandId?: string;
  modelId?: string;
}

// Vehicle interfaces
export interface VehicleMaster {
  vehicleId?: string;
  regNo: string;
  vehicleName: string;
  brandId: string;
  modelId: string;
  modelYear: number;
  isActive: boolean;
}

// Query parameters for vehicle search
export interface VehicleQueryParams {
  Brand?: string;
  Search?: string;
  SortBy?: string;
  SortOrder?: string;
  Page?: number;
  PageSize?: number;
}
