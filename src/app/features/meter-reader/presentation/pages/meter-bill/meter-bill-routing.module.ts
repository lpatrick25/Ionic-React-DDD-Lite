import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeterBillPage } from './meter-bill.page';

const routes: Routes = [
  {
    path: '',
    component: MeterBillPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeterBillPageRoutingModule {}
