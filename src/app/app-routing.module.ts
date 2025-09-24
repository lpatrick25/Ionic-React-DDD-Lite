import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './core/ui/main-layout/main-layout.component';
// import { LoginComponent } from './features/auth/login/login.component';

const routes: Routes = [
  // Default route → redirect to login
  { path: '', redirectTo: 'users', pathMatch: 'full' },

  // Public route (no menu/layout)
  // { path: 'login', component: MainLayoutComponent },

  // Protected routes inside MainLayout (with menu)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'users',
        loadChildren: () =>
          import('./features/user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'consumers',
        loadChildren: () =>
          import('./features/consumer/consumer.module').then((m) => m.ConsumerModule),
      },
      {
        path: 'meters',
        loadChildren: () =>
          import('./features/meter/meter.module').then((m) => m.MeterModule),
      },
    ],
  },

  // Catch-all → go to login
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
