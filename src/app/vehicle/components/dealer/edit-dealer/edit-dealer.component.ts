import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
// Adjust these paths if necessary to match your project structure
import { DealerService } from "src/app/vehicle/services/dealer.service";
import { Dealer } from "src/app/vehicle/models/dealer.model";

@Component({
  selector: "app-edit-dealer",
  templateUrl: "./edit-dealer.component.html",
  styleUrls: ["./edit-dealer.component.css"],
})
export class EditDealerComponent implements OnInit {
  editDealerForm!: FormGroup;
  dealerId!: number;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private dealerService: DealerService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService, // Injected correctly
  ) {}

  ngOnInit(): void {
    // 1. Get ID from URL
    const idParam = this.route.snapshot.paramMap.get("id");
    this.dealerId = idParam ? Number(idParam) : 0;

    // 2. Initialize Form
    this.initForm();

    // 3. Load Data if ID exists
    if (this.dealerId) {
      this.loadDealer();
    } else {
      this.toastr.error("Invalid Dealer ID", "Error");
      this.router.navigate(["/dealer"]);
    }
  }

  // Helper for easy access to form controls in HTML (e.g., *ngIf="f['name'].errors")
  get f() {
    return this.editDealerForm.controls;
  }

  initForm(): void {
    this.editDealerForm = this.fb.group({
      name: ["", Validators.required],
      contactPerson: [""],
      contactNo: ["", [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      email: ["", [Validators.email]],
      gstNo: [""],
      city: [""],
      address: [""],
      status: ["Active", Validators.required],
    });
  }

  loadDealer(): void {
    this.loading = true;
    this.dealerService.getDealerById(this.dealerId).subscribe({
      next: (dealer: Dealer) => {
        this.editDealerForm.patchValue(dealer);
        this.loading = false;
      },
      error: (err) => {
        console.error("Error fetching dealer details", err);
        this.loading = false;
        this.toastr.error("Failed to load dealer details.", "Error");
        this.router.navigate(["/dealer"]); // Redirect if load fails
      },
    });
  }

  onSubmit(): void {
    this.submitted = true;

    // 1. Check Validity
    if (this.editDealerForm.invalid) {
      this.toastr.warning(
        "Please fill in all required fields.",
        "Validation Error",
      );
      this.editDealerForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    // 2. Prepare Data
    const updatedDealer = {
      ...this.editDealerForm.value,
      id: this.dealerId,
    };

    // 3. Call Service
    this.dealerService.updateDealer(this.dealerId, updatedDealer).subscribe({
      next: () => {
        // SUCCESS
        this.toastr.info("Dealer updated successfully!", "Update");
        this.router.navigate(["/dealers"]); // Navigate back to list
      },
      error: (err) => {
        // ERROR
        console.error("Error updating dealer", err);
        this.loading = false;
        const msg = err.error?.message || err.message || "Unknown error";
        this.toastr.error("Error updating dealer: " + msg, "Error");
      },
    });
  }
}
