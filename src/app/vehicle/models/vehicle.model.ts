export interface Vehicle {
  vehicleId: string;
  vehicleName: string;
  regNo: string;
  brandId: string;
  modelId: string;
  modelYear?: number;
  isActive: boolean;
}

export interface Brand {
  brandId: string;
  brandName: string;
}

export interface Model {
  modelId: string;
  modelName: string;
  brandId: string;
}

// For creating new vehicles
export interface CreateVehicleDTO {
  vehicleName: string;
  regNo: string;
  brandId: string;
  modelId: number;
  modelYear?: number;
  isActive: boolean;
}

// For creating new models
export interface CreateModelDTO {
  brandId: string; // Will be converted to Guid on backend
  name: string; 
}

// For creating new brands
export interface CreateBrandDTO {
  brandName: string;
}

// For vehicle master data
export interface VehicleMaster {
  vehicleId: string;
  vehicleName: string;
  regNo: string;
  brandId: string;
  modelId: number;
  brandName: string;
  modelName: string;
  modelYear?: number;
  isActive: boolean;
}

// For vehicle list display
export interface VehicleListDTO {
  vehicleId: string;
  vehicleName: string;
  regNo: string;
  brandName: string;
  modelName: string;
  brand: string;
  model: string;
  isActive: boolean;
}

// For vehicle query parameters
export interface VehicleQueryParams {
  page?: number;
  size?: number;
  pageSize?: number;
  brandId?: string;
  modelId?: string;
  isActive?: boolean;
  search?: string;
  brand?: string;
  sortBy?: string;
  sortOrder?: string;
}