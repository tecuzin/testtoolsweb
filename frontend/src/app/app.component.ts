import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-app text-gray-900 font-sans antialiased">
      <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a class="flex items-center gap-2 cursor-pointer text-decoration-none" routerLink="/">
            <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
            <span class="font-bold text-xl tracking-tight text-emerald-900">AgriTrack</span>
          </a>
        </div>
      </nav>

      <main class="py-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {}
