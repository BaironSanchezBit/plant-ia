import { Component, OnInit } from '@angular/core';
import { DiagnosticoService, DiagnosticoResultado } from '../../services/diagnostico';

@Component({
  selector: 'app-historial',
  standalone: false,
  templateUrl: './historial.html',
  styleUrl: './historial.scss',
})
export class Historial implements OnInit {
  items: DiagnosticoResultado[] = [];

  constructor(private svc: DiagnosticoService) {}

  ngOnInit(): void {
    this.items = this.svc.getHistorial();
  }

  formatFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  badgeClass(severidad: string): string {
    return this.svc.getSeveridadBadge(severidad);
  }

  severidadLabel(sev: string): string {
    const m: Record<string, string> = { alta: 'Alta', media: 'Media', baja: 'Baja' };
    return m[sev] ?? sev;
  }
}
