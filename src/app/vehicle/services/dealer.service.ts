import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dealer, CreateDealerDTO, UpdateDealerDTO } from '../models/dealer.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DealerService {
  private apiUrl = `${environment.apiUrl}/Dealer`;

  constructor(private http: HttpClient) { }

  getAllDealers(): Observable<Dealer[]> {
    return this.http.get<Dealer[]>(this.apiUrl);
  }

  getDealerById(id: number): Observable<Dealer> {
    return this.http.get<Dealer>(`${this.apiUrl}/${id}`);
  }

  createDealer(dealer: CreateDealerDTO): Observable<Dealer> {
    return this.http.post<Dealer>(this.apiUrl, dealer);
  }

  updateDealer(id: number, dealer: UpdateDealerDTO): Observable<Dealer> {
    return this.http.put<Dealer>(`${this.apiUrl}/${id}`, dealer);
  }

  deleteDealer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}