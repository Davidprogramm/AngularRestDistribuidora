import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from "@angular/core";
import { HomeComponent } from './Components/home/home.component';
import { ClienteComponent } from './Components/cliente/cliente.component';
import { VendedorComponent } from './Components/vendedor/vendedor.component';
import { PedidoComponent } from './Components/pedido/pedido.component';
import { ProductoComponent } from './Components/producto/producto.component';
import { DetallePedidoComponent, DetallePedidoCreate } from './Components/detalle-pedido/detalle-pedido.component';


const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path:'cliente',component:ClienteComponent},
  { path:'vendedor',component:VendedorComponent},
  { path:'pedido', component:PedidoComponent},
  { path:'producto', component:ProductoComponent},
  { path:'detalle-pedido', component:DetallePedidoComponent},
  { path:'detalle-create',component:DetallePedidoCreate}

  // Agrega otras rutas según sea necesario
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

;
