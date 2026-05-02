import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sk-feature-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sk-feature-card.html',
  styleUrl: './sk-feature-card.css',
})
export class SkFeatureCardComponent {
  /** Colour variant for the icon chip background tint */
  @Input() iconVariant: 'yellow' | 'green' | 'purple' = 'yellow';

  /** Card heading text */
  @Input() title: string = '';
}
