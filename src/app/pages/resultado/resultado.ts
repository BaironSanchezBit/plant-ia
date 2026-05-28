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
  showContent = false;
  animatedConfianza = 0;
  readonly circumference = 2 * Math.PI * 48;

  private sub?: Subscription;
  private animInterval?: ReturnType<typeof setInterval>;

  constructor(
    private svc: DiagnosticoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.svc.getResultadoActual().subscribe(r => {
      this.resultado = r;
      this.showContent = false;
      this.animatedConfianza = 0;
      // Pequeño delay para que Angular detecte el cambio antes de animar
      setTimeout(() => {
        this.showContent = true;
        this.animateConfianza();
      }, 200);
    });
  }

  private animateConfianza(): void {
    clearInterval(this.animInterval);
    const target = this.resultado?.enfermedad?.confianza ?? 0;
    const step = target / 40;
    this.animInterval = setInterval(() => {
      this.animatedConfianza = Math.min(this.animatedConfianza + step, target);
      if (this.animatedConfianza >= target) {
        this.animatedConfianza = target;
        clearInterval(this.animInterval);
      }
    }, 30);
  }

  get dashOffset(): number {
    const pct = this.resultado?.enfermedad?.confianza ?? 0;
    return this.showContent
      ? this.circumference * (1 - pct / 100)
      : this.circumference;
  }

  get badgeClass(): string {
    return this.svc.getSeveridadBadge(this.resultado?.enfermedad?.severidad ?? 'baja');
  }

  get severidadLabel(): string {
    const map: Record<string, string> = { alta: 'Alta', media: 'Media', baja: 'Baja' };
    return map[this.resultado?.enfermedad?.severidad ?? 'baja'];
  }

  get isAlta(): boolean {
    return this.resultado?.enfermedad?.severidad === 'alta';
  }

  get severidadColor(): string {
    const s = this.resultado?.enfermedad?.severidad;
    if (s === 'alta') return '#d32f2f';
    if (s === 'media') return '#f57c00';
    return '#2e7d32';
  }

  get confianzaRedondeada(): number {
    return Math.round(this.animatedConfianza);
  }

  formatFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  nuevoDiagnostico(): void {
    this.router.navigate(['/diagnostico']);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    clearInterval(this.animInterval);
  }
}
