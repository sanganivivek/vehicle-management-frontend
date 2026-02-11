import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { first } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
// Adjust this import path based on your actual folder structure
import { CustomerService } from "../../../services/customer.service";

@Component({
  selector: "app-add-customer",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./add-customer.component.html",
  styleUrls: ["./add-customer.component.css"],
})
export class AddCustomerComponent implements OnInit {
  customerForm!: FormGroup;
  isEditMode = false;
  customerId: string | null = null;
  submitted = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    // Initialize form immediately to avoid "undefined" errors in template
    this.initForm();

    // Check for ID parameter
    const idParam = this.route.snapshot.paramMap.get("id");

    if (idParam) {
      this.customerId = idParam;
      this.isEditMode = true;
      this.loadCustomerData();
    }
  }

  private initForm(): void {
    this.customerForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      contactNo: ["", [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      dateOfBirth: ["", Validators.required],
      gender: ["", Validators.required],
      city: ["", Validators.required],
      address: ["", Validators.required],
      status: ["Active", Validators.required],
    });
  }

  private loadCustomerData(): void {
    if (!this.customerId) return;

    this.customerService
      .getCustomerById(this.customerId)
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          // Format Date for HTML input (YYYY-MM-DD)
          if (data.dateOfBirth) {
            data.dateOfBirth = new Date(data.dateOfBirth)
              .toISOString()
              .split("T")[0];
          }
          this.customerForm.patchValue(data);
        },
        error: (err) => {
          this.toastr.error("Failed to load customer details.", "Error");
          this.router.navigate(["/customers"]);
        },
      });
  }

  // Getter for easy access to form fields in HTML
  get f() {
    return this.customerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.customerForm.invalid) {
      this.toastr.warning(
        "Please fill all required fields correctly",
        "Validation Error",
      );
      this.customerForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    if (this.isEditMode) {
      this.updateCustomer();
    } else {
      this.createCustomer();
    }
  }

  private createCustomer(): void {
    this.customerService.createCustomer(this.customerForm.value).subscribe({
      next: (data) => {
        this.toastr.success("Customer created successfully", "Success");
        this.router.navigate(["/customers"]);
      },
      error: (error) => {
        this.handleError(error, "creating");
      },
    });
  }

  private updateCustomer(): void {
    if (!this.customerId) return;

    const updatedCustomer = {
      ...this.customerForm.value,
      id: Number(this.customerId)
    };

    this.customerService
      .updateCustomer(this.customerId, updatedCustomer)
      .subscribe({
        next: () => {
          this.toastr.success("Customer updated successfully", "Success");
          this.router.navigate(["/customers"]);
        },
        error: (error) => {
          this.handleError(error, "updating");
        },
      });
  }

  private handleError(error: any, action: string): void {
    console.error(error);
    this.loading = false;
    const msg = error.error?.message || error.message || "Unknown error";
    this.toastr.error(`Error ${action} customer: ${msg}`, "Error");
  }
}
