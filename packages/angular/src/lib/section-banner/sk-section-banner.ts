import { Component, Input } from '@angular/core';

@Component({
  selector: 'sk-section-banner',
  standalone: true,
  imports: [],
  templateUrl: './sk-section-banner.html',
  styleUrl: './sk-section-banner.css',
})
export class SkSectionBannerComponent {
  @Input() variant: 'neutral' | 'purple' | 'green' = 'neutral';
  @Input() label: string = '';
}
