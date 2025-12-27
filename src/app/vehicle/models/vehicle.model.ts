// src/app/vehicle/models/vehicle.model.ts

export interface Vehicle {
  vehicleId: string;
  regNo: string;
  brand: string;
  model: string;
  modelYear: number;
  isActive: boolean;
}

// ✅ Added Brand interface (Required for loading brands)
export interface Brand {
  brandId: string;
  brandName: string;
}

// ✅ Added CreateModelDTO (Required for saving model)
export interface CreateModelDTO {
  brandId: string;
  name: string;   // <--- MUST be 'name' to match C# backend property 'Name'
}

export interface CreateVehicleDTO {
  regNo: string;
  brand: string;
  model: string;
  modelYear: number;
  isActive: boolean;
}

export interface UpdateVehicleDTO {
  vehicleId: string;
  regNo: string;
  brand: string;
  model: string;
  modelYear: number;
  isActive: boolean;
}