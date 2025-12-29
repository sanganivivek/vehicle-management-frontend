export interface Vehicle {
  vehicleId: string;
  vehicleName: string; // Updated from regNo to match Backend
  brandId: string;
  modelId: string;
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
  brandId: string;
  modelId: string;
  isActive: boolean;
}

// For creating new models
export interface CreateModelDTO {
  brandId: string;
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
  brandId: string;
  modelId: string;
  brandName: string;
  modelName: string;
  isActive: boolean;
}

// For vehicle list display
export interface VehicleListDTO {
  vehicleId: string;
  vehicleName: string;
  brandName: string;
  modelName: string;
  isActive: boolean;
}

// For vehicle query parameters
export interface VehicleQueryParams {
  page?: number;
  size?: number;
  brandId?: string;
  modelId?: string;
  isActive?: boolean;
  search?: string;
}