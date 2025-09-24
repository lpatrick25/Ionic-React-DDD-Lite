import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeterPageRoutingModule } from './meter-routing.module';

import { MeterPage } from './meter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeterPageRoutingModule
  ],
  declarations: [MeterPage]
})
export class MeterPageModule {}
