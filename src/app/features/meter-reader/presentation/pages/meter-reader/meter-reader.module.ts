import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeterReaderPageRoutingModule } from './meter-reader-routing.module';

import { MeterReaderPage } from './meter-reader.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeterReaderPageRoutingModule
  ],
  declarations: [MeterReaderPage]
})
export class MeterReaderPageModule {}
