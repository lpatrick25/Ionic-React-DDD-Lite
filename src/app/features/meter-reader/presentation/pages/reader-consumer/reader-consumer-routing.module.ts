import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReaderConsumerPage } from './reader-consumer.page';

const routes: Routes = [
  {
    path: '',
    component: ReaderConsumerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReaderConsumerPageRoutingModule {}
