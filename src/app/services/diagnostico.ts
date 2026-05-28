import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Enfermedad {
  id: string;
  nombre: string;
  nombreCientifico: string;
  confianza: number;
  descripcion: string;
  recomendaciones: string[];
  severidad: 'baja' | 'media' | 'alta';
}

export interface DiagnosticoResultado {
  id: string;
  fecha: Date;
  planta: string;
  imagen: string;
  enfermedad: Enfermedad;
}

@Injectable({ providedIn: 'root' })
export class DiagnosticoService {

  private readonly enfermedades: Enfermedad[] = [
    {
      id: '1',
      nombre: 'Mancha Foliar',
      nombreCientifico: 'Alternaria alternata',
      confianza: 87,
      descripcion: 'Enfermedad fúngica que causa manchas necróticas de color marrón-amarillento con halo amarillo. Se desarrolla con mayor intensidad en condiciones de humedad elevada y temperaturas moderadas entre 20-30°C. Afecta principalmente el follaje y puede propagarse rápidamente.',
      recomendaciones: [
        'Retirar y destruir inmediatamente las hojas afectadas',
        'Mejorar la ventilación y el espaciado entre plantas',
        'Aplicar fungicida a base de mancozeb o clorotalonil',
        'Evitar el riego por aspersión en horas de la tarde',
        'Realizar monitoreo semanal del cultivo'
      ],
      severidad: 'media'
    },
    {
      id: '2',
      nombre: 'Roya del Café',
      nombreCientifico: 'Hemileia vastatrix',
      confianza: 92,
      descripcion: 'Patógeno fúngico devastador que forma pústulas anaranjadas o amarillas polvorientas en el envés de las hojas. Es una de las enfermedades más graves para el cultivo de café en América Latina, capaz de destruir una cosecha completa en pocas semanas si no se controla.',
      recomendaciones: [
        'Aplicar fungicidas cúpricos preventivamente',
        'Podar el dosel para mejorar la aireación',
        'Usar variedades resistentes en futuros cultivos',
        'Retirar hojas caídas del suelo para evitar inóculo',
        'Monitoreo quincenal durante temporada lluviosa'
      ],
      severidad: 'alta'
    },
    {
      id: '3',
      nombre: 'Mildiu Polvoriento',
      nombreCientifico: 'Erysiphe cichoracearum',
      confianza: 78,
      descripcion: 'Infección fúngica superficial que produce un polvo blanco-grisáceo característico sobre hojas, tallos y flores. Se desarrolla en condiciones de humedad relativa moderada (60-80%) con temperaturas entre 15-28°C. Aunque raramente mata la planta, reduce significativamente su vigor.',
      recomendaciones: [
        'Aplicar fungicidas de azufre coloidal o aceite de neem',
        'Reducir el exceso de nitrógeno en la fertilización',
        'Eliminar las partes infectadas con tijeras desinfectadas',
        'Aumentar la circulación de aire entre plantas',
        'Aplicar bicarbonato de potasio como alternativa orgánica'
      ],
      severidad: 'baja'
    },
    {
      id: '4',
      nombre: 'Tizón Tardío',
      nombreCientifico: 'Phytophthora infestans',
      confianza: 94,
      descripcion: 'Oomiceto de alta agresividad que causa lesiones acuosas marrón-oscuras que avanzan rápidamente destruyendo tejido foliar y frutos. Responsable de la Gran Hambruna Irlandesa (1845), es aún hoy una amenaza crítica para cultivos de papa y tomate. Requiere acción inmediata.',
      recomendaciones: [
        'Aplicar fungicidas sistémicos (metalaxil + mancozeb) urgentemente',
        'Destruir los tejidos infectados fuera del cultivo',
        'Suspender completamente el riego foliar',
        'Mejorar el drenaje del suelo para reducir humedad',
        'Monitorear diariamente hasta controlar el brote'
      ],
      severidad: 'alta'
    }
  ];

  private readonly plantas: string[] = [
    'Tomate Cherry', 'Café Arábica', 'Pimiento Rojo', 'Albahaca',
    'Lechuga Romana', 'Rosa', 'Papa Criolla', 'Maíz'
  ];

  private mockHistorial: DiagnosticoResultado[] = [
    {
      id: 'h1',
      fecha: new Date('2026-05-20'),
      planta: 'Tomate Cherry',
      imagen: 'mock',
      enfermedad: { ...this.enfermedades[3] }
    },
    {
      id: 'h2',
      fecha: new Date('2026-05-18'),
      planta: 'Café Arábica',
      imagen: 'mock',
      enfermedad: { ...this.enfermedades[1] }
    },
    {
      id: 'h3',
      fecha: new Date('2026-05-15'),
      planta: 'Pimiento Rojo',
      imagen: 'mock',
      enfermedad: { ...this.enfermedades[2] }
    },
    {
      id: 'h4',
      fecha: new Date('2026-05-10'),
      planta: 'Albahaca',
      imagen: 'mock',
      enfermedad: { ...this.enfermedades[0] }
    },
    {
      id: 'h5',
      fecha: new Date('2026-05-05'),
      planta: 'Lechuga Romana',
      imagen: 'mock',
      enfermedad: { ...this.enfermedades[2] }
    },
    {
      id: 'h6',
      fecha: new Date('2026-04-28'),
      planta: 'Rosa',
      imagen: 'mock',
      enfermedad: { ...this.enfermedades[0] }
    }
  ];

  // Se inicializa con el primer item del historial para que /resultado siempre muestre algo
  private resultadoActual$ = new BehaviorSubject<DiagnosticoResultado | null>(this.mockHistorial[0]);

  analizarImagen(planta: string): Observable<DiagnosticoResultado> {
    const enfermedad = this.enfermedades[Math.floor(Math.random() * this.enfermedades.length)];
    const resultado: DiagnosticoResultado = {
      id: Date.now().toString(),
      fecha: new Date(),
      planta: planta || 'Planta',
      imagen: 'captured',
      enfermedad: { ...enfermedad }
    };
    return of(resultado).pipe(delay(3500));
  }

  guardarResultado(resultado: DiagnosticoResultado): void {
    this.resultadoActual$.next(resultado);
    this.mockHistorial.unshift(resultado);
  }

  getResultadoActual(): Observable<DiagnosticoResultado | null> {
    return this.resultadoActual$.asObservable();
  }

  getHistorial(): DiagnosticoResultado[] {
    return [...this.mockHistorial];
  }

  getSeveridadBadge(severidad: string): string {
    if (severidad === 'alta') return 'danger';
    if (severidad === 'media') return 'warning';
    return 'success';
  }
}
