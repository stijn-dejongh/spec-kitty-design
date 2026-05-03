import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

export interface NavPillItem {
  label: string;
  href: string;
  active?: boolean;
}

@Component({
  selector: 'sk-nav-pill',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './sk-nav-pill.html',
  styleUrls: ['./sk-nav-pill.css', './sk-nav-pill-drawer.css'],
})
export class SkNavPillComponent {
  @Input() items: NavPillItem[] = [
    { label: 'Platform', href: '#' },
    { label: 'Getting Started', href: '#', active: true },
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
  ];

  @Input() ctaLabel = 'Book Demo';
  @Input() ctaHref: string | null = null;
  @Input() responsive = false;

  drawerOpen = false;

  toggleDrawer(): void {
    this.drawerOpen = !this.drawerOpen;
  }
}
