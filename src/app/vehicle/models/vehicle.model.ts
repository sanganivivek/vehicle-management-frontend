export interface Vehicle {
  vehicleId: string;
  vehicleName: string;
  regNo: string;
  brandId: string;
  modelId: string;
  modelYear?: number;
  id: number;
  currentStatus: number;
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
  regNo: string;
  brandId: string;
  modelId: string;
  modelYear?: number;
  isActive: boolean;
  currentStatus: number;
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
  regNo: string;
  modelYear?: number;
  isActive: boolean;
  brandId: string;
  modelId: string;
  currentStatus: number; // 0: Available, 1: OnRoad, 2: Maintenance
  
  // ADD '?' TO MAKE THESE OPTIONAL
  vehicleName?: string; 
  brandName?: string;
  modelName?: string;
  brand?: string;
  model?: string;
}

export interface VehicleListDTO {
  vehicleId: string;
  vehicleName: string;
  regNo: string;
  brandId: string;
  modelId: string;
  brandName: string;
  modelName: string;
  brand: string;
  model: string;
  modelYear?: number; 
  isActive: boolean;
  currentStatus: number; 
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
  status?: number;
}

// The object sent when UPDATING
export interface UpdateVehicleDTO {
  vehicleId: string;
  regNo: string;
  brandId: string; 
  modelId: string; 
  modelYear: number;
  isActive: boolean;
  vehicleName?: string;
  currentStatus: number;
}