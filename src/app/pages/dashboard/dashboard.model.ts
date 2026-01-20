export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  onRoad: number;
  inMaintenance: number;
}
export interface RecentActivity {
  id: number | string;
  message: string;
  time: string;
  type: "info" | "warning" | "success";
}
