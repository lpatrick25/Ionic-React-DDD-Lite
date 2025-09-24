import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, catchError, finalize } from 'rxjs/operators';
import { UserEntity, UserResponse } from '../../domain/entities/user.entity';
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.usecase';
import { GetUsersUseCase } from '../../application/use-cases/get-users.usecase';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.usecase';
import { UserFormComponent } from '../components/user-form/user-form.component';
import { UserFormData } from '../../application/dto/user.dto';

// Define type for backend validation errors
interface ValidationErrors {
  [key: string]: string[];
}

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: false,
})
export class UserPage implements OnInit {
  private currentPageSubject = new BehaviorSubject<number>(1);
  private searchQuerySubject = new BehaviorSubject<string>('');

  users$!: Observable<UserEntity[]>;
  pagination$!: Observable<{
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>;
  isLoading$ = new BehaviorSubject<boolean>(false);
  selectedUser?: UserEntity | null = null;
  totalPages = 1;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private createUserUseCase: CreateUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private getUsersUseCase: GetUsersUseCase,
    private deleteUserUseCase: DeleteUserUseCase
  ) {}

  ngOnInit() {
    console.log('UserPage initialized'); // Debug log
    this.initializeObservables();
  }

  private initializeObservables() {
    const page$ = this.currentPageSubject.asObservable();
    const search$ = this.searchQuerySubject.asObservable();

    console.log('Initializing user observables'); // Debug log

    this.users$ = combineLatest([page$, search$]).pipe(
      switchMap(([page, search]) => {
        console.log('Fetching users - page:', page, 'search:', search); // Debug log
        return this.getUsersUseCase.execute(page, 10).pipe(
          map((response: UserResponse) => {
            console.log('Users loaded:', response.rows.length); // Debug log
            return response.rows;
          }),
          catchError((error) => {
            console.error('Error loading users:', error);
            this.showErrorMessage('Failed to load users');
            return of([]);
          })
        );
      })
    );

    this.pagination$ = combineLatest([page$, search$]).pipe(
      switchMap(([page, search]) => this.getUsersUseCase.execute(page, 10)),
      map((response: UserResponse) => ({
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

  async onCreateUser() {
    console.log('Create user clicked'); // Debug log
    this.selectedUser = null;
    await this.openUserModal();
  }

  async onEditUser(user: UserEntity) {
    console.log('Edit user clicked:', user.id); // Debug log
    this.selectedUser = user;
    await this.openUserModal();
  }

  private async openUserModal() {
    console.log('Opening user modal'); // Debug log
    const modal = await this.modalController.create({
      component: UserFormComponent,
      componentProps: {
        user: this.selectedUser,
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
    formData: UserFormData,
    modal: HTMLIonModalElement
  ) {
    console.log('Handling form submit:', formData); // Debug log
    this.isLoading$.next(true);

    const loading = await this.loadingController.create({
      message: this.selectedUser ? 'Updating user...' : 'Creating user...',
    });
    await loading.present();

    let request$: Observable<UserEntity>;

    if (this.selectedUser) {
      request$ = this.updateUserUseCase.execute(
        this.selectedUser.id!,
        formData,
        this.selectedUser
      );
    } else {
      request$ = this.createUserUseCase.execute(formData);
    }

    request$
      .pipe(
        finalize(async () => {
          this.isLoading$.next(false);
          await loading.dismiss();
        })
      )
      .subscribe({
        next: (user: UserEntity) => {
          console.log('User saved successfully:', user); // Debug log
          this.refreshUsers();
          modal.dismiss(); // Dismiss modal only on success
          this.showSuccessMessage(
            this.selectedUser
              ? 'User updated successfully'
              : 'User created successfully'
          );
          this.selectedUser = null;
        },
        error: (error) => {
          console.error('Error saving user:', error); // Debug log
          // Parse backend validation errors with proper typing
          const errorMessage =
            error.message ||
            `Failed to ${this.selectedUser ? 'update' : 'create'} user`;
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
          // Keep modal open to allow user to correct errors
        },
      });
  }

  async onDeleteUser(userId: number) {
    console.log('Delete user clicked:', userId); // Debug log
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message:
        'Are you sure you want to delete this user? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.handleDeleteUser(userId),
        },
      ],
    });

    await alert.present();
  }

  private async handleDeleteUser(userId: number) {
    console.log('Processing delete for user:', userId); // Debug log
    this.isLoading$.next(true);

    const loading = await this.loadingController.create({
      message: 'Deleting user...',
    });
    await loading.present();

    // TODO: Implement actual delete using UserApiRepository
    setTimeout(() => {
      let request$: Observable<void>;

      request$ = this.deleteUserUseCase.execute(userId);

      request$
        .pipe(
          finalize(async () => {
            this.isLoading$.next(false);
            await loading.dismiss();
          })
        )
        .subscribe({
          next: () => {
            console.log('User deleted successfully'); // Debug log
            this.refreshUsers();
            this.showSuccessMessage('User deleted successfully');
            this.isLoading$.next(false);
          },
          error: (error) => {
            console.error('Error saving user:', error); // Debug log
            const errorMessage = error.message || 'Failed to delete user';
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

  private refreshUsers() {
    console.log('Refreshing users'); // Debug log
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
