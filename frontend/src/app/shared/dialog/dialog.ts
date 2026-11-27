import { Component, ElementRef, HostListener, effect, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'app-dialog',
  standalone: true,
  template: `
    @if (open()) {
      <div class="dialog-backdrop" (click)="cerrar()"></div>
      <div class="dialog-layer" role="dialog" aria-modal="true" [attr.aria-label]="titulo()">
        <div #panel class="dialog-panel" tabindex="-1">
          <div class="dialog-header">
            <h2>{{ titulo() }}</h2>
            <button type="button" class="dialog-close" aria-label="Cerrar" (click)="cerrar()">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="dialog-body">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: contents; }
    .dialog-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1050;
      background-color: rgba(24, 24, 27, 0.55);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
    }
    .dialog-layer {
      position: fixed;
      inset: 0;
      z-index: 1051;
      display: grid;
      place-items: center;
      padding: 1rem;
      overflow-y: auto;
    }
    .dialog-panel {
      width: min(100%, 640px);
      max-height: calc(100dvh - 2rem);
      overflow-y: auto;
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      background-color: var(--surface);
      box-shadow: var(--shadow-soft);
      animation: dialogIn 0.28s var(--spring) both;
    }
    .dialog-panel:focus { outline: none; }
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    .dialog-header h2 {
      margin: 0;
      font-family: 'Outfit', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--ink);
    }
    .dialog-close {
      width: 44px;
      height: 44px;
      flex-shrink: 0;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface-muted);
      color: var(--ink-secondary);
      cursor: pointer;
    }
    .dialog-body { padding: 1.5rem; }
    @keyframes dialogIn {
      from { opacity: 0; transform: translateY(12px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `]
})
export class DialogComponent {
  readonly open = input(false);
  readonly titulo = input('');
  readonly cerrado = output<void>();
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private elementoAnterior: HTMLElement | null = null;

  constructor() {
    effect(() => {
      if (this.open()) {
        this.elementoAnterior = typeof document !== 'undefined'
          ? document.activeElement as HTMLElement | null
          : null;
        setTimeout(() => this.panel()?.nativeElement.focus(), 0);
      } else if (this.elementoAnterior) {
        this.elementoAnterior.focus();
        this.elementoAnterior = null;
      }
    });
  }

  @HostListener('document:keydown.escape')
  alEscape(): void {
    if (this.open()) this.cerrar();
  }

  @HostListener('document:keydown.tab', ['$event'])
  atraparTab(evento: Event): void {
    if (!this.open()) return;

    const tecla = evento as KeyboardEvent;
    const panel = this.panel()?.nativeElement;
    if (!panel) return;

    const enfocables = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(elemento => elemento.offsetParent !== null);

    if (!enfocables.length) {
      tecla.preventDefault();
      panel.focus();
      return;
    }

    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];

    if (tecla.shiftKey && (document.activeElement === primero || document.activeElement === panel)) {
      tecla.preventDefault();
      ultimo.focus();
    } else if (!tecla.shiftKey && document.activeElement === ultimo) {
      tecla.preventDefault();
      primero.focus();
    }
  }

  cerrar(): void {
    this.cerrado.emit();
  }
}
