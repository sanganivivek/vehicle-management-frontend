import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { DealerService } from '../../../services/dealer.service';
import { Dealer } from '../../../models/dealer.model';

@Component({
  selector: 'app-add-dealer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-dealer.component.html',
  styleUrls: ['./add-dealer.component.css'] // Make sure this CSS file exists, or remove this line
})
export class AddDealerComponent implements OnInit {
  dealer: any = { // Using 'any' temporarily to match your model flexibility
    dealerName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    isActive: true
  };
  isEditMode = false;
  dealerId: string | null = null;

  constructor(
    private dealerService: DealerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if we are in edit mode
    this.dealerId = this.route.snapshot.paramMap.get('id');
    if (this.dealerId) {
      this.isEditMode = true;
      this.loadDealerData(this.dealerId);
    }
  }

  loadDealerData(id: string) {
    this.dealerService.getDealerById(id).subscribe({
      next: (data) => this.dealer = data,
      error: (err) => console.error('Error loading dealer', err)
    });
  }

  onSubmit() {
    if (this.isEditMode && this.dealerId) {
      this.dealerService.updateDealer(this.dealerId, this.dealer).subscribe({
        next: () => {
          alert('Dealer updated successfully');
          this.router.navigate(['/vehicle/dealers']);
        },
        error: (err) => alert('Error updating dealer')
      });
    } else {
      this.dealerService.addDealer(this.dealer).subscribe({
        next: () => {
          alert('Dealer added successfully');
          this.router.navigate(['/vehicle/dealers']);
        },
        error: (err) => alert('Error adding dealer')
      });
    }
  }
}