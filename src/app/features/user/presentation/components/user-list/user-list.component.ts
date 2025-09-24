import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserEntity } from '../../../domain/entities/user.entity';
import { ROLES, STATUS } from '../../../../../core/constants/api.constants';

// Import types from constants - no need to redefine
export type Role = typeof ROLES[keyof typeof ROLES];
export type Status = typeof STATUS[keyof typeof STATUS];

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: false
})
export class UserListComponent {
  @Input() users: UserEntity[] = [];
  @Input() isLoading = false;
  @Input() totalCount = 0;
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() editUser = new EventEmitter<UserEntity>();
  @Output() deleteUser = new EventEmitter<number>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() search = new EventEmitter<string>();

  searchQuery = '';
  roles = Object.values(ROLES); // Fix: Use ROLES const object directly
  statuses = Object.values(STATUS); // Fix: Use STATUS const object directly

  trackByUserId(index: number, user: UserEntity): number {
    return user.id!;
  }

  onEditUser(user: UserEntity) {
    this.editUser.emit(user);
  }

  onDeleteUser(userId: number) {
    this.deleteUser.emit(userId);
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  onSearch() {
    this.search.emit(this.searchQuery);
  }

  clearSearch() {
    this.searchQuery = '';
    this.search.emit('');
  }

  getStatusColor(status: Status): string {
    return status === 'Active' ? 'success' : 'danger';
  }

  getRoleColor(role: Role): string {
    switch (role) {
      case ROLES.ADMIN: return 'primary'; // Fix: Use ROLES.ADMIN
      case ROLES.HEAD: return 'warning'; // Fix: Use ROLES.HEAD
      case ROLES.CASHIER: return 'secondary'; // Fix: Use ROLES.CASHIER
      case ROLES.METER_READER: return 'medium'; // Fix: Use ROLES.METER_READER
      default: return 'tertiary';
    }
  }

  // Helper method to get display status
  getDisplayStatus(status: Status): string {
    return status;
  }

  // Helper method to check if user is active
  isUserActive(user: UserEntity): boolean {
    return user.isActive(); // Fix: Now available on User interface via UserEntity
  }
}
