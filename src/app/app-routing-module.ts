import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Diagnostico } from './pages/diagnostico/diagnostico';
import { Resultado } from './pages/resultado/resultado';
import { Historial } from './pages/historial/historial';
import { Nosotros } from './pages/nosotros/nosotros';

const routes: Routes = [
  { path: '',           component: Home },
  { path: 'diagnostico', component: Diagnostico },
  { path: 'resultado',   component: Resultado },
  { path: 'historial',   component: Historial },
  { path: 'nosotros',    component: Nosotros },
  { path: '**',          redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
