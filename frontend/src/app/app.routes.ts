import { Routes } from '@angular/router';
import { ParcelListComponent } from './parcel-list.component';
import { ParcelDetailComponent } from './parcel-detail.component';

export const routes: Routes = [
  { path: '', component: ParcelListComponent },
  { path: 'parcels/:id', component: ParcelDetailComponent },
  { path: '**', redirectTo: '' }
];
