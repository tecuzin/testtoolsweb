import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <main>
      <h1>Gestion des parcelles agricoles</h1>
      <a routerLink="/">Accueil</a>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {}
