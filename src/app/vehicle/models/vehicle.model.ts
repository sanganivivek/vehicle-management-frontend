export interface Vehicle {
  vehicleId: string;
  vehicleName: string;
  regNo: string;
  chassisNumber: string;
  brandId: string;
  modelId: string;
  modelYear?: number;
  id: number;
  currentStatus: number;
}
export interface Brand {
  brandId: string;
  brandName: string;
  brandCode: string; // New
  isActive: boolean; // New 
}
export interface Model {
  modelId: string;
  modelCode?: string;
  modelName?: string;
  modelType?: string; // Variant
  description?: string;
  brandId: string;
  brandName?: string;
  brandCode?: string;
}
export interface CreateVehicleDTO {
  regNo: string;
  chassisNumber: string;
  brandId: string;
  modelId: string;
  modelYear?: number;
  isActive: boolean;
  currentStatus: number;
}
export interface CreateModelDTO {
  brandId: string;
  modelCode?: string;
  name: string;
  modelType?: string; // Variant
  description?: string;
}
export interface CreateBrandDTO {
  brandName: string;
  brandCode: string; // New
  isActive: boolean; // New
}
export interface VehicleMaster {
  vehicleId: string;
  regNo: string;
  chassisNumber: string;
  modelYear?: number;
  yearOfManufacture?: number; // Added this
  isActive: boolean;
  brandId: string;
  modelId: string;
  currentStatus: number;
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
  chassisNumber: string;
  brandId: string;
  modelId: string;
  brandName: string;
  modelName: string;
  brand: string;
  model: string;
  modelYear?: number;
  yearOfManufacture?: number; // Added this
  isActive: boolean;
  currentStatus: number;
}
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
export interface UpdateVehicleDTO {
  vehicleId: string;
  regNo: string;
  chassisNumber: string;
  brandId: string;
  modelId: string;
  modelYear: number;
  isActive: boolean;
  vehicleName?: string;
  currentStatus: number;
}
