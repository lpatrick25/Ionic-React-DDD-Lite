import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReaderMeterPageRoutingModule } from './reader-meter-routing.module';

import { ReaderMeterPage } from './reader-meter.page';
import { ReaderMeterListComponent } from '../../components/reader-meter-list/reader-meter-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReaderMeterPageRoutingModule,
  ],
  declarations: [ReaderMeterPage, ReaderMeterListComponent],
})
export class ReaderMeterPageModule {}
