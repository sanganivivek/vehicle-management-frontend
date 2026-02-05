import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Dealer } from '../models/dealer.model';

@Injectable({
  providedIn: 'root'
})
export class DealerService {
  private apiUrl = `${environment.apiUrl}/dealers`;

  constructor(private http: HttpClient) {}

  // Get all dealers
  getDealers(search: string = '', page: number = 1, pageSize: number = 10): Observable<any> {
    const params: any = { search, page, pageSize };
    return this.http.get<any>(this.apiUrl, { params });
  }

  // Add a new dealer
  addDealer(dealer: Dealer): Observable<Dealer> {
    return this.http.post<Dealer>(this.apiUrl, dealer);
  }

  // Update a dealer
  updateDealer(id: string, dealer: Dealer): Observable<Dealer> {
    return this.http.put<Dealer>(`${this.apiUrl}/${id}`, dealer);
  }

  // Delete a dealer
  deleteDealer(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Get single dealer by ID
  getDealerById(id: string): Observable<Dealer> {
    return this.http.get<Dealer>(`${this.apiUrl}/${id}`);
  }
}