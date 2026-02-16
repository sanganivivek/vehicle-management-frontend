import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../../../shared/services/loading.service';
import { BookingService } from '../../../services/booking.service';

export interface BookingListDTO {
  bookingId: string;
  customerName: string;
  vehicleRegNo: string;
  vehicleName: string;
  amount: number;          // New Field
  paymentMethod: string;   // New Field
  paymentStatus: string;   // New Field
  createdAt: string | Date; // Renamed from bookingDate for clarity
  startDate: string | Date;
  endDate: string | Date;
  status: number; // 0: Pending, 1: Confirmed/Active, 2: Completed/Cancelled
}

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit {
  bookings: BookingListDTO[] = [];
  searchTerm: string = '';
  selectedStatus: any = '';

  // Pagination & Sorting
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 1;
  pagesArray: number[] = [];
  sortColumn = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  statusOptions = [
    { name: 'Pending', value: 0 },
    { name: 'Confirmed', value: 1 },
    { name: 'Completed', value: 2 },
    { name: 'Cancelled', value: 3 }
  ];

  allBookings: BookingListDTO[] = []; // Store all data for client-side filtering

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private toastr: ToastrService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loadingService.show();
    this.bookingService.getAllBookings().subscribe({
      next: (data: any[]) => {
        // Map API response to DTO if needed, or if keys match, just assign
        this.allBookings = data.map(b => ({
          bookingId: b.bookingId,
          customerName: b.customerName,
          vehicleRegNo: b.vehicleRegNo,
          vehicleName: b.vehicleName,
          amount: b.amount,
          paymentMethod: b.paymentMethod,
          paymentStatus: b.paymentStatus,
          createdAt: b.createdAt,
          startDate: b.startDate,
          endDate: b.endDate,
          status: b.status
        }));
        this.applyFilters();
        this.loadingService.hide();
      },
      error: (err) => {
        this.toastr.error('Failed to load bookings');
        this.loadingService.hide();
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.allBookings];

    // 1. Search
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.customerName.toLowerCase().includes(term) ||
        b.vehicleRegNo.toLowerCase().includes(term) ||
        b.vehicleName.toLowerCase().includes(term) ||
        b.bookingId.toLowerCase().includes(term)
      );
    }

    // 2. Status Filter
    if (this.selectedStatus !== '' && this.selectedStatus !== null && this.selectedStatus !== undefined) {
      const statusVal = parseInt(this.selectedStatus.toString()); // ensure number
      filtered = filtered.filter(b => b.status === statusVal);
    }

    // 3. Sorting
    filtered.sort((a, b) => {
      const valA = (a as any)[this.sortColumn];
      const valB = (b as any)[this.sortColumn];

      // Handle dates
      if (this.sortColumn.includes('Date') || this.sortColumn === 'createdAt') {
        const dateA = new Date(valA).getTime();
        const dateB = new Date(valB).getTime();
        return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }

      if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    this.totalRecords = filtered.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    if (this.totalPages === 0) this.totalPages = 1;
    this.generatePagesArray();

    // 4. Pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.bookings = filtered.slice(startIndex, startIndex + this.pageSize);
  }

  addBooking(): void {
    this.router.navigate(['/booking/add']);
  }

  editBooking(id: string): void {
    this.router.navigate(['/booking/edit', id]);
  }

  deleteBooking(id: string): void {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.loadingService.show();
      this.bookingService.deleteBooking(id).subscribe({
        next: () => {
          this.toastr.success('Booking deleted successfully');
          this.loadBookings();
        },
        error: (err) => {
          this.toastr.error('Failed to delete booking');
          this.loadingService.hide();
        }
      });
    }
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onStatusFilter(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.applyFilters();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'bi bi-arrow-down-up text-muted opacity-50';
    return this.sortOrder === 'asc' ? 'bi bi-arrow-up-short' : 'bi bi-arrow-down-short';
  }

  // --- Pagination ---

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  generatePagesArray(): void {
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // --- Helpers ---

  getMathMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  getStatusName(status: number): string {
    const found = this.statusOptions.find(s => s.value === status);
    return found ? found.name : 'Unknown';
  }
}