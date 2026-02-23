import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dealer, CreateDealerDTO, UpdateDealerDTO } from '../models/dealer.model';
import { environment } from '../../../environments/environment';
import { SKIP_LOADING } from '../../shared/interceptors/loading.interceptor';

@Injectable({
  providedIn: 'root'
})
export class DealerService {
  private apiUrl = `${environment.apiUrl}/Dealer`;

  constructor(private http: HttpClient) { }

  getAllDealers(skipLoading = false): Observable<Dealer[]> {
    const context = skipLoading ? new HttpContext().set(SKIP_LOADING, true) : undefined;
    return this.http.get<Dealer[]>(this.apiUrl, { context });
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