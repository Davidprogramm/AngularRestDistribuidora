import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from "@angular/core";
import { HomeComponent } from './Components/home/home.component';
import { ClienteComponent } from './Components/cliente/cliente.component';


const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path:'cliente',component:ClienteComponent}
  // Agrega otras rutas según sea necesario
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

;
