import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './core/ui/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { GuestGuard } from './core/guards/guest.guard';
import { MeterLayoutComponent } from './core/ui/meter-layout/meter-layout.component';

const routes: Routes = [
  // Default route → redirect to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public route (no menu/layout)
  {
    path: 'login',
    canActivate: [GuestGuard],
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },

  // Protected routes inside MainLayout (with menu)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        loadChildren: () =>
          import('./features/user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'consumers',
        loadChildren: () =>
          import('./features/consumer/consumer.module').then(
            (m) => m.ConsumerModule
          ),
      },
      {
        path: 'meters',
        loadChildren: () =>
          import('./features/meter/meter.module').then((m) => m.MeterModule),
      },
    ],
  },

  {
    path: '',
    component: MeterLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'meter-reader',
        loadChildren: () =>
          import(
            './features/meter-reader/presentation/pages/meter-reader/meter-reader.module'
          ).then((m) => m.MeterReaderPageModule),
      },
      {
        path: 'reader-consumer',
        loadChildren: () =>
          import(
            './features/meter-reader/presentation/pages/reader-consumer/reader-consumer.module'
          ).then((m) => m.ReaderConsumerPageModule),
      },
      {
        path: 'reader-meter',
        loadChildren: () =>
          import(
            './features/meter-reader/presentation/pages/reader-meter/reader-meter.module'
          ).then((m) => m.ReaderMeterPageModule),
      },
      {
        path: 'meter-bill',
        loadChildren: () =>
          import(
            './features/meter-reader/presentation/pages/meter-bill/meter-bill.module'
          ).then((m) => m.MeterBillPageModule),
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
