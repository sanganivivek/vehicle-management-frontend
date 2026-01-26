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
  brandCode: string;
  isActive: boolean;
}
export interface Model {
  modelId: string;
  modelName: string;
  brandId: string;
}
export interface CreateVehicleDTO {
  regNo: string;
  brandId: string;
  modelId: string;
  modelYear?: number;
  isActive: boolean;
  currentStatus: number;
}
export interface CreateModelDTO {
  brandId: string;
  name: string;
}
export interface CreateBrandDTO {
  brandName: string;
  brandCode: string;
  isActive: boolean;
}
export interface VehicleMaster {
  vehicleId: string;
  regNo: string;
  modelYear?: number;
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
  brandId: string;
  modelId: string;
  modelYear: number;
  isActive: boolean;
  vehicleName?: string;
  currentStatus: number;
}
