import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../../../shared/services/loading.service';
// import { BookingService } from '../../../services/booking.service'; // Ensure you have this service

// Define DTO locally or move to models/booking.model.ts
export interface BookingListDTO {
  bookingId: string;
  customerName: string;
  vehicleRegNo: string;
  vehicleName: string;
  vehicleImage?: string; // Image URL property
  bookingDate: string | Date;
  startDate: string | Date;
  endDate: string | Date;
  status: number; // 0: Pending, 1: Confirmed/Active, 2: Completed/Cancelled
}

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css'] // Note: fixed styleUrl -> styleUrls
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
  sortColumn = 'bookingDate';
  sortOrder: 'asc' | 'desc' = 'desc';

  statusOptions = [
    { name: 'Pending', value: 0 },
    { name: 'Confirmed', value: 1 },
    { name: 'Completed', value: 2 },
    { name: 'Cancelled', value: 3 }
  ];

  constructor(
    // private bookingService: BookingService, // Uncomment when service is ready
    private router: Router,
    private toastr: ToastrService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loadingService.show();

    const queryParams: any = {
      search: this.searchTerm || undefined,
      status: this.selectedStatus !== '' ? parseInt(this.selectedStatus) : undefined,
      sortBy: this.sortColumn,
      sortOrder: this.sortOrder,
      page: this.currentPage,
      pageSize: this.pageSize
    };

    // MOCK DATA for display (Replace with this.bookingService.getBookings(queryParams)...)
    // Simulating API response
    setTimeout(() => {
      this.bookings = [
        {
          bookingId: '1',
          customerName: 'Vivek Sangani',
          vehicleRegNo: 'GJ-01-AB-1234',
          vehicleName: 'Toyota Fortuner',
          vehicleImage: 'https://imgd.aeplcdn.com/370x208/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-20.jpeg',
          bookingDate: new Date('2026-01-20'),
          startDate: new Date('2026-02-01'),
          endDate: new Date('2026-02-05'),
          status: 1
        },
        {
          bookingId: '2',
          customerName: 'Rahul Sharma',
          vehicleRegNo: 'MH-12-XY-9876',
          vehicleName: 'Hyundai Creta',
          vehicleImage: '', // Test empty image
          bookingDate: new Date('2026-01-22'),
          startDate: new Date('2026-02-10'),
          endDate: new Date('2026-02-12'),
          status: 0
        }
      ];
      this.totalRecords = 2;
      this.totalPages = 1;
      this.generatePagesArray();
      this.loadingService.hide();
    }, 500);

    /* // REAL IMPLEMENTATION:
    this.bookingService.getBookings(queryParams).subscribe({
      next: (res: any) => {
        this.bookings = res.data;
        this.totalRecords = res.totalRecords;
        this.totalPages = res.totalPages;
        this.generatePagesArray();
        this.loadingService.hide();
      },
      error: (err) => {
        this.toastr.error('Failed to load bookings');
        this.loadingService.hide();
      }
    });
    */
  }

  addBooking(): void {
    this.router.navigate(['/vehicle/booking/add']);
  }

  editBooking(id: string): void {
    this.router.navigate(['/vehicle/booking/edit', id]);
  }

  deleteBooking(id: string): void {
    if (confirm('Are you sure you want to delete this booking?')) {
      // this.bookingService.deleteBooking(id).subscribe(...)
      this.toastr.success('Booking deleted successfully');
      this.loadBookings();
    }
  }

  // --- Filtering & Sorting ---

  onSearch(): void {
    this.currentPage = 1;
    this.loadBookings();
  }

  onStatusFilter(): void {
    this.currentPage = 1;
    this.loadBookings();
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.loadBookings();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'bi bi-arrow-down-up text-muted opacity-50';
    return this.sortOrder === 'asc' ? 'bi bi-arrow-up-short' : 'bi bi-arrow-down-short';
  }

  // --- Pagination ---

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadBookings();
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