import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  constructor(public router: Router) {}

  get pageTitle(): string {
    const titles: Record<string, string> = {
      '/':            'Inicio',
      '/diagnostico': 'Diagnóstico',
      '/resultado':   'Resultado',
      '/historial':   'Historial',
      '/nosotros':    'Nosotros',
    };
    return titles[this.router.url] ?? 'PLANTIA';
  }

  isHome(): boolean {
    return this.router.url === '/';
  }
}
