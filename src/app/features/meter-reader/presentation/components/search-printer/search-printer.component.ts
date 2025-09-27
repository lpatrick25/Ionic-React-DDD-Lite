import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  IonicModule,
  ModalController,
  Platform,
  AlertController,
} from '@ionic/angular';
import { CapacitorThermalPrinter } from 'capacitor-thermal-printer';
import { NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-printer',
  templateUrl: './search-printer.component.html',
  styleUrls: ['./search-printer.component.scss'],
  standalone: true,
  imports: [FormsModule, IonicModule, CommonModule],
})
export class SearchPrinterComponent implements OnInit, OnDestroy {
  printers: any[] = [];
  filteredPrinters: any[] = [];
  isScanning = false;
  hideNoNameChecked = false;
  backButtonSub?: Subscription;

  constructor(
    private modalController: ModalController,
    private zone: NgZone,
    private platform: Platform,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Restore preference
    const savedPref = localStorage.getItem('hideNoName');
    this.hideNoNameChecked = savedPref === 'true';

    CapacitorThermalPrinter.addListener(
      'discoverDevices',
      ({
        devices,
      }: {
        devices: Array<{ name?: string; address?: string }>;
      }) => {
        this.zone.run(() => {
          this.printers = devices.map((device) => ({
            ...device,
            name: device.name || '',
            macAddress: device.address || '',
          }));
          this.applyFilter();
          this.isScanning = false;
        });
      }
    );

    this.backButtonSub = this.platform.backButton.subscribeWithPriority(
      10,
      () => {
        this.dismiss();
      }
    );
  }

  ngOnDestroy() {
    this.backButtonSub?.unsubscribe();
  }

  async scanPrinters() {
    if (this.isScanning) return;

    try {
      this.printers = [];
      this.filteredPrinters = [];
      this.isScanning = true;
      await CapacitorThermalPrinter.startScan();
    } catch (err) {
      this.isScanning = false;
      this.showBluetoothAlert();
    }
  }

  async connectPrinter(printer: any) {
    try {
      await CapacitorThermalPrinter.connect({
        address: printer.macAddress,
      });
      console.log('Connected to printer:', printer);

      printer.isConnected = true;

      // this.modalController.dismiss();
    } catch (err) {
      console.error('Connection failed:', err);
    }
  }

  async disconnectPrinter(printer: any) {
    try {
      await CapacitorThermalPrinter.disconnect();
      console.log('Disconnected from printer:', printer);

      printer.isConnected = false;
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  }

  toggleHideNoName(event: any) {
    this.hideNoNameChecked = event.detail.checked;
    localStorage.setItem('hideNoName', this.hideNoNameChecked.toString());
    this.applyFilter();
  }

  private applyFilter() {
    this.filteredPrinters = this.hideNoNameChecked
      ? this.printers.filter((p) => p.name && p.name.trim() !== '')
      : [...this.printers];
  }

  dismiss() {
    this.modalController.dismiss();
  }

  private async showBluetoothAlert() {
    const alert = await this.alertController.create({
      header: 'Bluetooth Disabled',
      message: 'Please enable Bluetooth to scan for printers.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  }
}
