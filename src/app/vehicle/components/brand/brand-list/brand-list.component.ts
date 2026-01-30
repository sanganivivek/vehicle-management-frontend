import { Component, OnInit, Input } from '@angular/core';
import { BrandService } from '../../../services/brand.service';
import { Brand } from '../../../models/vehicle.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent implements OnInit {
  brands: Brand[] = [];
  loading = false;

  @Input() showHeader: boolean = true;

  constructor(private brandService: BrandService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands() {
    this.loading = true;
    this.brandService.getBrands().subscribe(data => {
      this.brands = data;
      this.loading = false;
    });
  }

  deleteBrand(id: string) {
    if (confirm('Are you sure you want to delete this brand?')) {
      this.brandService.deleteBrand(id).subscribe({
        next: () => {
          this.toastr.warning('Brand Deleted Successfully');
          this.loadBrands();
        },
        error: (err) => {
          this.toastr.error('Failed to delete brand');
          console.error(err);
        }
      });
    }
  }
}
