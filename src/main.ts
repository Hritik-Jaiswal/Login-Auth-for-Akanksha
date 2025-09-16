import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app/app.component';

const routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' as const },
  { path: 'login', loadComponent: () => import('./app/components/login/login.component').then(m => m.LoginComponent) },
  { path: 'user', loadComponent: () => import('./app/components/user/user.component').then(m => m.UserComponent) },
  { path: 'book', loadComponent: () => import('./app/components/book/book.component').then(m => m.BookComponent) },
  { path: '**', redirectTo: '/login' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(ReactiveFormsModule)
  ]
}).catch(err => console.error(err));
