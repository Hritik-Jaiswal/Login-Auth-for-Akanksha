import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="book-dashboard">
      <header class="dashboard-header">
        <h1>Book Management</h1>
        <button class="logout-btn" (click)="logout()">Logout</button>
      </header>
      <div class="dashboard-content">
        <p>Welcome to the book management system!</p>
        <p>This is where regular users would manage books.</p>
      </div>
    </div>
  `,
  styles: [`
    .book-dashboard {
      min-height: 100vh;
      background: #f7fafc;
      padding: 20px;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    .logout-btn {
      padding: 10px 20px;
      background: #e53e3e;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .dashboard-content {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class BookComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    // Check if user is authenticated
    this.authService.authState$.subscribe(state => {
      if (!state.isAuthenticated) {
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
