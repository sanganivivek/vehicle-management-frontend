import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { VehicleService } from "../../../vehicle.service";
import { ToastrService } from "ngx-toastr";
import {
  VehicleListDTO,
  Brand,
} from "../../../models/vehicle.model";
import { LoadingService } from "../../../../shared/services/loading.service";

const STATUS_AVAILABLE = 0;
const STATUS_ON_ROAD = 1;
const STATUS_MAINTENANCE = 2;

@Component({
  selector: "app-vehicle-list",
  templateUrl: "./vehicle-list.component.html",
  styleUrls: ["./vehicle-list.component.css"],
})
export class VehicleListComponent implements OnInit {
  vehicles: VehicleListDTO[] = [];
  brandId: Brand[] = [];
  searchTerm = "";
  selectedBrand = "";
  sortColumn = "regNo";
  sortOrder: "asc" | "desc" = "asc";
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalRecords = 0;
  pagesArray: number[] = [];
  
  // This variable holds the current status filter (can be string from URL or number from dropdown)
  selectedStatus: any = ""; 

  statusOptions = [
    { name: "Available", value: 0 },
    { name: "Rented", value: 1 },
    { name: "In Maintenance", value: 2 },
  ];

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
    private route: ActivatedRoute, // Added ActivatedRoute
    private toastr: ToastrService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    // We load brands once
    this.loadBrands();

    // LISTEN for query params from Dashboard or URL changes
    this.route.queryParams.subscribe((params) => {
      const statusParam = params['status'];
      
      if (statusParam) {
        // If coming from dashboard (e.g., ?status=available)
        // We need to map 'available' string to the numeric value your API expects
        this.selectedStatus = this.mapStatusStringToNumber(statusParam);
      } else {
        // If no param, we might want to keep existing or reset. 
        // Usually, if we navigate here freshly, we might want to show all.
        // If you want to persist manual filters, check if selectedStatus is already set.
        // For now, let's assume if no param, we show 'All' (empty string).
        if (!this.selectedStatus && this.selectedStatus !== 0) {
             this.selectedStatus = "";
        }
      }

      // Load vehicles whenever params change or component initializes
      this.loadVehicles();
    });
  }

  /**
   * Helper to convert URL strings (from Dashboard) to API numbers
   */
  mapStatusStringToNumber(status: string): number | string {
    switch (status.toLowerCase()) {
      case 'available': return 0;
      case 'rented': return 1;
      case 'maintenance': return 2;
      case 'all': return ""; // "All" means no filter
      default: return "";
    }
  }

  loadVehicles(): void {
    this.loadingService.show();

    const queryParams: any = {
      brand: this.selectedBrand || undefined,
      search: this.searchTerm || undefined,
      // Status logic: check if it's a number (0 is falsy, so check for null/undefined explicitly if needed)
      // or if it's a non-empty string.
      status: (this.selectedStatus !== "" && this.selectedStatus !== null) 
              ? parseInt(this.selectedStatus) 
              : undefined,
      sortBy: this.sortColumn,
      sortOrder: this.sortOrder,
      page: this.currentPage,
      pageSize: this.pageSize,
    };

    this.vehicleService.getVehicles(queryParams).subscribe({
      next: (response: any) => {
        // console.log("Vehicles loaded successfully:", response);
        this.vehicles = response.data || [];
        this.totalRecords = response.totalRecords || 0;
        this.totalPages = response.totalPages || 1;
        this.generatePagesArray();
        this.loadingService.hide();
      },
      error: (error: any) => {
        console.error("Failed to load vehicles:", error);
        this.vehicles = [];
        this.totalRecords = 0;
        this.totalPages = 1;
        this.loadingService.hide();
      },
    });
  }

  loadBrands(): void {
    this.vehicleService.getBrands().subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.brandId = response;
        } else if (response && Array.isArray(response.data)) {
          this.brandId = response.data;
        } else {
          this.brandId = [];
        }
      },
      error: (error) => {
        console.error("Failed to load brands:", error);
        this.brandId = [];
      },
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadVehicles();
  }

  onBrandFilter(): void {
    this.currentPage = 1;
    this.loadVehicles();
  }

  onStatusFilter(): void {
    this.currentPage = 1;
    // When manually changing the dropdown, selectedStatus is updated via ngModel.
    // Just reload the list.
    this.loadVehicles();
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    } else {
      this.sortColumn = column;
      this.sortOrder = "asc";
    }
    this.loadVehicles();
  }

  generatePagesArray(): void {
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadVehicles();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadVehicles();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadVehicles();
    }
  }

  addVehicle(): void {
    this.router.navigate(["/vehicle/add"]);
  }

  editVehicle(vehicleId: string): void {
    this.router.navigate(["/vehicle/edit", vehicleId]);
  }

  deleteVehicle(vehicleId: string): void {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      this.loadingService.show();
      this.vehicleService.deleteVehicle(vehicleId).subscribe({
        next: () => {
          this.toastr.warning("Vehicle deleted", "Deleted");
          this.loadVehicles();
          this.loadingService.hide();
        },
        error: () => {
          this.toastr.error("Failed to delete vehicle", "Error");
          this.loadingService.hide();
        },
      });
    }
  }

  toggleActiveStatus(vehicleId: string, currentStatus: boolean): void {
    this.loadingService.show();
    this.vehicleService.getVehicleById(vehicleId).subscribe({
      next: (vehicle: any) => {
        const updateData = { ...vehicle, isActive: !currentStatus };
        this.vehicleService.updateVehicle(vehicleId, updateData).subscribe({
          next: () => {
             this.loadVehicles();
             this.loadingService.hide();
          },
          error: () => {
             alert("Failed to update status");
             this.loadingService.hide();
          },
        });
      },
      error: () => {
         alert("Failed to get vehicle details");
         this.loadingService.hide();
      },
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return "";
    return this.sortOrder === "asc" ? "▲" : "▼";
  }

  getDisplayRange(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalRecords);
    return `Showing ${start}-${end} of ${this.totalRecords} vehicles`;
  }

  getStatusText(status: number): string {
    switch (status) {
      case STATUS_AVAILABLE: return "Available";
      case STATUS_ON_ROAD: return "Rented";
      case STATUS_MAINTENANCE: return "In Maintenance";
      default: return "Unknown";
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case STATUS_AVAILABLE: return "badge bg-success";
      case STATUS_ON_ROAD: return "badge bg-info text-white";
      case STATUS_MAINTENANCE: return "badge bg-danger";
      default: return "badge bg-secondary";
    }
  }

  changeStatus(vehicle: any, newStatus: number): void {
    this.loadingService.show();
    this.vehicleService.getVehicleById(vehicle.vehicleId).subscribe({
      next: (fullVehicle: any) => {
        const updateData = { ...fullVehicle, currentStatus: newStatus };
        this.vehicleService
          .updateVehicle(vehicle.vehicleId, updateData)
          .subscribe({
            next: () => {
              this.toastr.info(
                "Status updated to " + this.getStatusText(newStatus),
              );
              this.loadVehicles();
              this.loadingService.hide();
            },
            error: () => {
              this.toastr.error("Failed to update status");
              this.loadingService.hide();
            },
          });
      },
      error: () => {
         this.toastr.error("Failed to fetch details");
         this.loadingService.hide();
      },
    });
  }

  getVehicleTypeName(type: string | undefined): string {
    return type || "N/A";
  }

  getFuelTypeName(type: string | undefined): string {
    return type || "N/A";
  }

  getTransmissionName(type: string | undefined): string {
    return type || "N/A";
  }
}