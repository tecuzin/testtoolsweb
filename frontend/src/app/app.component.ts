import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="app-shell">
      <nav class="navbar navbar-expand bg-white shadow-sm border-bottom sticky-top">
        <div class="container py-1">
          <a class="navbar-brand d-flex align-items-center gap-2 fw-bold text-success-emphasis" routerLink="/">
            <span class="brand-badge">A</span>
            <span>AgriTrack</span>
          </a>
        </div>
      </nav>

      <main class="py-4 py-md-5">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {}
