import { Component, input, output } from '@angular/core';

export interface FilterOption {
  readonly label: string;
  readonly value: string;
}

@Component({
  selector: 'app-filter-pills',
  standalone: true,
  template: `
    <div class="pills" role="group" aria-label="Filtros">
      @for (opcion of opciones(); track opcion.value) {
        <button
          type="button"
          class="pill"
          [class.activa]="activo() === opcion.value"
          [attr.aria-pressed]="activo() === opcion.value"
          (click)="seleccionado.emit(opcion.value)"
        >
          {{ opcion.label }}
        </button>
      }
    </div>
  `,
  styles: [`
    .pills { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .pill {
      min-height: 40px;
      padding: 0.45rem 1.1rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-pill);
      background-color: var(--surface);
      color: var(--ink-secondary);
      font-family: 'Geist', sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color var(--spring-duration) var(--spring), color var(--spring-duration) var(--spring), border-color var(--spring-duration) var(--spring), transform var(--spring-duration) var(--spring);
    }
    .pill:hover { border-color: var(--accent); color: var(--accent-deep); transform: translateY(-1px); }
    .pill.activa { background-color: var(--accent); border-color: var(--accent); color: #ffffff; }
  `]
})
export class FilterPillsComponent {
  readonly opciones = input<readonly FilterOption[]>([]);
  readonly activo = input('');
  readonly seleccionado = output<string>();
}
