import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DiagnosticoService } from '../../services/diagnostico';

@Component({
  selector: 'app-diagnostico',
  standalone: false,
  templateUrl: './diagnostico.html',
  styleUrl: './diagnostico.scss',
})
export class Diagnostico implements OnDestroy {
  imageSelected = false;
  selectedImageUrl: string | null = null;
  isAnalyzing = false;
  progress = 0;
  progressMessage = 'Iniciando análisis...';
  plantName = '';
  errorMsg = '';

  private readonly messages = [
    'Cargando modelo de IA...',
    'Preprocesando imagen...',
    'Analizando patrones visuales...',
    'Identificando síntomas...',
    'Calculando probabilidades...',
    'Generando diagnóstico...',
  ];

  private progressInterval?: ReturnType<typeof setInterval>;
  private msgIdx = 0;
  private objectUrl: string | null = null;

  constructor(
    private svc: DiagnosticoService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  get safeImageUrl(): SafeUrl | null {
    return this.selectedImageUrl
      ? this.sanitizer.bypassSecurityTrustUrl(this.selectedImageUrl)
      : null;
  }

  /** Llamado desde el template: galleryInput.click() o cameraInput.click() */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errorMsg = 'Selecciona un archivo de imagen (JPG, PNG, WEBP…)';
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      this.errorMsg = 'La imagen no debe superar 15 MB.';
      return;
    }

    // Libera el URL anterior si existe
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);

    // createObjectURL es síncrono → Angular detecta el cambio normalmente
    this.objectUrl = URL.createObjectURL(file);
    this.selectedImageUrl = this.objectUrl;
    this.imageSelected = true;
    this.errorMsg = '';
  }

  clearImage(): void {
    if (this.objectUrl) { URL.revokeObjectURL(this.objectUrl); this.objectUrl = null; }
    this.imageSelected = false;
    this.selectedImageUrl = null;
    this.isAnalyzing = false;
    this.progress = 0;
    this.msgIdx = 0;
    this.errorMsg = '';
  }

  analizar(): void {
    if (!this.imageSelected || this.isAnalyzing) return;
    this.isAnalyzing = true;
    this.progress = 0;
    this.msgIdx = 0;

    this.progressInterval = setInterval(() => {
      this.progress = Math.min(95, this.progress + Math.random() * 14 + 4);
      this.progressMessage = this.messages[this.msgIdx % this.messages.length];
      this.msgIdx++;
    }, 420);

    this.svc.analizarImagen(this.plantName || 'Planta').subscribe(resultado => {
      clearInterval(this.progressInterval);
      this.progress = 100;
      this.progressMessage = '¡Diagnóstico completado!';
      this.svc.guardarResultado(resultado);
      setTimeout(() => this.router.navigate(['/resultado']), 600);
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.progressInterval);
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
  }
}
