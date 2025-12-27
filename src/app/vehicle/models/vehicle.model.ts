export interface Vehicle {
  vehicleId: string;
  regNo: string;
  brand: string;
  model: string;
  modelYear: number;
  isActive: boolean;
}

// ✅ ADDED: Required for your Brand dropdowns
export interface Brand {
  brandId: string;
  brandName: string;
}

// ✅ ADDED: Required for "Add Model". 
// CRITICAL: We use 'name' here because your C# Backend expects "Name", not "modelName".
export interface CreateModelDTO {
  brandId: string;
  name: string;   
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