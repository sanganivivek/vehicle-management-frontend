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
    
    if (queryParams.Search) params = params.set('Search', queryParams.Search);
    if (queryParams.Brand) params = params.set('Brand', queryParams.Brand);
    if (queryParams.SortBy) params = params.set('SortBy', queryParams.SortBy);
    if (queryParams.SortOrder) params = params.set('SortOrder', queryParams.SortOrder);
    if (queryParams.Page) params = params.set('Page', queryParams.Page.toString());
    if (queryParams.PageSize) params = params.set('PageSize', queryParams.PageSize.toString());

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