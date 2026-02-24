import { Component, OnInit } from "@angular/core";
import { CustomerService } from "../../../services/customer.service";
import { Customer } from "../../../models/customer.model";
import { LoadingService } from "src/app/shared/services/loading.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-list-customer",
  templateUrl: "./list-customer.component.html",
  styleUrl: "./list-customer.component.css",
})
export class ListCustomerComponent implements OnInit {
  allCustomers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  loading = false;

  // Pagination & Search
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 1;
  searchTerm = '';
  pagesArray: (number | string)[] = [];

  constructor(
    private customerService: CustomerService,
    private toastr: ToastrService,
    private loadingService: LoadingService,
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loadingService.show();
    this.customerService.getAllCustomers().subscribe({
      next: (data: Customer[]) => {
        this.allCustomers = data;
        this.applyFilter();
        this.loadingService.hide();
      },
      error: (err: any) => {
        console.error("Error fetching customers", err);
        this.loadingService.hide();
        this.toastr.error("Failed to load customers", "Error");
      },
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilter();
  }

  applyFilter(): void {
    let tempCustomers = this.allCustomers;

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      tempCustomers = tempCustomers.filter(customer =>
        (customer.name && customer.name.toLowerCase().includes(term)) ||
        (customer.city && customer.city.toLowerCase().includes(term)) ||
        (customer.email && customer.email.toLowerCase().includes(term))
      );
    }

    this.totalRecords = tempCustomers.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize) || 1;
    this.generatePagesArray();

    // Pagination logic
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);

    this.filteredCustomers = tempCustomers.slice(startIndex, endIndex);
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
      this.applyFilter();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilter();
    }
  }

  goToPage(page: number | string): void {
    // Ignore clicks on '...'
    if (page === '...' || typeof page !== 'number') {
      return;
    }

    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadCustomers();
    }
  }

  getDisplayRange(): string {
    if (this.totalRecords === 0) return 'No customers found';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalRecords);
    return `Showing ${start}-${end} of ${this.totalRecords} customers`;
  }

  deleteCustomer(id: string): void {
    if (confirm("Are you sure you want to delete this customer?")) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.toastr.warning("Customer deleted successfully!", "Delete");
          this.loadCustomers(); // Refresh list after delete
        },
        error: (err: any) => {
          console.error("Error deleting customer", err);
          this.toastr.error(
            "Error deleting customer: " + (err.error?.message || err.message),
          );
        },
      });
    }
  }
}
