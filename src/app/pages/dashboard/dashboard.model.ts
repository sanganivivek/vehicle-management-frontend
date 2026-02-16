export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  rented: number;
  inmaintance: number;
}

export interface RecentActivity {
  id: number | string;
  message: string;
  time: string;
  type: "info" | "warning" | "success";
}
