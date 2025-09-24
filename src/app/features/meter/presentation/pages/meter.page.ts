import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, catchError, finalize } from 'rxjs/operators';
import { MeterEntity, MeterResponse } from '../../domain/entities/meter.entity';
import { CreateMeterUseCase } from '../../application/use-cases/create-meter.usecase';
import { UpdateMeterUseCase } from '../../application/use-cases/update-meter.usecase';
import { GetMetersUseCase } from '../../application/use-cases/get-meters.usecase';
import { DeleteMeterUseCase } from '../../application/use-cases/delete-meter.usecase';
import { MeterFormComponent } from '../components/meter-form/meter-form.component';
import { MeterFormData } from '../../application/dto/meter.dto';

// Define type for backend validation errors
interface ValidationErrors {
  [key: string]: string[];
}

@Component({
  selector: 'app-meter',
  templateUrl: './meter.page.html',
  styleUrls: ['./meter.page.scss'],
  standalone: false,
})
export class MeterPage implements OnInit {
  private currentPageSubject = new BehaviorSubject<number>(1);
  private searchQuerySubject = new BehaviorSubject<string>('');

  meters$!: Observable<MeterEntity[]>;
  pagination$!: Observable<{
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>;
  isLoading$ = new BehaviorSubject<boolean>(false);
  selectedMeter?: MeterEntity | null = null;
  totalPages = 1;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private createMeterUseCase: CreateMeterUseCase,
    private updateMeterUseCase: UpdateMeterUseCase,
    private getMetersUseCase: GetMetersUseCase,
    private deleteMeterUseCase: DeleteMeterUseCase
  ) {}

  ngOnInit() {
    console.log('MeterPage initialized'); // Debug log
    this.initializeObservables();
  }

  private initializeObservables() {
    const page$ = this.currentPageSubject.asObservable();
    const search$ = this.searchQuerySubject.asObservable();

    console.log('Initializing meter observables'); // Debug log

    this.meters$ = combineLatest([page$, search$]).pipe(
      switchMap(([page, search]) => {
        console.log('Fetching meters - page:', page, 'search:', search); // Debug log
        return this.getMetersUseCase.execute(page, 10).pipe(
          map((response: MeterResponse) => {
            console.log('Meters loaded:', response.rows.length); // Debug log
            return response.rows;
          }),
          catchError((error) => {
            console.error('Error loading meters:', error);
            this.showErrorMessage('Failed to load meters');
            return of([]);
          })
        );
      })
    );

    this.pagination$ = combineLatest([page$, search$]).pipe(
      switchMap(([page, search]) => this.getMetersUseCase.execute(page, 10)),
      map((response: MeterResponse) => ({
        totalCount: response.pagination.total,
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.lastPage,
      }))
    );

    this.pagination$.subscribe((pagination) => {
      if (pagination) {
        this.totalPages = pagination.totalPages;
        console.log('Pagination updated:', pagination); // Debug log
      }
    });
  }

  async onCreateMeter() {
    console.log('Create meter clicked'); // Debug log
    this.selectedMeter = null;
    await this.openMeterModal();
  }

  async onEditMeter(meter: MeterEntity) {
    console.log('Edit meter clicked:', meter.id); // Debug log
    this.selectedMeter = meter;
    await this.openMeterModal();
  }

  private async openMeterModal() {
    console.log('Opening meter modal'); // Debug log
    const modal = await this.modalController.create({
      component: MeterFormComponent,
      componentProps: {
        meter: this.selectedMeter,
        isLoading: this.isLoading$.value,
      },
      breakpoints: [0, 0.8, 1],
      initialBreakpoint: 0.8,
    });

    modal.onDidDismiss().then(async (result) => {
      console.log('Modal dismissed:', result); // Debug log
      if (result.data?.submitted) {
        await this.handleFormSubmit(result.data.formData, modal);
      }
    });

    await modal.present();
  }

  private async handleFormSubmit(
    formData: MeterFormData,
    modal: HTMLIonModalElement
  ) {
    console.log('Handling form submit:', formData); // Debug log
    this.isLoading$.next(true);

    const loading = await this.loadingController.create({
      message: this.selectedMeter ? 'Updating meter...' : 'Creating meter...',
    });
    await loading.present();

    let request$: Observable<MeterEntity>;

    if (this.selectedMeter) {
      request$ = this.updateMeterUseCase.execute(
        this.selectedMeter.id!,
        formData,
        this.selectedMeter
      );
    } else {
      request$ = this.createMeterUseCase.execute(formData);
    }

    request$
      .pipe(
        finalize(async () => {
          this.isLoading$.next(false);
          await loading.dismiss();
        })
      )
      .subscribe({
        next: (meter: MeterEntity) => {
          console.log('Meter saved successfully:', meter); // Debug log
          this.refreshMeters();
          modal.dismiss(); // Dismiss modal only on success
          this.showSuccessMessage(
            this.selectedMeter
              ? 'Meter updated successfully'
              : 'Meter created successfully'
          );
          this.selectedMeter = null;
        },
        error: (error) => {
          console.error('Error saving meter:', error); // Debug log
          // Parse backend validation errors with proper typing
          const errorMessage =
            error.message ||
            `Failed to ${this.selectedMeter ? 'update' : 'create'} meter`;
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
          // Keep modal open to allow meter to correct errors
        },
      });
  }

  async onDeleteMeter(meterId: number) {
    console.log('Delete meter clicked:', meterId); // Debug log
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message:
        'Are you sure you want to delete this meter? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.handleDeleteMeter(meterId),
        },
      ],
    });

    await alert.present();
  }

  private async handleDeleteMeter(meterId: number) {
    console.log('Processing delete for meter:', meterId); // Debug log
    this.isLoading$.next(true);

    const loading = await this.loadingController.create({
      message: 'Deleting meter...',
    });
    await loading.present();

    // TODO: Implement actual delete using MeterApiRepository
    setTimeout(() => {
      let request$: Observable<void>;

      request$ = this.deleteMeterUseCase.execute(meterId);

      request$
        .pipe(
          finalize(async () => {
            this.isLoading$.next(false);
            await loading.dismiss();
          })
        )
        .subscribe({
          next: () => {
            console.log('Meter deleted successfully'); // Debug log
            this.refreshMeters();
            this.showSuccessMessage('Meter deleted successfully');
            this.isLoading$.next(false);
          },
          error: (error) => {
            console.error('Error saving meter:', error); // Debug log
            const errorMessage = error.message || 'Failed to delete meter';
            this.showErrorMessage(errorMessage);
          },
        });
    }, 1000);
  }

  onPageChange(page: number) {
    console.log('Page changed to:', page); // Debug log
    this.currentPageSubject.next(page);
  }

  onSearch(query: string) {
    console.log('Search query:', query); // Debug log
    this.searchQuerySubject.next(query);
    this.currentPageSubject.next(1);
  }

  private refreshMeters() {
    console.log('Refreshing meters'); // Debug log
    this.currentPageSubject.next(this.currentPageSubject.value);
  }

  private async showSuccessMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success',
      position: 'top',
    });
    await toast.present();
  }

  private async showErrorMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 5000, // Longer duration for detailed errors
      color: 'danger',
      position: 'top',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }

  get getPageNumbers(): number[] {
    const current = this.currentPageSubject.value;
    const total = 5;
    const half = Math.floor(total / 2);

    let start = Math.max(1, current - half);
    let end = Math.min(start + total - 1, this.totalPages);

    if (end - start + 1 < total) {
      start = Math.max(1, end - total + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
}
