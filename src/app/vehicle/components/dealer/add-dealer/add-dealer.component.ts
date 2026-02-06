import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DealerService } from '../../../services/dealer.service';
import { first } from 'rxjs/operators';
import { UpdateDealerDTO } from '../../../models/dealer.model';

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
  
  // Property to hold existing dealer data for edit mode
  existingDealer: any;

  constructor(
    private formBuilder: FormBuilder,
    private dealerService: DealerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.dealerId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.dealerId;

    // Initialize Form
    this.dealerForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: [''],
      city: [''],
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      emailId: ['', [Validators.email]],
      isActive: [true] // Default to true
    });

    // If Edit Mode, fetch data
    if (this.isEditMode) {
      this.dealerService.getDealerById(this.dealerId)
        .pipe(first())
        .subscribe(x => {
          this.existingDealer = x;
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
          alert('Error creating dealer');
        }
      });
  }

  private updateDealer() {
    // Merge id and form values into UpdateDealerDTO
    const updatedDealer: UpdateDealerDTO = { 
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
          alert('Error updating dealer');
        }
      });
  }
}