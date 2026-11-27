import { Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-track',
  standalone: true,
  template: `
    <div
      class="track"
      role="progressbar"
      [attr.aria-valuenow]="valor()"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div class="fill" [class]="'tono-' + tono()" [style.width.%]="valor()"></div>
    </div>
  `,
  styles: [`
    .track {
      height: 10px;
      border-radius: var(--radius-pill);
      background-color: var(--surface-muted);
      overflow: hidden;
    }
    .fill {
      height: 100%;
      border-radius: var(--radius-pill);
      background-color: var(--accent);
      transition: width 0.6s var(--spring);
    }
    .tono-urgent { background-color: var(--urgent); }
    .tono-warning { background-color: var(--warning); }
    .tono-success { background-color: var(--success); }
  `]
})
export class ProgressTrackComponent {
  readonly valor = input(0);
  readonly tono = input<'accent' | 'urgent' | 'warning' | 'success'>('accent');
}
