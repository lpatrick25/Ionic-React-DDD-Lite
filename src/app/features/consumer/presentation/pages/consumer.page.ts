import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, catchError, finalize } from 'rxjs/operators';
import { ConsumerEntity, ConsumerResponse } from '../../domain/entities/consumer.entity';
import { CreateConsumerUseCase } from '../../application/use-cases/create-consumer.usecase';
import { UpdateConsumerUseCase } from '../../application/use-cases/update-consumer.usecase';
import { GetConsumersUseCase } from '../../application/use-cases/get-consumers.usecase';
import { DeleteConsumerUseCase } from '../../application/use-cases/delete-consumer.usecase';
import { ConsumerFormComponent } from '../components/consumer-form/consumer-form.component';
import { ConsumerFormData } from '../../application/dto/consumer.dto';

// Define type for backend validation errors
interface ValidationErrors {
  [key: string]: string[];
}

@Component({
  selector: 'app-consumer',
  templateUrl: './consumer.page.html',
  styleUrls: ['./consumer.page.scss'],
  standalone: false,
})
export class ConsumerPage implements OnInit {
  private currentPageSubject = new BehaviorSubject<number>(1);
  private searchQuerySubject = new BehaviorSubject<string>('');

  consumers$!: Observable<ConsumerEntity[]>;
  pagination$!: Observable<{
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>;
  isLoading$ = new BehaviorSubject<boolean>(false);
  selectedConsumer?: ConsumerEntity | null = null;
  totalPages = 1;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private createConsumerUseCase: CreateConsumerUseCase,
    private updateConsumerUseCase: UpdateConsumerUseCase,
    private getConsumersUseCase: GetConsumersUseCase,
    private deleteConsumerUseCase: DeleteConsumerUseCase
  ) {}

  ngOnInit() {
    console.log('ConsumerPage initialized'); // Debug log
    this.initializeObservables();
  }

  private initializeObservables() {
    const page$ = this.currentPageSubject.asObservable();
    const search$ = this.searchQuerySubject.asObservable();

    console.log('Initializing consumer observables'); // Debug log

    this.consumers$ = combineLatest([page$, search$]).pipe(
      switchMap(([page, search]) => {
        console.log('Fetching consumers - page:', page, 'search:', search); // Debug log
        return this.getConsumersUseCase.execute(page, 10).pipe(
          map((response: ConsumerResponse) => {
            console.log('Consumers loaded:', response.rows.length); // Debug log
            return response.rows;
          }),
          catchError((error) => {
            console.error('Error loading consumers:', error);
            this.showErrorMessage('Failed to load consumers');
            return of([]);
          })
        );
      })
    );

    this.pagination$ = combineLatest([page$, search$]).pipe(
      switchMap(([page, search]) => this.getConsumersUseCase.execute(page, 10)),
      map((response: ConsumerResponse) => ({
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

  async onCreateConsumer() {
    console.log('Create consumer clicked'); // Debug log
    this.selectedConsumer = null;
    await this.openConsumerModal();
  }

  async onEditConsumer(consumer: ConsumerEntity) {
    console.log('Edit consumer clicked:', consumer.id); // Debug log
    this.selectedConsumer = consumer;
    await this.openConsumerModal();
  }

  private async openConsumerModal() {
    console.log('Opening consumer modal'); // Debug log
    const modal = await this.modalController.create({
      component: ConsumerFormComponent,
      componentProps: {
        consumer: this.selectedConsumer,
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
    formData: ConsumerFormData,
    modal: HTMLIonModalElement
  ) {
    console.log('Handling form submit:', formData); // Debug log
    this.isLoading$.next(true);

    const loading = await this.loadingController.create({
      message: this.selectedConsumer ? 'Updating consumer...' : 'Creating consumer...',
    });
    await loading.present();

    let request$: Observable<ConsumerEntity>;

    if (this.selectedConsumer) {
      request$ = this.updateConsumerUseCase.execute(
        this.selectedConsumer.id!,
        formData,
        this.selectedConsumer
      );
    } else {
      request$ = this.createConsumerUseCase.execute(formData);
    }

    request$
      .pipe(
        finalize(async () => {
          this.isLoading$.next(false);
          await loading.dismiss();
        })
      )
      .subscribe({
        next: (consumer: ConsumerEntity) => {
          console.log('Consumer saved successfully:', consumer); // Debug log
          this.refreshConsumers();
          modal.dismiss(); // Dismiss modal only on success
          this.showSuccessMessage(
            this.selectedConsumer
              ? 'Consumer updated successfully'
              : 'Consumer created successfully'
          );
          this.selectedConsumer = null;
        },
        error: (error) => {
          console.error('Error saving consumer:', error); // Debug log
          // Parse backend validation errors with proper typing
          const errorMessage =
            error.message ||
            `Failed to ${this.selectedConsumer ? 'update' : 'create'} consumer`;
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
          // Keep modal open to allow consumer to correct errors
        },
      });
  }

  async onDeleteConsumer(consumerId: number) {
    console.log('Delete consumer clicked:', consumerId); // Debug log
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message:
        'Are you sure you want to delete this consumer? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.handleDeleteConsumer(consumerId),
        },
      ],
    });

    await alert.present();
  }

  private async handleDeleteConsumer(consumerId: number) {
    console.log('Processing delete for consumer:', consumerId); // Debug log
    this.isLoading$.next(true);

    const loading = await this.loadingController.create({
      message: 'Deleting consumer...',
    });
    await loading.present();

    // TODO: Implement actual delete using ConsumerApiRepository
    setTimeout(() => {
      let request$: Observable<void>;

      request$ = this.deleteConsumerUseCase.execute(consumerId);

      request$
        .pipe(
          finalize(async () => {
            this.isLoading$.next(false);
            await loading.dismiss();
          })
        )
        .subscribe({
          next: () => {
            console.log('Consumer deleted successfully'); // Debug log
            this.refreshConsumers();
            this.showSuccessMessage('Consumer deleted successfully');
            this.isLoading$.next(false);
          },
          error: (error) => {
            console.error('Error saving consumer:', error); // Debug log
            const errorMessage = error.message || 'Failed to delete consumer';
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

  private refreshConsumers() {
    console.log('Refreshing consumers'); // Debug log
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
