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

// Angular Material Imports
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.css'],
})
export class AddBookingComponent implements OnInit {
  rentalForm: FormGroup;
  customerForm: FormGroup;

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
    // Step 1: Rental Details
    this.rentalForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      vehicleId: ['', Validators.required],
    });

    // Step 2: Customer & Payment
    this.customerForm = this.fb.group({
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
    this.rentalForm.get('startDate')?.valueChanges.subscribe(() => this.calculateTotal());
    this.rentalForm.get('endDate')?.valueChanges.subscribe(() => this.calculateTotal());
    this.rentalForm.get('vehicleId')?.valueChanges.subscribe(() => {
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
    const vehicleId = this.rentalForm.get('vehicleId')?.value;
    if (vehicleId) {
      // MOCK LOGIC: Generate a consistent random rate based on vehicle ID or type
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
    const start = this.rentalForm.get('startDate')?.value;
    const end = this.rentalForm.get('endDate')?.value;

    if (start && end && this.dailyRate > 0) {
      const startDate = new Date(start);
      const endDate = new Date(end);

      // Calculate difference in time
      const timeDiff = endDate.getTime() - startDate.getTime();
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      this.totalDays = diffDays > 0 ? diffDays : 1; // Minimum 1 day

      // Validation: End date cannot be before start date
      if (diffDays < 0) {
        this.rentalForm.get('endDate')?.setErrors({ invalidDate: true });
        this.totalAmount = 0;
        this.totalDays = 0;
      } else {
        // If the only error was invalidDate, clear it. 
        // We need to be careful not to clear required error if field is empty, 
        // but here 'end' has value so required is satisfied.
        if (this.rentalForm.get('endDate')?.hasError('invalidDate')) {
          this.rentalForm.get('endDate')?.setErrors(null);
        }
        this.totalAmount = this.totalDays * this.dailyRate;
      }

    } else {
      this.totalAmount = 0;
      this.totalDays = 0;
    }
  }

  // Getters for template access to selected values
  get selectedVehicleName(): string {
    const vehicleId = this.rentalForm.get('vehicleId')?.value;
    const vehicle = this.vehicles.find(v => v.vehicleId === vehicleId);
    return vehicle ? `${vehicle.brandName} ${vehicle.modelName} (${vehicle.regNo})` : '';
  }

  get selectedCustomerName(): string {
    const customerId = this.customerForm.get('customerId')?.value;
    const customer = this.customers.find(c => c.id === customerId);
    return customer ? `${customer.name} (${customer.contactNo})` : '';
  }

  // Helper getters for forms
  get r() { return this.rentalForm.controls; }
  get c() { return this.customerForm.controls; }

  onSubmit(): void {
    if (this.rentalForm.invalid || this.customerForm.invalid) {
      this.rentalForm.markAllAsTouched();
      this.customerForm.markAllAsTouched();
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    this.isLoading = true;

    // Combine form values
    const formValues = {
      ...this.rentalForm.value,
      ...this.customerForm.value
    };

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

  openNewCustomerModal(): void {
    this.toastr.info('Customer creation modal would open here.');
  }
}
