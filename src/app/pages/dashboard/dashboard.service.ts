import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardStats, RecentActivity } from './dashboard.model';
import { VehicleListDTO } from 'src/app/vehicle/models/vehicle.model';
import { OnInit } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class DashboardService implements OnInit {
  vehicles: VehicleListDTO[] = [];
  totalrecords = 0;


  constructor() { }

  // SIMULATING API CALL TO ASP.NET BACKEND
  getStats(): Observable<DashboardStats> {
    const mockStats: DashboardStats = {
      
      totalVehicles: Number(this.totalrecords),
      availableVehicles: 45,
      onRoad: 68,
      inMaintenance: 7
    };
    return of(mockStats);
  }

  getRecentActivity(): Observable<RecentActivity[]> {
    const mockActivities: RecentActivity[] = [
      { id: 1, message: 'New Toyota Fortuner added', time: '10 mins ago', type: 'success' },
      { id: 2, message: 'Vehicle MH-12-AB-1234 sent for maintenance', time: '2 hours ago', type: 'warning' },
      { id: 3, message: 'Booking #502 completed', time: '5 hours ago', type: 'info' }
    ];
    return of(mockActivities);
  }
}