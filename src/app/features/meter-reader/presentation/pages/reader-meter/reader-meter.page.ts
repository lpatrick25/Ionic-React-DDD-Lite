import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { GetMetersUseCase } from 'src/app/features/meter/application/use-cases/get-meters.usecase';
import {
  MeterEntity,
  MeterResponse,
} from 'src/app/features/meter/domain/entities/meter.entity';

@Component({
  selector: 'app-reader-meter',
  templateUrl: './reader-meter.page.html',
  styleUrls: ['./reader-meter.page.scss'],
  standalone: false,
})
export class ReaderMeterPage implements OnInit {
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
    private toastController: ToastController,
    private getMetersUseCase: GetMetersUseCase
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

  onPageChange(page: number) {
    console.log('Page changed to:', page); // Debug log
    this.currentPageSubject.next(page);
  }

  onSearch(query: string) {
    console.log('Search query:', query); // Debug log
    this.searchQuerySubject.next(query);
    this.currentPageSubject.next(1);
  }

  refreshMeters() {
    console.log('Refreshing meters'); // Debug log
    this.currentPageSubject.next(this.currentPageSubject.value);
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
