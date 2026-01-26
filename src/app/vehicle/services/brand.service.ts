import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { Brand, CreateBrandDTO } from "../models/vehicle.model";

@Injectable({ providedIn: "root" })
export class BrandService {
  private apiUrl = `${environment.apiUrl}/brands`;

  constructor(private http: HttpClient) {}

  // Get All
  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  // Get Single (For Edit)
  getBrandById(id: string): Observable<Brand> {
    return this.http.get<Brand>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  // Create
  addBrand(brand: CreateBrandDTO): Observable<any> {
    return this.http.post(this.apiUrl, brand).pipe(catchError(this.handleError));
  }

  // Update (For Edit)
  updateBrand(id: string, brand: CreateBrandDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, brand).pipe(catchError(this.handleError));
  }

  // Delete (For Delete Button)
  deleteBrand(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error("BrandService Error:", error);
    return throwError(() => error.error?.message || "Server error");
  }
}