import { Component, OnInit, Input } from "@angular/core";
import { ModelService } from "../../../services/model.service";
import { BrandService } from "../../../services/brand.service";
import { Model, Brand, CreateModelDTO } from "../../../models/vehicle.model";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-model-list",
  templateUrl: "./model-list.component.html",
  styleUrls: ["./model-list.component.css"],
})
export class ModelListComponent implements OnInit {
  models: Model[] = [];
  brands: Brand[] = [];
  selectedBrand = '';
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
    this.brandService.getBrands().subscribe((response: any) => {
      if (response && Array.isArray(response.data)) {
        this.brands = response.data;
      } else if (Array.isArray(response)) {
        this.brands = response;
      } else {
        this.brands = [];
        console.error('Unexpected brands response format:', response);
      }
      this.loadModels();
    });
  }

  loadData() {
    this.loadModels();
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const csvData = e.target.result;
        this.processCSV(csvData);
      };
      reader.readAsText(file);
    }
    // Reset input so same file can be selected again if needed
    event.target.value = '';
  }

  processCSV(csvText: string) {
    const lines = csvText.split('\n');
    const result: CreateModelDTO[] = [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    // Expected CSV Headers: BrandName, ModelCode, ModelName, Description

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(',');
      if (currentLine.length < 2) continue; // Skip empty lines

      const brandName = currentLine[0]?.trim();
      const modelCode = currentLine[1]?.trim();
      const modelName = currentLine[2]?.trim();
      const description = currentLine[3]?.trim();

      // 1. Find BrandId by Name (Case insensitive)
      // Note: 'this.brands' must be populated (which it is in your html via *ngFor)
      const matchedBrand = this.brands.find(b =>
        b.brandName.toLowerCase() === brandName.toLowerCase()
      );

      if (matchedBrand) {
        result.push({
          brandId: matchedBrand.brandId, // Map found ID
          modelCode: modelCode,
          name: modelName, // DTO property is 'name'
          description: description
        });
      } else {
        console.warn(`Brand '${brandName}' not found. Skipping row ${i + 1}`);
        // Optional: Add logic to show a toast warning user
      }
    }

    if (result.length > 0) {
      this.uploadBulkData(result);
    } else {
      alert("No valid models found in CSV. Please check Brand Names.");
    }
  }

  uploadBulkData(data: CreateModelDTO[]) {
    this.loading = true; // Use your existing loading variable
    this.modelService.bulkAddModels(data).subscribe({
      next: (res) => {
        alert('Bulk upload successful!');
        this.loadModels(); // Refresh your list
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Failed to upload data.');
        this.loading = false;
      }
    });
  }

  loadModels() {
    this.loading = true;
    this.modelService.getModels(this.searchTerm, this.currentPage, this.pageSize, this.selectedBrand).subscribe({
      next: (response: any) => {
        console.log('Model Response:', response);
        console.log('Response Type:', typeof response);
        console.log('Is Array:', Array.isArray(response));
        if (response && response.data) {
          console.log('Response.data Is Array:', Array.isArray(response.data));
        }

        // Backend returns response object with data, totalCount, etc.
        if (response && Array.isArray(response.data)) {
          this.models = response.data;
          this.totalRecords = response.totalCount || 0;
          this.totalPages = response.totalPages || 1;
        } else if (Array.isArray(response)) {
          // Fallback if response is directly an array
          this.models = response;
          this.totalRecords = response.length;
          this.totalPages = 1;
        } else {
          console.error('Unexpected response format - models set to empty array:', response);
          this.models = [];
          this.totalRecords = 0;
        }

        this.generatePagesArray();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.toastr.error("Failed to load models", "Error");
      },
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadModels();
  }

  onBrandFilterChange(): void {
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
          this.toastr.error(err || "Failed to delete model", "Delete Failed");
        }
      });
    }
  }
}

