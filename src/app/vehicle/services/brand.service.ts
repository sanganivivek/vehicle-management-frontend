  import { Injectable } from '@angular/core';
  import { HttpClient, HttpErrorResponse } from '@angular/common/http';
  import { Observable, throwError } from 'rxjs';
  import { catchError } from 'rxjs/operators';
  import { environment } from '../../../environments/environment';
  import { Brand, CreateBrandDTO } from '../models/vehicle.model';

  @Injectable({ providedIn: 'root' })
  export class BrandService {

    private apiUrl = `${environment.apiUrl}/brands`;

    constructor(private http: HttpClient) {}

    getBrands(): Observable<Brand[]> {
      console.log('BrandService: Making API call to:', this.apiUrl);
      return this.http.get<Brand[]>(this.apiUrl)
        .pipe(
          catchError(this.handleError)
        );
    }

    addBrand(brand: CreateBrandDTO): Observable<any> {
      return this.http.post(this.apiUrl, brand, {
        headers: { 'Content-Type': 'application/json' }
      })
        .pipe(
          catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
      console.error('BrandService Error:', error);
      let errorMessage = 'An error occurred';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message;
      } else {
        // Server-side error
        errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      
      return throwError(() => errorMessage);
    }
  }