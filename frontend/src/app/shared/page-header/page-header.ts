import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  templateUrl: './page-header.html',
  styleUrl: './page-header.css'
})
export class PageHeaderComponent {
  readonly kicker = input('');
  readonly titulo = input('');
  readonly descripcion = input('');
}
