import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sk-ribbon-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sk-ribbon-card.html',
  styleUrl: './sk-ribbon-card.css',
})
export class SkRibbonCardComponent {
  /**
   * Text label to display in the ribbon tab.
   * When null or empty string, no ribbon is rendered.
   */
  @Input() ribbonLabel: string | null = null;

  /** Colour variant for the ribbon tab */
  @Input() ribbonVariant: 'yellow' | 'green' | 'purple' | 'blue' | 'red' = 'yellow';
}
