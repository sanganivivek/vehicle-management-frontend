export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  onRoad: number;
  inMaintenance: number;
}

export interface RecentActivity {
  id: number;
  message: string;
  time: string; // e.g., "2 hours ago"
  type: 'info' | 'warning' | 'success'; // for color coding
}