import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-billing-exists-modal',
  templateUrl: './billing-exists-modal.component.html',
  styleUrls: ['./billing-exists-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
})
export class BillingExistsModalComponent {
  @Input() message: string = ''; // e.g., "Billing already exists for the latest reading."
  @Input() meterDetails?: {
    meterNumber: string;
    consumerName: string;
    accountNumber: string;
    previousReading: number;
  };

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
