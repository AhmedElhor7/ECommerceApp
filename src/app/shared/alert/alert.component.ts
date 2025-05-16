import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  @Input() message: string = '';
  /**
  @description: The type of the alert
  @example: 'success' | 'danger' | 'warning' | 'info'
  */
  @Input() type: string = 'success';
}
