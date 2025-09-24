import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-shared-button',
  template: `
    <ion-button
      [type]="type"
      [expand]="expand"
      [fill]="fill"
      [color]="color"
      [disabled]="disabled"
      [loading]="loading"
      (click)="onClick()"
      *ngIf="!loading || showSpinner">
      <ion-icon [name]="icon" slot="start" *ngIf="icon"></ion-icon>
      <ion-spinner *ngIf="loading && showSpinner" name="crescent" slot="start"></ion-spinner>
      <ng-content></ng-content>
    </ion-button>
  `
})
export class SharedButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() expand: 'block' | 'full' = 'block';
  @Input() fill: 'solid' | 'clear' | 'outline' | 'default' = 'solid';
  @Input() color: string = 'primary';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() icon?: string;
  @Input() showSpinner = true;

  @Output() buttonClick = new EventEmitter<void>();

  onClick() {
    this.buttonClick.emit();
  }
}
