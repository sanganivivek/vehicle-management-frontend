import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DealerService } from "src/app/vehicle/services/dealer.service";
import { first } from "rxjs/operators";
import { ToastrService } from "ngx-toastr"; // Imported correctly

@Component({
  selector: "app-add-dealer",
  templateUrl: "./add-dealer.component.html",
  styleUrls: ["./add-dealer.component.css"],
})
export class AddDealerComponent implements OnInit {
  dealerForm!: FormGroup;
  isEditMode = false;
  dealerId!: number;
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private dealerService: DealerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService, // Injected ToastrService
  ) { }

  ngOnInit(): void {
    // Check for ID in the URL to determine Edit Mode
    const idParam = this.route.snapshot.params["id"];
    this.dealerId = idParam ? Number(idParam) : 0;
    this.isEditMode = !!this.dealerId;

    // Initialize Form
    this.dealerForm = this.formBuilder.group({
      name: ["", Validators.required],
      contactPerson: ["", Validators.required],
      contactNo: ["", [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      email: ["", [Validators.required, Validators.email]],
      gstNo: ["", [Validators.required, Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/)]],
      city: ["", Validators.required],
      address: ["", Validators.required],

      isActive: [true], // Default to True
    });

    // If Edit Mode, fetch existing data and patch the form
    if (this.isEditMode) {
      this.dealerService
        .getDealerById(this.dealerId)
        .pipe(first())
        .subscribe({
          next: (data) => {
            this.dealerForm.patchValue({
              ...data,
              isActive: data.status === "Active",
            });
          },
          error: (err) => {
            this.toastr.error("Failed to load dealer details.", "Error");
            this.router.navigate(["/dealers"]);
          },
        });
    }
  }

  // Helper getter for easy access to form fields in HTML
  get f() {
    return this.dealerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.dealerForm.invalid) {
      this.toastr.warning(
        "Please fill all required fields correctly",
        "Validation Error",
      );
      this.dealerForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    if (this.isEditMode) {
      this.updateDealer();
    } else {
      this.createDealer();
    }
  }

  private createDealer() {
    const formValue = this.dealerForm.value;
    const newDealer = {
      ...formValue,
      status: formValue.isActive ? "Active" : "Inactive",
    };
    this.dealerService.createDealer(newDealer).subscribe({
      next: () => {
        this.toastr.success("Dealer created successfully!", "Success");
        this.router.navigate(["/dealers"]); // Navigate to list
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        // specific error message or fallback
        const msg = error.error?.message || error.message || "Unknown error";
        this.toastr.error("Error creating dealer: " + msg, "Error");
      },
    });
  }

  private updateDealer() {
    // Ensure the ID is included in the payload if backend requires it
    const formValue = this.dealerForm.value;
    const updatedDealer = {
      ...formValue,
      status: formValue.isActive ? "Active" : "Inactive",
      id: this.dealerId,
    };

    this.dealerService.updateDealer(this.dealerId, updatedDealer).subscribe({
      next: () => {
        this.toastr.success("Dealer updated successfully!", "Success");
        this.router.navigate(["/dealers"]); // Navigate to list
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        const msg = error.error?.message || error.message || "Unknown error";
        this.toastr.error("Error updating dealer: " + msg, "Error");
      },
    });
  }
}
