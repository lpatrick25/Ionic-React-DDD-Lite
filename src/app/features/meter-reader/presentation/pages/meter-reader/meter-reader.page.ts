import { Component, NgZone, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ModalController, ToastController } from '@ionic/angular';
import { GetConsumersUseCase } from 'src/app/features/consumer/application/use-cases/get-consumers.usecase';
import { ConsumerResponse } from 'src/app/features/consumer/domain/entities/consumer.entity';
import { GetMetersUseCase } from 'src/app/features/meter/application/use-cases/get-meters.usecase';
import { MeterResponse } from 'src/app/features/meter/domain/entities/meter.entity';
import { CapacitorThermalPrinter } from 'capacitor-thermal-printer';
import { SearchPrinterComponent } from '../../components/search-printer/search-printer.component';

@Component({
  selector: 'app-meter-reader',
  templateUrl: './meter-reader.page.html',
  styleUrls: ['./meter-reader.page.scss'],
  standalone: false,
})
export class MeterReaderPage implements OnInit {
  totalConsumers = 0;
  totalMeters = 0;
  devices: any = [];
  isScanning = false;
  isConnected = false;

  constructor(
    private getConsumersUseCase: GetConsumersUseCase,
    private getMetersUseCase: GetMetersUseCase,
    private zone: NgZone,
    private toastController: ToastController,
    private modalController: ModalController
  ) {
    if (Capacitor.getPlatform() !== 'web') {
      CapacitorThermalPrinter.addListener(
        'discoverDevices',
        ({ devices }: { devices: any }) => {
          this.zone.run(() => {
            this.devices = devices;
          });
        }
      );

      CapacitorThermalPrinter.addListener('connected', async () => {
        this.zone.run(() => {
          this.isConnected = true;
        });
        const toast = await this.toastController.create({
          message: 'Connected to Water Meter!',
          duration: 1500,
          position: 'bottom',
          color: 'success',
        });
        await toast.present();
      });

      CapacitorThermalPrinter.addListener('disconnected', async () => {
        this.zone.run(() => {
          this.isConnected = false;
        });
        const toast = await this.toastController.create({
          message: 'Disconnected!',
          duration: 1500,
          position: 'bottom',
          color: 'warning',
        });
        await toast.present();
      });

      CapacitorThermalPrinter.addListener('discoveryFinish', () => {
        this.zone.run(() => {
          this.isScanning = false;
        });
      });
    }
  }

  ngOnInit() {
    this.loadTotalConsumers();
    this.loadTotalMeters();
  }

  private loadTotalConsumers() {
    this.getConsumersUseCase.execute(1, 1).subscribe({
      next: (response: ConsumerResponse) => {
        this.totalConsumers = response.pagination.total;
      },
      error: (err) => {
        console.error('Failed to load consumers total:', err);
      },
    });
  }

  private loadTotalMeters() {
    this.getMetersUseCase.execute(1, 1).subscribe({
      next: (response: MeterResponse) => {
        this.totalMeters = response.pagination.total;
      },
      error: (err) => {
        console.error('Failed to load meters total:', err);
      },
    });
  }

  async connectDevice(device: any) {
    if (Capacitor.getPlatform() === 'web') {
      console.warn('Thermal printer not available on web');
      return;
    }
    await CapacitorThermalPrinter.connect({ address: device.address });
  }

  startScan() {
    if (Capacitor.getPlatform() === 'web') {
      console.warn('Thermal printer scan not available on web');
      return;
    }
    if (this.isScanning) return;
    this.devices = [];
    CapacitorThermalPrinter.startScan().then(() => (this.isScanning = true));
  }

  stopScan() {
    if (Capacitor.getPlatform() === 'web') return;
    CapacitorThermalPrinter.stopScan();
  }

  disconnect() {
    if (Capacitor.getPlatform() === 'web') return;
    CapacitorThermalPrinter.disconnect();
  }

  async presentSearchModal() {
    const modal = await this.modalController.create({
      component: SearchPrinterComponent,
      cssClass: 'search-modal',
    });
    await modal.present();
  }
}
