import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VehicleService } from '../../../services/vehicle.service';
import { CustomerService } from '../../../services/customer.service';
import { BookingService } from '../../../services/booking.service';
import { DealerService } from '../../../services/dealer.service';
import { VehicleMaster, VehicleQueryParams } from '../../../models/vehicle.model';
import { Customer } from '../../../models/customer.model';
import { Dealer } from '../../../models/dealer.model';
import { Booking } from '../../../models/booking.model';

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
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-booking',
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
  templateUrl: './edit-booking.component.html',
  styleUrl: './edit-booking.component.css'
})
export class EditBookingComponent implements OnInit {
  rentalForm: FormGroup;
  customerForm: FormGroup;

  vehicles: VehicleMaster[] = [];
  customers: Customer[] = [];
  dealers: Dealer[] = [];
  isLoading = false;
  bookingId: string | null = null;
  currentBooking: Booking | null = null;

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
    private route: ActivatedRoute,
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
      paymentMethod: ['', Validators.required],
      paymentStatus: ['', Validators.required],
      bookingStatus: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadDealers();
    this.loadCustomers();

    // Subscribe to rental form changes
    this.rentalForm.get('startDate')?.valueChanges.subscribe(() => this.calculateTotal());
    this.rentalForm.get('endDate')?.valueChanges.subscribe(() => this.calculateTotal());
    this.rentalForm.get('vehicleId')?.valueChanges.subscribe(() => {
      this.updateDailyRate();
      this.calculateTotal();
    });

    this.rentalForm.get('dealerId')?.valueChanges.subscribe((dealerId) => {
      if (dealerId) {
        // Only reset if the user manually changed the dealer, 
        // not when we are programmatically patching the form during load
        if (this.rentalForm.get('dealerId')?.dirty) {
          this.rentalForm.get('vehicleId')?.enable();
          this.rentalForm.get('vehicleId')?.setValue('');
          this.rentalForm.get('vehicleId')?.markAsUntouched();
          this.loadVehicles(dealerId);
        } else {
          // If not dirty (programmatic change), just enable
          this.rentalForm.get('vehicleId')?.enable();
          // We don't call loadVehicles here because loadBooking will call it
          // and we want to wait for it before patching vehicleId
        }
      } else {
        this.rentalForm.get('vehicleId')?.disable();
        this.rentalForm.get('vehicleId')?.setValue('');
        this.vehicles = [];
      }
    });

    // Check for ID param
    this.route.paramMap.subscribe(params => {
      this.bookingId = params.get('id');
      if (this.bookingId) {
        this.loadBooking(this.bookingId);
      } else {
        this.toastr.error('Invalid Booking ID');
        this.router.navigate(['/vehicle/booking']);
      }
    });
  }

  async loadBooking(id: string) {
    this.isLoading = true;
    try {
      // Use firstValueFrom to await the observable
      const booking = await firstValueFrom(this.bookingService.getBookingById(id));
      this.currentBooking = booking;

      // 1. Patch Rental Form Basic Fields
      this.rentalForm.patchValue({
        startDate: booking.startDate,
        endDate: booking.endDate,
        dealerId: booking.dealerId
      }, { emitEvent: false }); // Don't emit event to avoid clearing vehicle selection

      // 2. Load Vehicles for the Dealer
      if (booking.dealerId) {
        await this.loadVehicles(booking.dealerId);
        this.rentalForm.get('vehicleId')?.enable();
      }

      // 3. Patch Vehicle ID (now that options are loaded)
      this.rentalForm.patchValue({
        vehicleId: booking.vehicleId
      });

      // 4. Patch Customer Form
      this.customerForm.patchValue({
        customerId: booking.customerId,
        paymentMethod: booking.paymentMethod,
        paymentStatus: booking.paymentStatus,
        bookingStatus: booking.status
      });

      // 5. Trigger Calculations
      this.updateDailyRate(); // Will set daily rate based on selected vehicle
      this.calculateTotal(); // Will set total days and amount

    } catch (error) {
      console.error('Error loading booking', error);
      this.toastr.error('Failed to load booking details');
      this.router.navigate(['/vehicle/booking']);
    } finally {
      this.isLoading = false;
    }
  }

  async loadVehicles(dealerId: number): Promise<void> {
    const queryParams: VehicleQueryParams = {
      isActive: true, // Should we show inactive vehicles if the booking is old? Maybe simply remove this filter or fetch specific vehicle if needed. 
      // For now, keeping it same as Add Booking, assuming we only edit active fleet.
      pageSize: 100,
      dealerId: dealerId
    };

    try {
      const response = await firstValueFrom(this.vehicleService.getVehicles(queryParams));
      let fetchedVehicles = response.data || [];
      if (dealerId) {
        fetchedVehicles = fetchedVehicles.filter(v =>
          (v.dealerId == dealerId) || (v.DealorId == dealerId)
        );
      }
      this.vehicles = fetchedVehicles;
    } catch (error) {
      console.error('Error loading vehicles', error);
      this.toastr.error('Failed to load vehicles');
    }
  }

  loadDealers(): void {
    this.dealerService.getAllDealers().subscribe({
      next: (data) => this.dealers = data,
      error: (err) => this.toastr.error('Failed to load dealers')
    });
  }

  loadCustomers(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (data) => this.customers = data,
      error: (err) => this.toastr.error('Failed to load customers')
    });
  }

  updateDailyRate(): void {
    const vehicleId = this.rentalForm.get('vehicleId')?.value;
    if (vehicleId) {
      const vehicle = this.vehicles.find(v => v.vehicleId === vehicleId);
      if (vehicle) {
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
      const timeDiff = endDate.getTime() - startDate.getTime();
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      this.totalDays = diffDays > 0 ? diffDays : 0; // Prevent negative display

      if (diffDays < 0) {
        this.rentalForm.get('endDate')?.setErrors({ invalidDate: true });
        this.totalAmount = 0;
      } else {
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

  // Getters
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

    // getRawValue() captures disabled fields (vehicleId is disabled until dealer is selected)
    const rawRental = this.rentalForm.getRawValue();
    const rawCustomer = this.customerForm.getRawValue();

    // Format Dates to YYYY-MM-DD to avoid timezone/parse issues
    const formatDate = (date: Date | string) => {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('-');
    };

    // Build clean payload matching UpdateBookingDTO exactly
    const bookingData = {
      vehicleId: rawRental.vehicleId,
      dealerId: rawRental.dealerId,
      customerId: rawCustomer.customerId,
      startDate: formatDate(rawRental.startDate),
      endDate: formatDate(rawRental.endDate),
      paymentMethod: rawCustomer.paymentMethod,
      paymentStatus: rawCustomer.paymentStatus,
      bookingStatus: rawCustomer.bookingStatus  // maps to UpdateBookingDTO.BookingStatus
    };

    if (this.bookingId) {
      this.bookingService.updateBooking(this.bookingId, bookingData as any).subscribe({
        next: () => {
          this.isLoading = false;
          this.toastr.success('Booking updated successfully!');
          setTimeout(() => this.router.navigate(['/booking']), 500);
        },
        error: (err) => {
          this.isLoading = false;
          const msg = err.error?.message || 'Failed to update booking';
          this.toastr.error(msg);
          console.error(err);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/booking']);
  }
}
