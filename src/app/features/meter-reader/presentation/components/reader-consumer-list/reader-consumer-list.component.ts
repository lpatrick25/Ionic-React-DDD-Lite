import { Component, EventEmitter, Input, Output } from '@angular/core';
import { STATUS } from '../../../../../core/constants/api.constants';
import { ConsumerEntity } from 'src/app/features/consumer/domain/entities/consumer.entity';

// Import types from constants - no need to redefine
export type Status = (typeof STATUS)[keyof typeof STATUS];

@Component({
  selector: 'app-reader-consumer-list',
  templateUrl: './reader-consumer-list.component.html',
  styleUrls: ['./reader-consumer-list.component.scss'],
  standalone: false
})
export class ReaderConsumerListComponent {
  @Input() consumers: ConsumerEntity[] = [];
  @Input() isLoading = false;
  @Input() totalCount = 0;
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();
  @Output() search = new EventEmitter<string>();

  searchQuery = '';
  statuses = Object.values(STATUS);

  trackByConsumerId(index: number, consumer: ConsumerEntity): number {
    return consumer.id!;
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

  // Helper method to get display status
  getDisplayStatus(status: Status): string {
    return status;
  }

  // Helper method to check if consumer is active
  isConsumerActive(consumer: ConsumerEntity): boolean {
    return consumer.isActive(); // Fix: Now available on Consumer interface via ConsumerEntity
  }
}
