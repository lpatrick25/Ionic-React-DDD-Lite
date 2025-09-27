import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReaderMeterPage } from './reader-meter.page';

describe('ReaderMeterPage', () => {
  let component: ReaderMeterPage;
  let fixture: ComponentFixture<ReaderMeterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReaderMeterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
