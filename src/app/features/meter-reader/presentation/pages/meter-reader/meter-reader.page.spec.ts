import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeterReaderPage } from './meter-reader.page';

describe('MeterReaderPage', () => {
  let component: MeterReaderPage;
  let fixture: ComponentFixture<MeterReaderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterReaderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
