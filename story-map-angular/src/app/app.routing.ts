import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

cont routes: Routes = [
  { path: '', component: 'HomePageComponent'}
]

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
