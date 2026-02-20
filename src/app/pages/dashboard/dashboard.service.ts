import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DashboardStats, RecentActivity } from "./dashboard.model";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class DashboardService {
  // 1. Unified Base URL (Check your port: usually it's either 5001 or 7245, not both)
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`);
  }

  // 2. MOVED: This method is now properly inside DashboardService
  getRecentActivity(): Observable<RecentActivity[]> {
    // This calls: https://localhost:5001/api/dashboard/activity
    return this.http.get<RecentActivity[]>(`${this.apiUrl}/dashboard/activity`);
  }
}