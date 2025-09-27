import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { CapacitorThermalPrinter } from 'capacitor-thermal-printer';
import { finalize } from 'rxjs/operators';
import { MeterBillDto } from '../../../application/dto/meter-bill.dto';
import { MeterBillUseCase } from '../../../application/use-cases/meter-bill.usecase';
import { MeterBillEntity } from '../../../domain/entities/meter-bill.entity';
import { MeterReadingFormComponent } from '../../components/meter-reading-form/meter-reading-form.component';
import { MeterReadingDto } from '../../../application/dto/meter-reading.dto';
import { MeterReadingEntity } from '../../../domain/entities/meter-reading.entity';
import { MeterReadingUseCase } from '../../../application/use-cases/meter-reading.usecase';
import { Capacitor } from '@capacitor/core';

// Define type for backend validation errors
interface ValidationErrors {
  [key: string]: string[];
}

@Component({
  selector: 'app-meter-bill',
  templateUrl: './meter-bill.page.html',
  styleUrls: ['./meter-bill.page.scss'],
  standalone: false,
})
export class MeterBillPage implements OnInit {
  isLoading$ = new BehaviorSubject<boolean>(false);
  meterBill?: MeterBillEntity | null = null;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private readingUseCase: MeterReadingUseCase,
    private meterUseCase: MeterBillUseCase
  ) {}

  ngOnInit() {
    console.log('MeterBillPage initialized');
  }

  async onSearch(formData: MeterBillDto) {
    console.log('Handling meter submit:', formData);
    this.isLoading$.next(true);

    const loading = await this.loadingController.create({
      message: 'Searching meter...',
    });
    await loading.present();

    this.meterUseCase
      .execute(formData)
      .pipe(
        finalize(async () => {
          this.isLoading$.next(false);
          await loading.dismiss();
        })
      )
      .subscribe({
        next: async (meter: MeterBillEntity) => {
          console.log('Meter found:', meter);
          this.showSuccessMessage('Meter found');

          this.meterBill = meter;
          await this.openMeterModal();
        },
        error: (error) => {
          console.error('Error saving meter:', error);
          // Parse backend validation errors with proper typing
          const errorMessage = error.message || `Failed to search meter`;
          const validationErrors = error.error?.errors as
            | ValidationErrors
            | undefined;

          let detailedMessage = errorMessage;
          if (validationErrors && Object.keys(validationErrors).length > 0) {
            detailedMessage +=
              ': ' +
              Object.entries(validationErrors)
                .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                .join('; ');
          }

          this.showErrorMessage(detailedMessage);
        },
      });
  }

  private async openMeterModal() {
    console.log('Opening meter modal'); // Debug log
    const modal = await this.modalController.create({
      component: MeterReadingFormComponent,
      componentProps: {
        meter: this.meterBill,
        isLoading: this.isLoading$.value,
      },
      breakpoints: [0, 0.8, 1],
      initialBreakpoint: 0.8,
    });

    modal.onDidDismiss().then(async (result) => {
      console.log('Modal dismissed:', result); // Debug log
      if (result.data?.submitted) {
        if (Capacitor.getPlatform() === 'web') {
          console.log('Printing receipt:', result.data?.formData);
          return;
        }

        try {
          const receiptText = `
            Customer   : ${result.data?.formData.concessionaireName}
            Account #  : ${result.data?.formData.accountNumber}
            Meter #    : ${result.data?.formData.meterNumber}
            -----------------------------
            Previous   : ${result.data?.formData.previousReading}
            Current    : ${result.data?.formData.currentReading}
            Consumption: ${result.data?.formData.consumption} cu.m.
            Amount Due : ${result.data?.formData.amountDue.toFixed(2)} PHP
            -----------------------------
            Date: ${new Date().toLocaleDateString()}
          `;

          await CapacitorThermalPrinter.begin()
            // Company Header
            .align('center')
            .bold()
            .text('MacArthur Waterworks\n')
            .text('System & Services\n')
            .text('Municipality of MacArthur\n')
            .text("Tel No's: 535-0147, 332-6345\n")
            .clearFormatting()
            .text('-----------------------------\n')

            // Title
            .doubleHeight()
            .bold()
            .text('WATER BILL RECEIPT\n\n')
            .clearFormatting()

            // Details
            .align('left')
            .text(receiptText + '\n')

            // QR Code for validation
            .align('center')
            .qr(`${result.data?.formData.accountNumber}-${Date.now()}`)

            // Footer
            .text('\nThank you for your payment!\n')
            .feedCutPaper()
            .write();

          this.showSuccessMessage('Bill printed successfully!');

        } catch (error) {
          this.showErrorMessage('Failed to print receipt. Please try again.');
          console.error('Error printing receipt:', error);
        }
      }
    });

    await modal.present();
  }

  onCancel() {
    console.log('Login cancelled');
    // e.g., redirect back to home or clear form
  }

  private async showSuccessMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success',
      position: 'bottom',
    });
    await toast.present();
  }

  private async showErrorMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      color: 'danger',
      position: 'bottom',
      buttons: [{ text: 'Close', role: 'cancel' }],
    });
    await toast.present();
  }
}
