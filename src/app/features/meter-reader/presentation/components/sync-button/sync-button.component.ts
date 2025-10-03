import { Component } from '@angular/core';
import { SyncDataUseCase } from '../../../application/use-cases/sync-data.usecase';
import {
  IonicModule,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { SQLiteService } from '../../../infrastructure/services/SQLiteService';

@Component({
  selector: 'app-sync-button',
  templateUrl: './sync-button.component.html',
  styleUrls: ['./sync-button.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class SyncButtonComponent {
  constructor(
    private syncDataUseCase: SyncDataUseCase,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private sqliteService: SQLiteService
  ) {}

  async sync() {
    const loading = await this.loadingController.create({
      message: 'Syncing data...',
      spinner: 'crescent',
    });

    await loading.present();

    if (Capacitor.getPlatform() === 'web') {
      const toast = await this.toastController.create({
        message: 'Sync not supported on Web',
        duration: 2000,
        color: 'warning',
      });
      await toast.present();
      await loading.dismiss();
      return;
    }

    try {
      console.log('[SyncButton] Starting sync...');

      await this.syncDataUseCase.execute();

      console.log('[SyncButton] Sync completed successfully');

      const toast = await this.toastController.create({
        message: 'Data synchronized successfully',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    } catch (error: unknown) {
      console.error('[SyncButton] Full error object:', error);

      let errMsg: string;

      if (error instanceof Error) {
        errMsg = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errMsg = JSON.stringify(error);
      } else {
        errMsg = String(error);
      }

      console.log('[SyncButton] Parsed error message:', errMsg);

      const toast = await this.toastController.create({
        message: 'Sync failed: ' + errMsg,
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    } finally {
      console.log(
        '[SyncButton] Sync finished (success or fail). Closing loader.'
      );
      await loading.dismiss();
    }
  }
}
