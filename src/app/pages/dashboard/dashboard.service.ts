import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardStats, RecentActivity } from './dashboard.model';
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = 'https://localhost:5001/api/dashboard';
  constructor(private http: HttpClient) {}
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }
  getRecentActivity(): Observable<RecentActivity[]> {
    return this.http.get<RecentActivity[]>(`${this.apiUrl}/activity`);
  }
}