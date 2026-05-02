import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sk-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sk-card.component.html',
  styleUrl: './sk-card.component.css',
})
export class SkCardComponent {
  /** Visual variant of the card surface */
  @Input() variant: 'default' | 'blue' | 'purple' | 'inset' = 'default';
}
