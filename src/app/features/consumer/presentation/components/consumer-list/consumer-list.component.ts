import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConsumerEntity } from '../../../domain/entities/consumer.entity';
import { STATUS } from '../../../../../core/constants/api.constants';

export type Status = (typeof STATUS)[keyof typeof STATUS];

@Component({
  selector: 'app-consumer-list',
  templateUrl: './consumer-list.component.html',
  styleUrls: ['./consumer-list.component.scss'],
  standalone: false,
})
export class ConsumerListComponent {
  @Input() consumers: ConsumerEntity[] = [];
  @Input() isLoading = false;
  @Input() totalCount = 0;
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() editConsumer = new EventEmitter<ConsumerEntity>();
  @Output() deleteConsumer = new EventEmitter<number>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() search = new EventEmitter<string>();

  searchQuery = '';
  statuses = Object.values(STATUS);

  trackByConsumerId(index: number, consumer: ConsumerEntity): number {
    return consumer.id ?? index; // Safe handling of undefined id
  }

  onEditConsumer(consumer: ConsumerEntity) {
    this.editConsumer.emit(consumer);
  }

  onDeleteConsumer(consumerId: number) {
    this.deleteConsumer.emit(consumerId);
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

  getDisplayStatus(status: Status): string {
    return status;
  }

  isConsumerActive(consumer: ConsumerEntity): boolean {
    return consumer.isActive();
  }
}
