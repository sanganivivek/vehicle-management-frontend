import { Component, OnInit, Input } from '@angular/core';
import { BrandService } from '../../../services/brand.service';
import { Brand } from '../../../models/vehicle.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent implements OnInit {
  brands: Brand[] = [];
  loading = false;

  // Pagination & Search
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 1;
  searchTerm = '';
  pagesArray: (number | string)[] = [];

  @Input() showHeader: boolean = true;

  constructor(private brandService: BrandService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands() {
    this.loading = true;
    this.brandService.getBrands(this.searchTerm, this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        // Backend returns response object with data, totalCount, etc.
        this.brands = response.data || [];
        this.totalRecords = response.totalCount || 0;
        this.totalPages = response.totalPages || 1;
        this.generatePagesArray();
        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading brands", err);
        this.brands = []; // Clear list on error
        this.toastr.error("Failed to load brands", "Error");
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadBrands();
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
      this.loadBrands();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBrands();
    }
  }

  goToPage(page: number | string): void {
    // Ignore clicks on '...'
    if (page === '...' || typeof page !== 'number') {
      return;
    }

    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadBrands();
    }
  }


  getDisplayRange(): string {
    if (this.totalRecords === 0) return 'No brands found';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalRecords);
    return `Showing ${start}-${end} of ${this.totalRecords} brands`;
  }

  deleteBrand(event: Event, id: string) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this brand?')) {
      this.brandService.deleteBrand(id).subscribe({
        next: () => {
          this.toastr.warning('Brand Deleted Successfully');
          this.loadBrands();
        },
        error: (err) => {
          this.toastr.error('Failed to delete brand');
          console.error(err);
        }
      });
    }
  }
}
