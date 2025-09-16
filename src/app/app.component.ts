import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent],
  template: `
    <div class="app-container">
      <app-login></app-login>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #f7fafc;
    }
  `]
})
export class AppComponent {
  title = 'Simple Login Auth';
}
