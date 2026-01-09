export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  onRoad: number;
  inMaintenance: number;
}
export interface RecentActivity {
  id: number;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success';
}