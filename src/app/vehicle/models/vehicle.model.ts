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
  regNo: string;
  brandId: string;
  modelId: string;
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
  regNo: string;
  modelYear?: number;
  isActive: boolean;
  brandId: string;
  modelId: string;
  
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
}

// The object sent when UPDATING
export interface UpdateVehicleDTO {
  vehicleId: string;
  regNo: string;
  brandId: string; // Must be ID
  modelId: string; // Must be ID
  modelYear: number;
  isActive: boolean;
  
  // Optional: You can include vehicleName if your backend requires it,
  // even if it ignores it.
  vehicleName?: string;
}

export interface VehicleMaster {
  // ... existing fields ...
  currentStatus: number; // 0: Available, 1: Rented, 2: Maintenance
}