import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeterPage } from './meter.page';

const routes: Routes = [
  {
    path: '',
    component: MeterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeterPageRoutingModule {}
