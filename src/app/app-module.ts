import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { Home } from './pages/home/home';
import { Diagnostico } from './pages/diagnostico/diagnostico';
import { Resultado } from './pages/resultado/resultado';
import { Historial } from './pages/historial/historial';
import { Nosotros } from './pages/nosotros/nosotros';

@NgModule({
  declarations: [App, Navbar, Footer, Home, Diagnostico, Resultado, Historial, Nosotros],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
