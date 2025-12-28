import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../../vehicle.service';
import { BrandService } from '../../services/brand.service';
import { VehicleListDTO, Brand, VehicleQueryParams } from '../../models/vehicle.model';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
  vehicles: VehicleListDTO[] = [];
  brands: Brand[] = [];
  loading = false;
  searchTerm = '';
  selectedBrand = '';
  sortColumn = 'vehicleName';
  sortOrder: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalRecords = 0;
  pagesArray: number[] = [];

  constructor(
    private vehicleService: VehicleService,
    private brandService: BrandService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
    this.loadBrands();
  }

  loadVehicles(): void {
    this.loading = true;
    
    const queryParams: VehicleQueryParams = {
      brand: this.selectedBrand || undefined,
      search: this.searchTerm || undefined,
      sortBy: this.sortColumn,
      sortOrder: this.sortOrder,
      page: this.currentPage,
      pageSize: this.pageSize
    };
    
    this.vehicleService.getVehicles(queryParams).subscribe({
      next: (response: any) => {
        console.log('Vehicles loaded successfully:', response);
        this.vehicles = response.result;
        this.totalRecords = response.result.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.generatePagesArray();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Failed to load vehicles:', error);
        this.loading = false;
      }
    });
  }

  loadBrands(): void {
    this.brandService.getBrands().subscribe({
      next: (brands: Brand[]) => {
        this.brands = brands;
      },
      error: () => {
        this.brands = [];
      }
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

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.loadVehicles();
  }

  /* ----------------------- PAGINATION METHODS ----------------------- */

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

  /* ------------------------------------------------------------------ */

  addVehicle(): void {
    this.router.navigate(['/vehicle/add']);
  }

  editVehicle(regNo: string): void {
    this.router.navigate(['/vehicle/edit', regNo]);
  }

  deleteVehicle(regNo: string): void {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      // Use regNo directly as string ID
      this.vehicleService.deleteVehicle(regNo).subscribe({
        next: () => this.loadVehicles(),
        error: () => this.loadVehicles()
      });
    }
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '';
    return this.sortOrder === 'asc' ? '▲' : '▼';
  }

  getDisplayRange(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalRecords);
    return `Showing ${start}-${end} of ${this.totalRecords} vehicles`;
  }
}
