import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReaderConsumerPage } from './reader-consumer.page';

describe('ReaderConsumerPage', () => {
  let component: ReaderConsumerPage;
  let fixture: ComponentFixture<ReaderConsumerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReaderConsumerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
