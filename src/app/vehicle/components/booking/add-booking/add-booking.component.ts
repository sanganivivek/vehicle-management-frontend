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
import { VehicleMaster, VehicleQueryParams } from '../../../models/vehicle.model';
import { Customer } from '../../../models/customer.model';
import { Dealer } from '../../../models/dealer.model';
import { DealerService } from '../../../services/dealer.service';
import { BookingService } from '../../../services/booking.service';

// Angular Material Imports
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';

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
    MatNativeDateModule,
    MatExpansionModule
  ],
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.css'],
})
export class AddBookingComponent implements OnInit {
  rentalForm: FormGroup;
  customerForm: FormGroup;

  vehicles: VehicleMaster[] = [];
  customers: Customer[] = [];
  dealers: Dealer[] = [];
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
    private dealerService: DealerService,
    private bookingService: BookingService,
    private router: Router,
    private toastr: ToastrService
  ) {
    // Step 1: Rental Details
    this.rentalForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      dealerId: ['', Validators.required],
      vehicleId: [{ value: '', disabled: true }, Validators.required],
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
    this.loadDealers();
    this.loadCustomers();

    // Subscribe to value changes for calculations
    this.rentalForm.get('startDate')?.valueChanges.subscribe(() => this.calculateTotal());
    this.rentalForm.get('endDate')?.valueChanges.subscribe(() => this.calculateTotal());
    this.rentalForm.get('vehicleId')?.valueChanges.subscribe(() => {
      this.updateDailyRate();
      this.calculateTotal();
    });

    this.rentalForm.get('dealerId')?.valueChanges.subscribe((dealerId) => {
      if (dealerId) {
        this.rentalForm.get('vehicleId')?.enable();
        this.rentalForm.get('vehicleId')?.setValue(''); // Reset vehicle selection
        this.rentalForm.get('vehicleId')?.markAsUntouched();
        this.loadVehicles(dealerId);
      } else {
        this.rentalForm.get('vehicleId')?.disable();
        this.rentalForm.get('vehicleId')?.setValue('');
        this.vehicles = [];
      }
    });
  }

  loadVehicles(dealerId?: number): void {
    // Only fetch active vehicles for booking
    // Fetch a large page size to ensure all vehicles for the dealer are shown in dropdown
    const queryParams: VehicleQueryParams = {
      isActive: true,
      pageSize: 100,
      page: 1
    };

    this.vehicles = []; // Clear existing vehicles while loading

    this.vehicleService.getVehicles(queryParams).subscribe({
      next: (response) => {
        let fetchedVehicles = response.data || [];

        // FIX: Manually filter vehicles by dealerId to ensure correctness
        // We check both 'dealerId' and 'DealorId' due to inconsistencies in the models
        if (dealerId) {
          fetchedVehicles = fetchedVehicles.filter(v =>
            (v.dealerId == dealerId) || (v.DealorId == dealerId)
          );
        }

        this.vehicles = fetchedVehicles;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading vehicles', err);
        this.toastr.error('Failed to load vehicles');
        this.isLoading = false;
      },
    });
  }

  loadDealers(): void {
    this.dealerService.getAllDealers().subscribe({
      next: (data) => {
        this.dealers = data;
      },
      error: (err) => {
        console.error('Error loading dealers', err);
        this.toastr.error('Failed to load dealers');
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
        // Use the vehicle's OneDayRate, defaulting to 0 if not set
        this.dailyRate = vehicle.oneDayRate || 0;
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
  get selectedVehicle(): VehicleMaster | undefined {
    const vehicleId = this.rentalForm.get('vehicleId')?.value;
    return this.vehicles.find(v => v.vehicleId === vehicleId);
  }

  get selectedVehicleName(): string {
    const vehicle = this.selectedVehicle;
    return vehicle ? `${vehicle.brandName} ${vehicle.modelName} (${vehicle.regNo})` : '';
  }

  get selectedCustomerName(): string {
    const customerId = this.customerForm.get('customerId')?.value;
    const customer = this.customers.find(c => c.id === customerId);
    return customer ? `${customer.name} (${customer.contactNo})` : '';
  }

  get selectedDealer(): Dealer | undefined {
    const dealerId = this.rentalForm.get('dealerId')?.value;
    return this.dealers.find(d => d.id === dealerId);
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

    // Combine form values with Raw Value to get disabled fields (vehicleId)
    const rawRental = this.rentalForm.getRawValue();
    const rawCustomer = this.customerForm.getRawValue();

    // Format Dates to YYYY-MM-DD to avoid timezone issues
    const formatDate = (date: Date) => {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    };

    const formValues = {
      ...rawRental,
      ...rawCustomer,
      startDate: formatDate(rawRental.startDate),
      endDate: formatDate(rawRental.endDate),
      // Map bookingStatus to Status (backend expects 'Status')
      Status: rawCustomer.bookingstatus
    };

    // Real API Submission
    const bookingData = {
      ...formValues,
      amount: this.totalAmount
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastr.success('Booking created successfully!');
        this.router.navigate(['/booking']);
      },
      error: (err) => {
        console.error('Error creating booking', err);
        this.isLoading = false;
        // Extract error message if available
        const msg = err.error?.message || 'Failed to create booking';
        this.toastr.error(msg);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/booking']);
  }

  openNewCustomerModal(): void {
    this.router.navigate(['/customers/add'], { queryParams: { returnUrl: '/vehicle/booking/add' } });
  }
}
