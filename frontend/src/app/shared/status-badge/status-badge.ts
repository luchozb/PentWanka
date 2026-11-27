import { Component, input } from '@angular/core';

export type BadgeTone = 'teal' | 'urgent' | 'neutral' | 'ochre' | 'success';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span class="badge-tono" [class]="'tono-' + tono()">
      <ng-content />
    </span>
  `,
  styles: [`
    .badge-tono {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.3rem 0.8rem;
      border-radius: var(--radius-pill);
      font-family: 'Geist', sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid var(--border);
      background-color: var(--surface-muted);
      color: var(--ink-secondary);
      white-space: nowrap;
    }
    .tono-teal { background-color: var(--accent-soft); color: var(--accent-deep); border-color: rgba(15, 118, 110, 0.16); }
    .tono-urgent { background-color: var(--urgent-soft); color: var(--urgent); border-color: rgba(180, 35, 24, 0.16); }
    .tono-ochre { background-color: var(--warning-soft); color: var(--warning); border-color: rgba(161, 98, 7, 0.18); }
    .tono-success { background-color: var(--success-soft); color: var(--success); border-color: rgba(21, 128, 61, 0.16); }
  `]
})
export class StatusBadgeComponent {
  readonly tono = input<BadgeTone>('neutral');
}
