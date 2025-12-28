import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { VehicleMaster, VehicleListDTO, VehicleQueryParams, Brand, Model } from './models/vehicle.model';
import { environment } from '../../environments/environment';

export interface VehicleResponse {
  totalCount: number;
  page: number;
  data: VehicleListDTO[];
  totalPages: number;
  totalRecords: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = `${environment.apiUrl}/vehicles`;
  private brandUrl = `${environment.apiUrl}/brands`;
  private modelUrl = `${environment.apiUrl}/models`;

  constructor(private http: HttpClient) {}

  getVehicles(queryParams: VehicleQueryParams = {}): Observable<VehicleResponse> {
    let params = new HttpParams();
    
    if (queryParams.search) params = params.set('Search', queryParams.search);
    if (queryParams.brand) params = params.set('Brand', queryParams.brand);
    if (queryParams.sortBy) params = params.set('SortBy', queryParams.sortBy);
    if (queryParams.sortOrder) params = params.set('SortOrder', queryParams.sortOrder);
    if (queryParams.page) params = params.set('Page', queryParams.page.toString());
    if (queryParams.pageSize) params = params.set('PageSize', queryParams.pageSize.toString());

    return this.http.get<VehicleResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  getVehicleById(id: string): Observable<VehicleMaster> {
    return this.http.get<VehicleMaster>(`${this.apiUrl}/${id}`);
  }

  addVehicle(vehicle: VehicleMaster): Observable<VehicleMaster> {
    return this.http.post<VehicleMaster>(this.apiUrl, vehicle);
  }

  updateVehicle(id: string, vehicle: VehicleMaster): Observable<VehicleMaster> {
    return this.http.put<VehicleMaster>(`${this.apiUrl}/${id}`, vehicle);
  }

  deleteVehicle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.brandUrl)
      .pipe(catchError(this.handleError));
  }
  
  getModelsByBrand(brandId: string): Observable<Model[]> {
    return this.http.get<Model[]>(`${this.modelUrl}/by-brand/${brandId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => error);
  }
}