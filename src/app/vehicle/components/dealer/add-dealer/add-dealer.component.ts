import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { DealerService } from '../../../services/dealer.service';
import { Dealer } from '../../../models/dealer.model';

@Component({
  selector: 'app-add-dealer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-dealer.component.html',
  styleUrls: ['./add-dealer.component.css']
})
export class AddDealerComponent implements OnInit {
  dealer: Dealer = {
    dealerName: '',
    contactPerson: '',
    email: '',
    address: '',
    isActive: true
  };

  isEditMode = false;
  dealerId: string | null = null;
  loading = false;

  constructor(
    private dealerService: DealerService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.dealerId = params.get('id');
      if (this.dealerId) {
        this.isEditMode = true;
        this.loadDealer(this.dealerId);
      }
    });
  }

  loadDealer(id: string) {
    this.dealerService.getDealerById(id).subscribe({
      next: (data) => {
        this.dealer = data;
      },
      error: (err) => {
        console.error('Error loading dealer', err);
        alert('Failed to load dealer details.');
      }
    });
  }

  onSubmit() {
    this.loading = true;
    if (this.isEditMode && this.dealerId) {
      this.dealerService.updateDealer(this.dealerId, this.dealer).subscribe({
        next: () => {
          alert('Dealer updated successfully!');
          this.router.navigate(['/dealers']);
        },
        error: (err) => {
          console.error('Error updating dealer', err);
          alert('Failed to update dealer.');
          this.loading = false;
        }
      });
    } else {
      this.dealerService.addDealer(this.dealer).subscribe({
        next: () => {
          alert('Dealer added successfully!');
          this.router.navigate(['/dealers']);
        },
        error: (err) => {
          console.error('Error adding dealer', err);
          alert('Failed to add dealer.');
          this.loading = false;
        }
      });
    }
  }
}