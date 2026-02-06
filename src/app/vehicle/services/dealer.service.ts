import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateDealerDTO, Dealer, UpdateDealerDTO } from '../models/dealer.model';

@Injectable({
  providedIn: 'root'
})
export class DealerService {
  // Adjust endpoint if your backend uses a different prefix (e.g., /api/Dealer)
  private apiUrl = `${environment.apiUrl}/Dealer`;

  constructor(private http: HttpClient) {}

  getDealers(): Observable<Dealer[]> {
    return this.http.get<Dealer[]>(this.apiUrl);
  }

  getDealerById(id: number): Observable<Dealer> {
    return this.http.get<Dealer>(`${this.apiUrl}/${id}`);
  }

  createDealer(dealer: CreateDealerDTO): Observable<Dealer> {
    return this.http.post<Dealer>(this.apiUrl, dealer);
  }

  updateDealer(id: number, dealer: UpdateDealerDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dealer);
  }

  deleteDealer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}