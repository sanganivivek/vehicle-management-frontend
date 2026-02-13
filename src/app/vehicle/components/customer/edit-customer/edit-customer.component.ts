import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CustomerService } from "src/app/vehicle/services/customer.service";
import { Customer } from "src/app/vehicle/models/customer.model";

@Component({
  selector: "app-edit-customer",
  templateUrl: "./edit-customer.component.html",
  styleUrl: "./edit-customer.component.css",
})
export class CustomerEditComponent implements OnInit {
  customerForm!: FormGroup;
  customerId!: string;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }



  ngOnInit(): void {
    // 1. Get ID from URL
    const idParam = this.route.snapshot.paramMap.get("id");
    this.customerId = idParam ? idParam : "";

    this.initForm();

    if (this.customerId) {
      this.loadCustomer();
    } else {
      this.toastr.error("Invalid Customer ID", "Error");
      this.router.navigate(["/customers"]);
    }
  }

  get f() {
    return this.customerForm.controls;
  }

  initForm(): void {
    this.customerForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      contactNo: ["", [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      gender: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      city: ["", Validators.required],
      address: ["", Validators.required],
      isActive: [true],
    });
  }

  loadCustomer(): void {
    this.loading = true;
    this.customerService.getCustomerById(this.customerId).subscribe({
      next: (customer: Customer) => {
        // Format date for date input
        let formattedDate = "";
        if (customer.dateOfBirth) {
          const date = new Date(customer.dateOfBirth);
          formattedDate = date.toISOString().split('T')[0];
        }

        this.customerForm.patchValue({
          ...customer,
          dateOfBirth: formattedDate,
          isActive: customer.status === "Active",
        });
        this.loading = false;
      },
      error: (err) => {
        console.error("Error fetching customer details", err);
        this.loading = false;
        this.toastr.error("Failed to load customer details", "Error");
        this.router.navigate(["/customers"]);
      },
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.customerForm.invalid) {
      this.toastr.warning(
        "Please correct the errors in the form",
        "Validation Error"
      );
      this.customerForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const formValue = this.customerForm.value;
    const updatedCustomer = {
      ...formValue,
      status: formValue.isActive ? "Active" : "Inactive",
      id: this.customerId,
    };

    this.customerService
      .updateCustomer(this.customerId, updatedCustomer)
      .subscribe({
        next: () => {
          this.toastr.success("Customer updated successfully", "Success");
          this.router.navigate(["/customers"]);
        },
        error: (err) => {
          console.error("Error updating customer", err);
          this.loading = false;
          const msg = err.error?.message || err.message || "Unknown error";
          this.toastr.error("Error updating customer: " + msg, "Error");
        },
      });
  }
}
