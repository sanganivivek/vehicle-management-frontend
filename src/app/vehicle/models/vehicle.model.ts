// --- Main Vehicle Entities ---
export interface Vehicle {
  vehicleId?: string;
  regNo: string;
  vehicleName?: string;
  brand?: string;
  brandId?: string;
  model?: string;
  modelId?: string;
  modelYear: number;
  isActive: boolean;
}

// Often used as an alias for Vehicle in lists
export interface VehicleListDTO extends Vehicle {}

// Often used as the full entity details
export interface VehicleMaster extends Vehicle {}

// --- Brand Interfaces ---
export interface Brand {
  brandId: string;
  brandName: string;
}

export interface CreateBrandDTO {
  brandName: string;
}

// --- Model Interfaces ---
export interface Model {
  modelId: string;
  modelName: string;
  brandId: string;
}

export interface CreateModelDTO {
  brandId: string;
  name: string;
}

// --- Vehicle DTOs (Data Transfer Objects) ---
export interface CreateVehicleDTO {
  regNo: string;
  vehicleName?: string;
  brand: string;
  brandId?: string;
  model: string;
  modelId?: string;
  modelYear: number;
  isActive: boolean;
}

export interface UpdateVehicleDTO {
  vehicleId: string;
  regNo: string;
  vehicleName?: string;
  brand: string;
  brandId?: string;
  model: string;
  modelId?: string;
  modelYear: number;
  isActive: boolean;
}

// --- Service Parameters ---
export interface VehicleQueryParams {
  search?: string;
  brand?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}