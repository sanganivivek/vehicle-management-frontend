import { Component, OnInit, Input } from "@angular/core";
import { ModelService } from "../../../services/model.service";
import { BrandService } from "../../../services/brand.service";
import { Model, Brand } from "../../../models/vehicle.model";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-model-list",
  templateUrl: "./model-list.component.html",
  styleUrls: ["./model-list.component.css"],
})
export class ModelListComponent implements OnInit {
  models: Model[] = [];
  brands: Brand[] = [];
  loading = false;

  @Input() showHeader: boolean = true;

  constructor(
    private modelService: ModelService,
    private brandService: BrandService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    // Load brands first to map names
    this.brandService.getBrands().subscribe((brands) => {
      this.brands = brands;
      this.loadModels();
    });
  }

  loadModels() {
    this.modelService.getModels().subscribe({
      next: (data) => {
        this.models = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.toastr.error("Failed to load models");
      },
    });
  }

  getBrandName(brandId: string): string {
    const brand = this.brands.find((b) => b.brandId === brandId);
    return brand ? brand.brandName : "Unknown";
  }

  deleteModel(id: string) {
    if (confirm("Are you sure you want to delete this model?")) {
      this.modelService.deleteModel(id).subscribe({
        next: () => {
          this.toastr.warning("Model Deleted Successfully");
          this.loadModels();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error("Failed to delete model");
        }
      });
    }
  }
}

