import { Component, OnInit } from '@angular/core';
import {
  ToastController,
} from '@ionic/angular';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { GetConsumersUseCase } from 'src/app/features/consumer/application/use-cases/get-consumers.usecase';
import { ConsumerEntity, ConsumerResponse } from 'src/app/features/consumer/domain/entities/consumer.entity';

@Component({
  selector: 'app-reader-consumer',
  templateUrl: './reader-consumer.page.html',
  styleUrls: ['./reader-consumer.page.scss'],
  standalone: false,
})
export class ReaderConsumerPage implements OnInit {
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
    private toastController: ToastController,
    private getConsumersUseCase: GetConsumersUseCase,
  ) {}

  ngOnInit() {
    console.log('ConsumerPage initialized');
    this.initializeObservables();
  }

  private initializeObservables() {
    const page$ = this.currentPageSubject.asObservable();
    const search$ = this.searchQuerySubject.asObservable();

    console.log('Initializing consumer observables');

    this.consumers$ = combineLatest([page$, search$]).pipe(
      switchMap(([page, search]) => {
        console.log('Fetching consumers - page:', page, 'search:', search);
        return this.getConsumersUseCase.execute(page, 10).pipe(
          map((response: ConsumerResponse) => {
            console.log('Consumers loaded:', response.rows.length);
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
        console.log('Pagination updated:', pagination);
      }
    });
  }

  onPageChange(page: number) {
    console.log('Page changed to:', page);
    this.currentPageSubject.next(page);
  }

  onSearch(query: string) {
    console.log('Search query:', query);
    this.searchQuerySubject.next(query);
    this.currentPageSubject.next(1);
  }

  private async showErrorMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 5000, // Longer duration for detailed errors
      color: 'danger',
      position: 'bottom',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }

  refreshConsumers() {
    console.log('Refreshing consumers'); // Debug log
    this.currentPageSubject.next(this.currentPageSubject.value);
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
