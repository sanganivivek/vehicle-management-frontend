import { Component, OnInit, Input } from "@angular/core";
import { ModelService } from "../../../services/model.service";
import { BrandService } from "../../../services/brand.service";
import { Model, Brand, CreateModelDTO } from "../../../models/vehicle.model";
import { LoadingService } from "src/app/shared/services/loading.service";
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
  pagesArray: (number | string)[] = [];

  @Input() showHeader: boolean = true;

  constructor(
    private modelService: ModelService,
    private brandService: BrandService,
    private toastr: ToastrService,
    private loadingService: LoadingService,
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

    // 1. Parse Headers and find indices
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const brandIndex = headers.indexOf('brandname');
    const codeIndex = headers.indexOf('modelcode');
    const nameIndex = headers.indexOf('modelname');
    const descIndex = headers.indexOf('description');

    // Validate required columns
    if (brandIndex === -1 || nameIndex === -1) {
      alert("CSV is missing required columns: BrandName or ModelName");
      return;
    }

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(',');
      if (currentLine.length < 2) continue;

      // 2. Use indices to get data
      const brandName = currentLine[brandIndex]?.trim();
      const modelCode = codeIndex > -1 ? currentLine[codeIndex]?.trim() : '';
      const modelName = currentLine[nameIndex]?.trim();
      const description = descIndex > -1 ? currentLine[descIndex]?.trim() : '';

      // 3. Find Brand
      const matchedBrand = this.brands.find(b =>
        b.brandName.toLowerCase() === brandName?.toLowerCase()
      );

      if (matchedBrand) {
        result.push({
          brandId: matchedBrand.brandId,
          modelCode: modelCode,
          name: modelName,
          description: description
        });
      }
    }

    if (result.length > 0) {
      this.uploadBulkData(result);
    } else {
      alert("No valid models found. Check Brand Names.");
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
    this.loadingService.show();

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
        this.loadingService.hide();
      },
      error: (err) => {
        console.error(err);
        this.loadingService.hide();
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
    const total = this.totalPages;
    const current = this.currentPage;
    const windowSize = 2; // total middle pages including current

    if (total <= windowSize + 2) {
      this.pagesArray = Array.from({ length: total }, (_, i) => i + 1);
      return;
    }

    const pages: (number | string)[] = [];

    const half = Math.floor(windowSize / 2);

    let start = current - half;
    let end = current + half;

    // Adjust when near beginning
    if (start <= 2) {
      start = 2;
      end = start + windowSize - 1;
    }

    // Adjust when near end
    if (end >= total - 1) {
      end = total - 1;
      start = end - windowSize + 1;
    }

    pages.push(1);

    if (start > 2) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < total - 1) {
      pages.push('...');
    }

    pages.push(total);

    this.pagesArray = pages;
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

  goToPage(page: number | string): void {
    // Ignore clicks on '...'
    if (page === '...' || typeof page !== 'number') {
      return;
    }

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

