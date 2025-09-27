import { Component, EventEmitter, Input, Output } from '@angular/core';
import { STATUS } from '../../../../../core/constants/api.constants';
import { MeterEntity } from 'src/app/features/meter/domain/entities/meter.entity';

// Import types from constants - no need to redefine
export type Status = typeof STATUS[keyof typeof STATUS];

@Component({
  selector: 'app-reader-meter-list',
  templateUrl: './reader-meter-list.component.html',
  styleUrls: ['./reader-meter-list.component.scss'],
  standalone: false
})
export class ReaderMeterListComponent {
  @Input() meters: MeterEntity[] = [];
  @Input() isLoading = false;
  @Input() totalCount = 0;
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();
  @Output() search = new EventEmitter<string>();

  searchQuery = '';
  statuses = Object.values(STATUS);

  trackByMeterId(index: number, meter: MeterEntity): number {
    return meter.id!;
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

  // Helper method to check if meter is active
  isMeterActive(meter: MeterEntity): boolean {
    return meter.isActive();
  }
}
