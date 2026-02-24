import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { VehicleService, DashboardData } from "src/app/vehicle/services/vehicle.service";
import { DashboardService } from "./dashboard.service";
import { RecentActivity } from "./dashboard.model";
import { LoadingService } from "src/app/shared/services/loading.service";

// New Imports
import { BookingService } from "src/app/vehicle/services/booking.service";
import { CustomerService } from "src/app/vehicle/services/customer.service";
import { ListCustomerComponent } from "src/app/vehicle/components/customer/list-customer/list-customer.component";
import { DealerListComponent } from "src/app/vehicle/components/dealer/list-dealer/dealer-list.component";
import { DealerService } from "src/app/vehicle/services/dealer.service";
import { Booking } from "src/app/vehicle/models/booking.model";
import { CdkAutofill } from "@angular/cdk/text-field";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  stats: DashboardData | null = null;
  activities: RecentActivity[] = [];
  complianceAlerts: any[] = [];
  currentDate = new Date();

  // New Properties
  upcomingBookings: Booking[] = [];
  activeCustomersCount: number = 0;
  activeDealersCount: number = 0;

  constructor(
    private dashboardService: DashboardService,
    private vehicleService: VehicleService,
    private loadingService: LoadingService,
    private router: Router,
    private customerService: CustomerService,
    private dealerService: DealerService,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    this.loadDashboard();
    this.loadActivity();
    this.loadComplianceAlerts();
    this.loadStatsCounts();
    this.loadUpcomingBookings();
  }

  filterVehicles(status: string) {
    this.router.navigate(['/vehicle'], {
      queryParams: { status: status }
    });
  }

  navigateToDealer(id: string) {
    this.router.navigate(['/dealer', id]);
  }

  navigateToCustomer(id: string) {
    this.router.navigate(['/customer', id]);
  }


  navigateToEdit(id: string) {
    this.router.navigate(['/vehicle/edit', id]);
  }

  loadDashboard() {
    this.loadingService.show();
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loadingService.hide();
      },
      error: (err) => {
        console.error("Error loading dashboard stats", err);
        this.loadingService.hide();
      },
    });
  }

  loadStatsCounts() {
    // Active Customers
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.activeCustomersCount = customers.filter(c => c.status === 'Active').length;
      },
      error: (err) => console.error("Error loading customers", err)
    });

    // Active Dealers
    this.dealerService.getAllDealers().subscribe({
      next: (dealers) => {
        this.activeDealersCount = dealers.filter(d => d.status === 'Active').length;
      },
      error: (err) => console.error("Error loading dealers", err)
    });
  }

  loadActivity() {
    this.dashboardService.getRecentActivity().subscribe({
      next: (data) => {
        this.activities = data;
      },
      error: (err) => console.error("Error loading activity", err),
    });
  }

  loadComplianceAlerts() {
    this.vehicleService.getVehicles({ page: 1, pageSize: 1000 }).subscribe({
      next: (res) => {
        const vehicles = res.data;
        this.complianceAlerts = [];
        const today = new Date();
        const warningDate = new Date();
        warningDate.setDate(today.getDate() + 30);

        vehicles.forEach((v: any) => {
          this.checkExpiry(v, v.insurancePolicyExpiryDate, 'Insurance Expired', 'Insurance Expiring Soon');
          this.checkExpiry(v, v.rcExpiryDate, 'RC Expired', 'RC Expiring Soon');
          this.checkExpiry(v, v.fitnessCertificateExpiryDate, 'Fitness Cert Expired', 'Fitness Cert Expiring Soon');
        });

        this.complianceAlerts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        this.complianceAlerts = this.complianceAlerts.slice(0, 4);
      },
      error: (err) => console.error("Error loading compliance alerts", err)
    });
  }

  loadUpcomingBookings() {
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        const today = new Date();
        // Filter for future dates and ignore cancelled (status 3)
        this.upcomingBookings = bookings
          .filter(b => new Date(b.startDate) >= today && b.status !== 3)
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) // Sort nearest first
          .slice(0, 5); // Take top 5
      },
      error: (err) => console.error("Error loading bookings", err)
    });
  }

  checkExpiry(vehicle: any, dateStr: string | Date | undefined, expiredMsg: string, warningMsg: string) {
    if (!dateStr) return;
    const date = new Date(dateStr);
    const today = new Date();
    const warningDate = new Date();
    warningDate.setDate(today.getDate() + 30);

    if (date < today) {
      this.complianceAlerts.push({
        vehicleId: vehicle.vehicleId,
        regNo: vehicle.regNo,
        message: expiredMsg,
        date: dateStr,
        type: 'danger'
      });
    } else if (date < warningDate) {
      this.complianceAlerts.push({
        vehicleId: vehicle.vehicleId,
        regNo: vehicle.regNo,
        message: warningMsg,
        date: dateStr,
        type: 'warning'
      });
    }
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Confirmed';
      case 2: return 'Completed';
      case 3: return 'Cancelled';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 0: return 'status-pending';
      case 1: return 'status-confirmed';
      case 2: return 'status-completed';
      case 3: return 'status-cancelled';
      default: return 'status-unknown';
    }
  }
}