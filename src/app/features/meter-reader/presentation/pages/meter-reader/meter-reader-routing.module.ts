import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeterReaderPage } from './meter-reader.page';

const routes: Routes = [
  {
    path: '',
    component: MeterReaderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeterReaderPageRoutingModule {}
