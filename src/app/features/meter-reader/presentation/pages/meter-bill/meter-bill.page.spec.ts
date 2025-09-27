import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeterBillPage } from './meter-bill.page';

describe('MeterBillPage', () => {
  let component: MeterBillPage;
  let fixture: ComponentFixture<MeterBillPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterBillPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
