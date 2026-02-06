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
  loading = true;

  constructor(private dealerService: DealerService) {}

  ngOnInit(): void {
    this.loadDealers();
  }

  loadDealers() {
    this.dealerService.getDealers().subscribe({
      next: (data) => {
        this.dealers = data;
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        console.error('Error loading dealers', e);
      }
    });
  }

  deleteDealer(id: number) {
    if(confirm("Are you sure you want to delete this dealer?")) {
      this.dealerService.deleteDealer(id).subscribe({
        next: () => {
          // Remove deleted dealer from local array
          this.dealers = this.dealers.filter(x => x.id !== id);
          alert('Dealer deleted successfully.');
        },
        error: (err) => {
          console.error(err);
          alert('Failed to delete dealer.');
        }
      });
    }
  }
} 