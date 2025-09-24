import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, catchError, finalize } from 'rxjs/operators';
import { UserEntity, UserResponse } from '../../domain/entities/user.entity';
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.usecase';
import { GetUsersUseCase } from '../../application/use-cases/get-users.usecase';
import { UserFormComponent } from '../components/user-form/user-form.component';
import { UserFormData } from '../../application/dto/user.dto';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: false
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
  isFormVisible = false;
  selectedUser?: UserEntity | null = null;
  totalPages = 1;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private createUserUseCase: CreateUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private getUsersUseCase: GetUsersUseCase
  ) {}

  ngOnInit() {
    this.initializeObservables();
  }

  private initializeObservables() {
    const page$ = this.currentPageSubject.asObservable();
    const search$ = this.searchQuerySubject.asObservable();

    this.users$ = combineLatest([page$, search$]).pipe(
      switchMap(([page, search]) =>
        this.getUsersUseCase.execute(page, 10).pipe(
          map((response: UserResponse) => response.rows),
          catchError(error => {
            console.error('Error loading users:', error);
            return of([]);
          })
        )
      )
    );

    this.pagination$ = combineLatest([page$, search$]).pipe(
      switchMap(([page, search]) =>
        this.getUsersUseCase.execute(page, 10)
      ),
      map((response: UserResponse) => ({
        totalCount: response.pagination.total,
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.lastPage
      }))
    );

    this.pagination$.subscribe(pagination => {
      if (pagination) {
        this.totalPages = pagination.totalPages;
      }
    });
  }

  async onCreateUser() {
    this.selectedUser = null;
    await this.openUserModal();
  }

  async onEditUser(user: UserEntity) {
    this.selectedUser = user;
    console.log('Editing user:', user);
    await this.openUserModal();
  }

  private async openUserModal() {
    const modal = await this.modalController.create({
      component: UserFormComponent,
      componentProps: {
        user: this.selectedUser
      },
      breakpoints: [0, 0.8, 1],
      initialBreakpoint: 0.8
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data?.submitted) {
        await this.handleFormSubmit(result.data.formData);
      }
    });

    await modal.present();
  }

  private async handleFormSubmit(formData: UserFormData) {
    this.isLoading$.next(true);

    const loading = await this.loadingController.create({
      message: this.selectedUser ? 'Updating user...' : 'Creating user...'
    });
    await loading.present();

    let request$: Observable<UserEntity>;

    console.log('Form Data Submitted:', formData);

    if (this.selectedUser) {
      request$ = this.updateUserUseCase.execute(
        this.selectedUser.id!,
        formData,
        this.selectedUser
      );
    } else {
      request$ = this.createUserUseCase.execute(formData);
    }

    request$.pipe(
      finalize(async () => {
        this.isLoading$.next(false);
        await loading.dismiss();
      })
    ).subscribe({
      next: (user: UserEntity) => {
        this.refreshUsers();
        this.modalController.dismiss();
        this.showSuccessMessage(this.selectedUser ? 'User updated successfully' : 'User created successfully');
        this.selectedUser = null;
      },
      error: (error) => {
        console.error('Error saving user:', error);
        this.showErrorMessage(error.message || `Failed to ${this.selectedUser ? 'update' : 'create'} user`);
      }
    });
  }

  async onDeleteUser(userId: number) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.handleDeleteUser(userId)
        }
      ]
    });

    await alert.present();
  }

  private async handleDeleteUser(userId: number) {
    this.isLoading$.next(true);

    // Note: You'll need to inject the repository or use case for delete operation
    // For now, this is a placeholder - implement according to your needs
    setTimeout(() => {
      this.isLoading$.next(false);
      this.refreshUsers();
      this.showSuccessMessage('User deleted successfully');
    }, 1000);
  }

  onPageChange(page: number) {
    this.currentPageSubject.next(page);
  }

  onSearch(query: string) {
    this.searchQuerySubject.next(query);
    this.currentPageSubject.next(1);
  }

  private refreshUsers() {
    this.currentPageSubject.next(this.currentPageSubject.value);
  }

  private async showSuccessMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }

  private async showErrorMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'top'
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
