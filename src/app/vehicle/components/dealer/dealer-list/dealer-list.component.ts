import { Component, OnInit } from '@angular/core';
import { DealerService } from '../../../services/dealer.service';
import { Dealer } from '../../../models/dealer.model';

@Component({
  selector: 'app-dealer-list',
  templateUrl: './dealer-list.component.html',
  styleUrls: ['./dealer-list.component.css']
})
export class DealerListComponent implements OnInit {
  dealers: Dealer[] = [];
  loading = false;

  constructor(private dealerService: DealerService) { }

  ngOnInit(): void {
    this.loadDealers();
  }

  loadDealers(): void {
    this.loading = true;
    this.dealerService.getAllDealers().subscribe({
      next: (data) => {
        this.dealers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching dealers', err);
        this.loading = false;
      }
    });
  }

  deleteDealer(id: number): void {
    if (confirm('Are you sure you want to delete this dealer?')) {
      this.dealerService.deleteDealer(id).subscribe({
        next: () => {
          this.loadDealers(); // Refresh list after delete
        },
        error: (err) => {
          console.error('Error deleting dealer', err);
          alert('Error deleting dealer: ' + (err.error?.message || err.message));
        }
      });
    }
  }
}