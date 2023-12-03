import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HomeComponent } from './Components/home/home.component';
import { ClienteComponent,clienteAcciones,clienteCreate } from './Components/cliente/cliente.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
//the table 
import {MatTableModule} from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { VendedorComponent,VendedorAcciones,VendedorCreate } from './Components/vendedor/vendedor.component';
import { PedidoComponent,PedidoAcciones,PedidoCreate,PedidoDelete } from './Components/pedido/pedido.component';
import { MatNativeDateModule } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { ProductoComponent,ProductoAcciones,ProductoCreate,ProductoDelete } from './Components/producto/producto.component';
import { DetallePedidoComponent ,DetallePedidoCreate} from './Components/detalle-pedido/detalle-pedido.component';
import { AuthModule } from '@auth0/auth0-angular';
import { UsuarioComponent } from './Components/usuario/usuario.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ClienteComponent,
    clienteCreate,
    clienteAcciones,
    VendedorComponent,
    VendedorAcciones,
    VendedorCreate,
    PedidoComponent,PedidoAcciones,PedidoCreate,PedidoDelete, 
    ProductoComponent,ProductoAcciones,ProductoCreate,ProductoDelete,
     DetallePedidoComponent,DetallePedidoCreate, UsuarioComponent
  ],
  imports: [
    MatCardModule,
    MatSelectModule,
    AuthModule,
    AuthModule.forRoot({
      domain: 'dev-8xz4tn73e02ddp3y.us.auth0.com',
      clientId: '8ZrZOyafrNaXDPSqWrQLyLYhhk7u81B4',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,  
    MatSortModule,  
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
