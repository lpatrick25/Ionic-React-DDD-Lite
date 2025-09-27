import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReaderMeterPage } from './reader-meter.page';

const routes: Routes = [
  {
    path: '',
    component: ReaderMeterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReaderMeterPageRoutingModule {}
