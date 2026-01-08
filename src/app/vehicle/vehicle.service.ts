import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {
  VehicleMaster,
  VehicleListDTO,
  VehicleQueryParams,
  Brand,
  Model,
  CreateVehicleDTO,
} from "./models/vehicle.model";
import { environment } from "../../environments/environment";

export interface VehicleResponse {
  totalCount: number;
  page: number;
  data: VehicleMaster[];
  totalPages: number;
  totalRecords: number;
  pageSize: number;
}

export interface DashboardData {
  totalVehicles: number;
  activeVehicles: number;
  recentVehicles: any[];
}

@Injectable({
  providedIn: "root",
})
export class VehicleService {
  private apiUrl = `${environment.apiUrl}/vehicles`;
  private brandUrl = `${environment.apiUrl}/brands`;
  private modelUrl = `${environment.apiUrl}/models`;

  constructor(private http: HttpClient) {}

  getVehicles(
    queryParams: VehicleQueryParams = {}
  ): Observable<VehicleResponse> {
    let params = new HttpParams();

    if (queryParams.search) params = params.set("Search", queryParams.search);
    if (queryParams.brand) params = params.set("Brand", queryParams.brand);
    if (queryParams.sortBy) params = params.set("SortBy", queryParams.sortBy);
    if (queryParams.sortOrder)
      params = params.set("SortOrder", queryParams.sortOrder);
    if (queryParams.page)
      params = params.set("Page", queryParams.page.toString());
    if (queryParams.pageSize)
      params = params.set("PageSize", queryParams.pageSize.toString());

    return this.http
      .get<VehicleResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  getDashboardData(): Observable<DashboardData> {
    return this.http
      .get<DashboardData>(`${this.apiUrl}/dashboard`)
      .pipe(catchError(this.handleError));
  }

  getVehicleById(id: string): Observable<VehicleMaster> {
    return this.http
      .get<VehicleMaster>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  addVehicle(vehicle: CreateVehicleDTO): Observable<VehicleMaster> {
    // Send data in camelCase (standard JSON format)
    // ASP.NET Core will automatically map camelCase JSON to PascalCase C# properties
    return this.http
      .post<VehicleMaster>(this.apiUrl, vehicle, {
        headers: { "Content-Type": "application/json" },
      })
      .pipe(catchError(this.handleError));
  }

  updateVehicle(id: string, vehicle: any): Observable<any> {
    console.log("Updating vehicle:", id, vehicle);
    // Ensure vehicleId is included in the update payload
    const updatePayload = {
      vehicleId: vehicle.vehicleId || id,
      regNo: vehicle.regNo,
      modelYear: vehicle.modelYear,
      isActive: vehicle.isActive,
      brandId: vehicle.brandId,
      modelId: vehicle.modelId,
      vehicleName: vehicle.vehicleName || "",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      brandName: vehicle.brandName || "",
      modelName: vehicle.modelName || "",
      currentStatus: vehicle.currentStatus,
    };
    return this.http
      .put<any>(`${this.apiUrl}/${id}`, updatePayload, {
        headers: { "Content-Type": "application/json" },
      })
      .pipe(catchError(this.handleError));
  }

  deleteVehicle(id: string): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getBrands(): Observable<Brand[]> {
    return this.http
      .get<Brand[]>(this.brandUrl)
      .pipe(catchError(this.handleError));
  }

  getModelsByBrand(brandId: string): Observable<Model[]> {
    return this.http
      .get<Model[]>(`${this.modelUrl}/by-brand/${brandId}`)
      .pipe(catchError(this.handleError));
  }

  addModel(model: any): Observable<any> {
    return this.http
      .post(this.modelUrl, model)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error("API Error:", error);
    return throwError(() => error);
  }
}
