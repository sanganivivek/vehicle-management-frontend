import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { Dealer } from "../models/dealer.model"; // Ensure this model exists

@Injectable({ providedIn: "root" })
export class DealerService {
  private apiUrl = `${environment.apiUrl}/dealers`;

  constructor(private http: HttpClient) { }

  // Get All Dealers with Pagination
  getDealers(search?: string, page: number = 1, pageSize: number = 10): Observable<any> {
    let params: any = {
      page: page.toString(),
      pageSize: pageSize.toString()
    };
    if (search) {
      params.search = search;
    }
    return this.http.get<any>(this.apiUrl, { params }).pipe(catchError(this.handleError));
  }

  // Delete Dealer
  deleteDealer(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error("DealerService Error:", error);
    return throwError(() => error.error?.message || "Server error");
  }
}