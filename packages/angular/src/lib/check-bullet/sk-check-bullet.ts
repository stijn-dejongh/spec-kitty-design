import { Component, Input } from '@angular/core';

@Component({
  selector: 'sk-check-bullet',
  standalone: true,
  imports: [],
  templateUrl: './sk-check-bullet.html',
  styleUrl: './sk-check-bullet.css',
})
export class SkCheckBulletComponent {
  @Input() text: string = '';
}
