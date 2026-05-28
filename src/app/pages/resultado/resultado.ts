import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DiagnosticoService, DiagnosticoResultado } from '../../services/diagnostico';

@Component({
  selector: 'app-resultado',
  standalone: false,
  templateUrl: './resultado.html',
  styleUrl: './resultado.scss',
})
export class Resultado implements OnInit, OnDestroy {
  resultado: DiagnosticoResultado | null = null;
  readonly circumference = 2 * Math.PI * 48;   // ≈ 301.6
  ringOffset = this.circumference;              // anillo vacío al inicio

  private sub?: Subscription;
  private timer?: ReturnType<typeof setTimeout>;

  constructor(private svc: DiagnosticoService, private router: Router) {}

  ngOnInit(): void {
    this.sub = this.svc.getResultadoActual().subscribe(r => {
      this.resultado = r;
      this.ringOffset = this.circumference;   // reinicia el anillo

      // Después de que Angular renderiza el estado inicial (anillo vacío),
      // actualizamos el offset y la transición CSS anima el cambio
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (r) {
          this.ringOffset = this.circumference * (1 - r.enfermedad.confianza / 100);
        }
      }, 400);
    });
  }

  get severidadColor(): string {
    const s = this.resultado?.enfermedad?.severidad;
    if (s === 'alta')  return '#d32f2f';
    if (s === 'media') return '#f57c00';
    return '#2e7d32';
  }

  get severidadLabel(): string {
    const m: Record<string, string> = { alta: 'Alta', media: 'Media', baja: 'Baja' };
    return m[this.resultado?.enfermedad?.severidad ?? 'baja'];
  }

  get badgeClass(): string {
    return this.svc.getSeveridadBadge(this.resultado?.enfermedad?.severidad ?? 'baja');
  }

  get isAlta(): boolean {
    return this.resultado?.enfermedad?.severidad === 'alta';
  }

  formatFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  }

  nuevoDiagnostico(): void { this.router.navigate(['/diagnostico']); }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    clearTimeout(this.timer);
  }
}
