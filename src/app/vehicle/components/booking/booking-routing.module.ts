import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingListComponent } from './booking-list/booking-list.component';
import { AddBookingComponent } from './add-booking/add-booking.component';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { EditBookingComponent } from './edit-booking/edit-booking.component';

const routes: Routes = [
  { path: '', component: BookingListComponent },
  { path: 'add', component: AddBookingComponent },
  { path: 'detail/:id', component: BookingDetailComponent },
  { path: 'edit/:id', component: EditBookingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule {}
