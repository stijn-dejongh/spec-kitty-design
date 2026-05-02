import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sk-button-primary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sk-button-primary.component.html',
  styleUrl: './sk-button-primary.component.css',
})
export class SkButtonPrimaryComponent {
  @Input() disabled: boolean = false;
  @Input() size: 'sm' | 'default' = 'default';
}
