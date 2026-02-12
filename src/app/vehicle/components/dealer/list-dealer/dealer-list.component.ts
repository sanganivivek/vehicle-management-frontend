import { Component, OnInit } from '@angular/core';
import { DealerService } from '../../../services/dealer.service';
import { Dealer } from '../../../models/dealer.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dealer-list',
  templateUrl: './dealer-list.component.html',
  styleUrls: ['./dealer-list.component.css']
})
export class DealerListComponent implements OnInit {
  allDealers: Dealer[] = [];
  filteredDealers: Dealer[] = [];
  loading = false;

  // Pagination & Search
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 1;
  searchTerm = '';
  pagesArray: number[] = [];

  constructor(
    private dealerService: DealerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadDealers();
  }

  loadDealers(): void {
    this.loading = true;
    this.dealerService.getAllDealers().subscribe({
      next: (data) => {
        this.allDealers = data;
        this.applyFilter(); // Apply search and pagination
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching dealers', err);
        this.loading = false;
        this.toastr.error('Failed to load dealers', "Error");
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilter();
  }

  applyFilter(): void {
    let tempDealers = this.allDealers;

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      tempDealers = tempDealers.filter(dealer =>
        (dealer.name && dealer.name.toLowerCase().includes(term)) ||
        (dealer.city && dealer.city.toLowerCase().includes(term)) ||
        (dealer.contactPerson && dealer.contactPerson.toLowerCase().includes(term))
      );
    }

    this.totalRecords = tempDealers.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize) || 1;
    this.generatePagesArray();

    // Pagination logic
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);

    this.filteredDealers = tempDealers.slice(startIndex, endIndex);
  }

  generatePagesArray(): void {
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
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

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilter();
    }
  }

  getDisplayRange(): string {
    if (this.totalRecords === 0) return 'No dealers found';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalRecords);
    return `Showing ${start}-${end} of ${this.totalRecords} dealers`;
  }

  deleteDealer(id: number): void {
    if (confirm('Are you sure you want to delete this dealer?')) {
      this.dealerService.deleteDealer(id).subscribe({
        next: () => {
          this.toastr.warning('Dealer deleted successfully!', 'Delete');
          this.loadDealers(); // Refresh list after delete
        },
        error: (err) => {
          console.error('Error deleting dealer', err);
          this.toastr.error('Error deleting dealer: ' + (err.error?.message || err.message));
        }
      });
    }
  }
}