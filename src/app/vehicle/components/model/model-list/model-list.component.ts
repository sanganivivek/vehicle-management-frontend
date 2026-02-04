import { Component, OnInit, Input } from "@angular/core";
import { ModelService } from "../../../services/model.service";
import { BrandService } from "../../../services/brand.service";
import { Model, Brand } from "../../../models/vehicle.model";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-model-list",
  templateUrl: "./model-list.component.html",
  styleUrls: ["./model-list.component.css"],
})
export class ModelListComponent implements OnInit {
  models: Model[] = [];
  brands: Brand[] = [];
  loading = false;

  // Pagination & Search
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 1;
  searchTerm = '';
  pagesArray: number[] = [];

  @Input() showHeader: boolean = true;

  constructor(
    private modelService: ModelService,
    private brandService: BrandService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Only load brands initially, models will be loaded via loadModels with pagination
    this.brandService.getBrands().subscribe((brands) => {
      this.brands = brands;
      this.loadModels();
    });
  }

  loadData() {
    this.loadModels();
  }

  loadModels() {
    this.loading = true;
    this.modelService.getModels(this.searchTerm, this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        // Backend returns response object with data, totalCount, etc.
        this.models = response.data || [];
        this.totalRecords = response.totalCount || 0;
        this.totalPages = response.totalPages || 1;
        this.generatePagesArray();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.toastr.error("Failed to load models");
      },
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadModels();
  }

  generatePagesArray(): void {
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadModels();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadModels();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadModels();
    }
  }

  getDisplayRange(): string {
    if (this.totalRecords === 0) return 'No models found';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalRecords);
    return `Showing ${start}-${end} of ${this.totalRecords} models`;
  }

  getBrandName(brandId: string): string {
    const brand = this.brands.find((b) => b.brandId === brandId);
    return brand ? brand.brandName : "Unknown";
  }

  deleteModel(id: string) {
    if (confirm("Are you sure you want to delete this model?")) {
      this.modelService.deleteModel(id).subscribe({
        next: () => {
          this.toastr.warning("Model Deleted Successfully");
          this.loadModels();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error("Failed to delete model");
        }
      });
    }
  }
}

