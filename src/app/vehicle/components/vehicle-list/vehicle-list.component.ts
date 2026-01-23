import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { VehicleService } from "../../vehicle.service";
import { BrandService } from "../../services/brand.service";
import { ToastrService } from "ngx-toastr";
import {
  VehicleListDTO,
  Brand,
  VehicleQueryParams,
} from "../../models/vehicle.model";
import { LoadingService } from "../../../shared/services/loading.service";
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
  brands: Brand[] = [];
  searchTerm = "";
  selectedBrand = "";
  sortColumn = "regNo";
  sortOrder: "asc" | "desc" = "asc";
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalRecords = 0;
  pagesArray: number[] = [];
  selectedStatus: any = "";

  statusOptions = [
    { name: "Available", value: 0 },
    { name: "Rented", value: 1 },
    { name: "In Maintenance", value: 2 },
  ];
  constructor(
    private vehicleService: VehicleService,
    private brandService: BrandService,
    private router: Router,
    private toastr: ToastrService,
    private loadingService: LoadingService,
  ) { }
  ngOnInit(): void {
    this.loadVehicles();
    this.loadBrands();
  }
  loadVehicles(): void {
    
    const queryParams: any = {
      brand: this.selectedBrand || undefined,
      search: this.searchTerm || undefined,
      status:
        this.selectedStatus !== "" ? parseInt(this.selectedStatus) : undefined,
      sortBy: this.sortColumn,
      sortOrder: this.sortOrder,
      page: this.currentPage,
      pageSize: this.pageSize,
    };
    this.vehicleService.getVehicles(queryParams).subscribe({
      next: (response: any) => {
        console.log("Vehicles loaded successfully:", response);
        this.vehicles = response.data || [];
        this.totalRecords = response.totalRecords || 0;
        this.totalPages = response.totalPages || 1;
        this.generatePagesArray();
        
      },
      error: (error: any) => {
        console.error("Failed to load vehicles:", error);
        this.vehicles = [];
        this.totalRecords = 0;
        this.totalPages = 1;
        
      },
    });
  }
  loadBrands(): void {
    this.brandService.getBrands().subscribe({
      next: (brands: Brand[]) => {
        this.brands = brands;
      },
      error: (error) => {
        console.error("Failed to load brands:", error);
        this.brands = [];
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
      this.vehicleService.deleteVehicle(vehicleId).subscribe({
        next: () => {
          this.toastr.warning("Vehicle deleted", "Deleted"); // 3. Warning Toast
          this.loadVehicles();
        },
        error: () => this.toastr.error("Failed to delete vehicle", "Error"), // 4. Error Toast
      });
    }
  }
  toggleActiveStatus(vehicleId: string, currentStatus: boolean): void {
    this.vehicleService.getVehicleById(vehicleId).subscribe({
      next: (vehicle: any) => {
        const updateData = { ...vehicle, isActive: !currentStatus };
        this.vehicleService.updateVehicle(vehicleId, updateData).subscribe({
          next: () => this.loadVehicles(),
          error: () => alert("Failed to update status"),
        });
      },
      error: () => alert("Failed to get vehicle details"),
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
      case STATUS_AVAILABLE:
        return "Available";
      case STATUS_ON_ROAD:
        return "Rented";
      case STATUS_MAINTENANCE:
        return "In Maintenance";
      default:
        return "Unknown";
    }
  }
  getStatusClass(status: number): string {
    switch (status) {
      case STATUS_AVAILABLE:
        return "badge bg-success";
      case STATUS_ON_ROAD:
        return "badge bg-info text-white";
      case STATUS_MAINTENANCE:
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  }
  changeStatus(vehicle: any, newStatus: number): void {
    this.vehicleService.getVehicleById(vehicle.vehicleId).subscribe({
      next: (fullVehicle: any) => {
        const updateData = { ...fullVehicle, currentStatus: newStatus };
        this.vehicleService
          .updateVehicle(vehicle.vehicleId, updateData)
          .subscribe({
            next: () => {
              this.toastr.info(
                "Status updated to " + this.getStatusText(newStatus),
              ); // 4. Info Toast
              this.loadVehicles();
            },
            error: () => this.toastr.error("Failed to update status"),
          });
      },
      error: () => this.toastr.error("Failed to fetch details"),
    });
  }
}
