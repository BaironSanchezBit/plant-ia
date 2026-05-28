import { Component } from '@angular/core';

interface Miembro {
  nombre: string;
  iniciales: string;
  color: string;
}

@Component({
  selector: 'app-nosotros',
  standalone: false,
  templateUrl: './nosotros.html',
  styleUrl: './nosotros.scss',
})
export class Nosotros {
  readonly equipo: Miembro[] = [
    { nombre: 'Cristian Cortés Bejarano',          iniciales: 'CC', color: '#1a5c2e' },
    { nombre: 'Bairon Esteven Sánchez Rodríguez',  iniciales: 'BS', color: '#2d7a42' },
    { nombre: 'Karol Charthid Romero',              iniciales: 'KR', color: '#24743b' },
    { nombre: 'Karen Villamizar',                   iniciales: 'KV', color: '#1f6835' },
    { nombre: 'Briyith Lorena Martínez Suárez',    iniciales: 'BM', color: '#2a7042' },
  ];
}
