import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export type PillTagVariant = 'default' | 'green' | 'purple' | 'breaking' | 'yellow';

@Component({
  selector: 'sk-pill-tag',
  standalone: true,
  imports: [NgClass],
  templateUrl: './sk-pill-tag.html',
  styleUrl: './sk-pill-tag.css',
})
export class SkPillTagComponent {
  @Input() variant: PillTagVariant = 'default';
  @Input() label = '';
}
