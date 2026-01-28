import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { Model, CreateModelDTO } from "../models/vehicle.model";
@Injectable({ providedIn: "root" })
export class ModelService {
  private apiUrl = `${environment.apiUrl}/models`;
  constructor(private http: HttpClient) { }
  getModels(): Observable<Model[]> {
    return this.http
      .get<Model[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }
  getModelsByBrand(brandId: string): Observable<Model[]> {
    return this.http
      .get<Model[]>(`${this.apiUrl}/by-brand/${brandId}`)
      .pipe(catchError(this.handleError));
  }
  getModelById(id: string): Observable<Model> {
    return this.http
      .get<Model>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  addModel(model: CreateModelDTO): Observable<any> {
    return this.http
      .post(this.apiUrl, model, {
        headers: { "Content-Type": "application/json" },
      })
      .pipe(catchError(this.handleError));
  }

  updateModel(id: string, model: CreateModelDTO): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/${id}`, model, {
        headers: { "Content-Type": "application/json" },
      })
      .pipe(catchError(this.handleError));
  }

  deleteModel(id: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    console.error("ModelService Error:", error);
    let errorMessage = "An error occurred";
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage =
        error.error?.message ||
        `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }
}
