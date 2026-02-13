import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VehicleService } from '../../../services/vehicle.service';
import { CustomerService } from '../../../services/customer.service';
import { VehicleMaster } from '../../../models/vehicle.model';
import { Customer } from '../../../models/customer.model';
// import { BookingService } from '../../../services/booking.service'; // Assuming this exists or will differ

@Component({
  selector: 'app-add-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.css'],
})
export class AddBookingComponent implements OnInit {
  bookingForm: FormGroup;
  vehicles: VehicleMaster[] = [];
  customers: Customer[] = [];
  isLoading = false;
  showCustomerModal = false;

  // Dropdown Options
  paymentMethods = ['Credit Card', 'UPI', 'Cash', 'Bank Transfer'];
  paymentStatuses = ['Paid', 'Pending', 'Failed'];
  bookingStatuses = [
    { name: 'Pending', value: 0 },
    { name: 'Confirmed', value: 1 },
    { name: 'Completed', value: 2 },
    { name: 'Cancelled', value: 3 },
  ];

  // Calculated values
  totalDays = 0;
  dailyRate = 0;
  totalAmount = 0;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private customerService: CustomerService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.bookingForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      vehicleId: ['', Validators.required],
      customerId: ['', Validators.required],
      paymentMethod: ['Cash', Validators.required], // Default to Cash
      paymentStatus: ['Pending', Validators.required], // Default to Pending
      bookingStatus: [0, Validators.required], // Default to Pending (0)
    });
  }

  ngOnInit(): void {
    this.loadVehicles();
    this.loadCustomers();

    // Subscribe to value changes for calculations
    this.bookingForm.get('startDate')?.valueChanges.subscribe(() => this.calculateTotal());
    this.bookingForm.get('endDate')?.valueChanges.subscribe(() => this.calculateTotal());
    this.bookingForm.get('vehicleId')?.valueChanges.subscribe(() => {
      this.updateDailyRate();
      this.calculateTotal();
    });
  }

  loadVehicles(): void {
    // Only fetch active vehicles for booking
    this.vehicleService.getVehicles({ isActive: true }).subscribe({
      next: (response) => {
        this.vehicles = response.data || [];
      },
      error: (err) => {
        console.error('Error loading vehicles', err);
        this.toastr.error('Failed to load vehicles');
      },
    });
  }

  loadCustomers(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (err) => {
        console.error('Error loading customers', err);
        this.toastr.error('Failed to load customers');
      },
    });
  }

  updateDailyRate(): void {
    const vehicleId = this.bookingForm.get('vehicleId')?.value;
    if (vehicleId) {
      // MOCK LOGIC: Generate a consistent random rate based on vehicle ID or type
      // Since the backend model doesn't have a rate, we'll simulate it.
      // In a real app, this would come from the vehicle details.
      const vehicle = this.vehicles.find(v => v.vehicleId === vehicleId);
      if (vehicle) {
        // Simple hash to get a consistent "random" number for the session
        const seed = vehicleId.charCodeAt(0) + (vehicleId.charCodeAt(vehicleId.length - 1) || 0);
        this.dailyRate = 1000 + (seed % 20) * 100; // Rates between 1000 and 3000
      }
    } else {
      this.dailyRate = 0;
    }
  }

  calculateTotal(): void {
    const start = this.bookingForm.get('startDate')?.value;
    const end = this.bookingForm.get('endDate')?.value;

    if (start && end && this.dailyRate > 0) {
      const startDate = new Date(start);
      const endDate = new Date(end);

      // Calculate difference in time
      const timeDiff = endDate.getTime() - startDate.getTime();
      // Calculate difference in days. Add 1 to include the start day if needed, or keeping it as nights.
      // Usually car rentals count 24h periods. Let's assume standard day diff.
      // If start equals end, it's 1 day minimum.
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      this.totalDays = diffDays > 0 ? diffDays : 1; // Minimum 1 day

      // Validation: End date cannot be before start date
      if (diffDays < 0) {
        this.bookingForm.get('endDate')?.setErrors({ invalidDate: true });
        this.totalAmount = 0;
        this.totalDays = 0;
      } else {
        this.bookingForm.get('endDate')?.setErrors(null);
        this.totalAmount = this.totalDays * this.dailyRate;
      }

    } else {
      this.totalAmount = 0;
      this.totalDays = 0;
    }
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    this.isLoading = true;
    const formValues = this.bookingForm.value;

    // MOCK SUBMISSION
    const mockBookingData = {
      ...formValues,
      amount: this.totalAmount,
      bookingId: 'MOCK-' + Math.floor(Math.random() * 10000),
      createdAt: new Date()
    };

    console.log('Booking Data to Save:', mockBookingData);

    setTimeout(() => {
      this.isLoading = false;
      this.toastr.success('Booking created successfully!');
      this.router.navigate(['/vehicle/booking']); // Redirect to booking list
    }, 1000);
  }

  onCancel(): void {
    this.router.navigate(['/vehicle/booking']);
  }

  // Helper for template access
  get f() { return this.bookingForm.controls; }

  // Customer Modal Logic (Simple placeholder for now)
  openNewCustomerModal(): void {
    // In a real implementation, this would open a modal component.
    // For this task, we'll just log it or show a toast.
    this.toastr.info('Customer creation modal would open here.');
    // Alternatively, navigate to customer add page?
    // this.router.navigate(['/vehicle/customer/add']);
  }
}
