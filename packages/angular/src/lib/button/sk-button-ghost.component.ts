import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sk-button-ghost',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sk-button-ghost.component.html',
  styleUrls: ['./sk-button-ghost.component.css'],
})
export class SkButtonGhostComponent {
  @Input() disabled: boolean = false;
  @Input() size: 'sm' | 'default' = 'default';
}
