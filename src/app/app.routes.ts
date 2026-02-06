import { Routes } from "@angular/router";
export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./vehicle/components/vehicle/vehicle.module").then(
        (m) => m.VehicleModule,
      ),
  },
];
