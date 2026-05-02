import { Component, Input } from '@angular/core';

@Component({
  selector: 'sk-eyebrow-pill',
  standalone: true,
  imports: [],
  templateUrl: './sk-eyebrow-pill.html',
  styleUrl: './sk-pill-tag.css',
})
export class SkEyebrowPillComponent {
  @Input() label = '';
}
