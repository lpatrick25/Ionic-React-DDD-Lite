import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MeterEntity } from '../../../domain/entities/meter.entity';
import { STATUS } from '../../../../../core/constants/api.constants';

// Import types from constants - no need to redefine
export type Status = typeof STATUS[keyof typeof STATUS];

@Component({
  selector: 'app-meter-list',
  templateUrl: './meter-list.component.html',
  styleUrls: ['./meter-list.component.scss'],
  standalone: false
})
export class MeterListComponent {
  @Input() meters: MeterEntity[] = [];
  @Input() isLoading = false;
  @Input() totalCount = 0;
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() editMeter = new EventEmitter<MeterEntity>();
  @Output() deleteMeter = new EventEmitter<number>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() search = new EventEmitter<string>();

  searchQuery = '';
  statuses = Object.values(STATUS); // Fix: Use STATUS const object directly

  trackByMeterId(index: number, meter: MeterEntity): number {
    return meter.id!;
  }

  onEditMeter(meter: MeterEntity) {
    this.editMeter.emit(meter);
  }

  onDeleteMeter(meterId: number) {
    this.deleteMeter.emit(meterId);
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
    return meter.isActive(); // Fix: Now available on Meter interface via MeterEntity
  }
}
