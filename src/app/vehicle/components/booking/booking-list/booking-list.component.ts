import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../../../shared/services/loading.service';
// import { BookingService } from '../../../services/booking.service';

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

  constructor(
    // private bookingService: BookingService, 
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

    // MOCK DATA: Updated to include new fields
    setTimeout(() => {
      this.bookings = [
        {
          bookingId: '1001',
          customerName: 'Vivek Sangani',
          vehicleRegNo: 'GJ-01-AB-1234',
          vehicleName: 'Toyota Fortuner',
          amount: 15000,
          paymentMethod: 'Credit Card',
          paymentStatus: 'Paid',
          createdAt: new Date('2026-01-20'),
          startDate: new Date('2026-02-01'),
          endDate: new Date('2026-02-05'),
          status: 1
        },
        {
          bookingId: '1002',
          customerName: 'Rahul Sharma',
          vehicleRegNo: 'MH-12-XY-9876',
          vehicleName: 'Hyundai Creta',
          amount: 8500,
          paymentMethod: 'UPI',
          paymentStatus: 'Pending',
          createdAt: new Date('2026-01-22'),
          startDate: new Date('2026-02-10'),
          endDate: new Date('2026-02-12'),
          status: 0
        },
        {
          bookingId: '1003',
          customerName: 'Amit Patel',
          vehicleRegNo: 'GJ-05-ZZ-1111',
          vehicleName: 'Maruti Swift',
          amount: 3200,
          paymentMethod: 'Cash',
          paymentStatus: 'Paid',
          createdAt: new Date('2026-01-25'),
          startDate: new Date('2026-03-01'),
          endDate: new Date('2026-03-02'),
          status: 2
        }
      ];
      this.totalRecords = 3;
      this.totalPages = 1;
      this.generatePagesArray();
      this.loadingService.hide();
    }, 500);
  }

  addBooking(): void {
    this.router.navigate(['/booking/add']);
  }

  editBooking(id: string): void {
    this.router.navigate(['/booking/edit', id]);
  }

  deleteBooking(id: string): void {
    if (confirm('Are you sure you want to delete this booking?')) {
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