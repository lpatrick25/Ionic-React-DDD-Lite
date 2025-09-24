import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsumerPage } from './consumer.page';

describe('ConsumerPage', () => {
  let component: ConsumerPage;
  let fixture: ComponentFixture<ConsumerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
