import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DealerService } from '../../../services/dealer.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-add-dealer',
  templateUrl: './add-dealer.component.html',
  styleUrls: ['./add-dealer.component.css']
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
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.dealerId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.dealerId;

    // Initialize Form with correct field names matching backend
    this.dealerForm = this.formBuilder.group({
      dealerName: ['', Validators.required],
      contactPerson: [''],
      contactNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.email]],
      gstNo: [''],
      city: [''],
      address: [''],
      status: ['Active', Validators.required] // Dropdown: Active/Inactive
    });

    // If Edit Mode, fetch data
    if (this.isEditMode) {
      this.dealerService.getDealerById(this.dealerId)
        .pipe(first())
        .subscribe(x => {
          this.dealerForm.patchValue(x);
        });
    }
  }

  get f() { return this.dealerForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.dealerForm.invalid) {
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
    this.dealerService.createDealer(this.dealerForm.value)
      .subscribe({
        next: () => {
          alert('Dealer added successfully!');
          this.router.navigate(['/vehicle/dealers']);
        },
        error: error => {
          console.error(error);
          this.loading = false;
          alert('Error creating dealer: ' + (error.error?.message || error.message));
        }
      });
  }

  private updateDealer() {
    const updatedDealer = {
      ...this.dealerForm.value,
      id: Number(this.dealerId)
    };

    this.dealerService.updateDealer(this.dealerId, updatedDealer)
      .subscribe({
        next: () => {
          alert('Dealer updated successfully!');
          this.router.navigate(['/vehicle/dealers']);
        },
        error: error => {
          console.error(error);
          this.loading = false;
          alert('Error updating dealer: ' + (error.error?.message || error.message));
        }
      });
  }
}