import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-dark text-light py-4 mt-5">
      <div class="container text-center">
        <p class="mb-1">✈️ SkyBook — Airline Reservation System</p>
        <p class="mb-0 text-muted" style="font-size: 0.85rem;">
          © 2025 SkyBook. All rights reserved.
        </p>
      </div>
    </footer>
  `
})
export class FooterComponent {}