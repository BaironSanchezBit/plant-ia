import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DiagnosticoService } from '../../services/diagnostico';

@Component({
  selector: 'app-diagnostico',
  standalone: false,
  templateUrl: './diagnostico.html',
  styleUrl: './diagnostico.scss',
})
export class Diagnostico implements OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

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

  constructor(
    private svc: DiagnosticoService,
    private router: Router
  ) {}

  /** Abre el selector de archivos. En móvil con capture="environment" usa la cámara. */
  selectImage(source: 'camera' | 'gallery'): void {
    const input = this.fileInput.nativeElement;
    if (source === 'camera') {
      input.setAttribute('capture', 'environment');
    } else {
      input.removeAttribute('capture');
    }
    input.value = ''; // permite reseleccionar el mismo archivo
    input.click();
  }

  /** Callback del input file — lee la imagen y la convierte a base64 */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errorMsg = 'Por favor selecciona un archivo de imagen (JPG, PNG, etc.)';
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      this.errorMsg = 'La imagen no debe superar 15 MB.';
      return;
    }

    this.errorMsg = '';
    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedImageUrl = e.target?.result as string;
      this.imageSelected = true;
    };
    reader.readAsDataURL(file);
  }

  clearImage(): void {
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
  }
}
