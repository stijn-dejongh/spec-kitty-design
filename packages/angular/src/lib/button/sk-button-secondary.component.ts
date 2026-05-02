import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sk-button-secondary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sk-button-secondary.component.html',
  styleUrl: './sk-button-secondary.component.css',
})
export class SkButtonSecondaryComponent {
  @Input() disabled: boolean = false;
  @Input() size: 'sm' | 'default' = 'default';
}
