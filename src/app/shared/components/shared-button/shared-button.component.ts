import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-shared-button',
  templateUrl: './shared-button.component.html',
  styleUrls: ['./shared-button.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonSpinner, CommonModule],
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
