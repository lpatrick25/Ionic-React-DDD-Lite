import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReaderConsumerPageRoutingModule } from './reader-consumer-routing.module';

import { ReaderConsumerPage } from './reader-consumer.page';
import { ReaderConsumerListComponent } from '../../components/reader-consumer-list/reader-consumer-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReaderConsumerPageRoutingModule
  ],
  declarations: [ReaderConsumerPage, ReaderConsumerListComponent]
})
export class ReaderConsumerPageModule {}
