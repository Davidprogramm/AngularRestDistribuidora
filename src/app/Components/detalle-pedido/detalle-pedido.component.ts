import {AfterViewInit, Component, ViewChild,OnInit,Injectable, Inject,OnDestroy, Input} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { PeticionesService } from '../../Servicios/PeticionesService';
import { MatDialog } from '@angular/material/dialog';
import { VendedorCrear } from '../Models/usuario-crear.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MatNativeDateModule} from '@angular/material/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Router } from '@angular/router';


export interface UserData {
  id_detalle_pedido: string;
  cantidad: number;
  valorTotal: number;
  id_pedido: string;
  id_producto:string;

}

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrl: './detalle-pedido.component.css'
})
export class DetallePedidoComponent {

}


@Component({
  selector: 'app-detalle-pedido-create',
  templateUrl: './detalle-pedido-create.html',
  styleUrl: './detalle-pedido.component.css'
})
export class DetallePedidoCreate {

  constructor(  private fb: FormBuilder,
    private _service: PeticionesService,
    private snackBar: MatSnackBar,
    private router: Router,

  
    ){
    
  
  }

  public habilitar:boolean=false;
  id_producto!: any;
  public datosProducto:any=[];
  public stockProducto: number = 0;

  @Output() formularioEnviado: EventEmitter<void> = new EventEmitter<void>();

  formulario: FormGroup = this.fb.group({
    
    cantidad: ['', Validators.required],
    valor_total: ['', Validators.required],
    id_pedido: ['', Validators.required],
    id_producto: ['', Validators.required]    
  });
  
ngOnInit(): void {
this.getDatos()
}
getDatos(){
  this._service.getProductos().subscribe(
    (res)=>{
      this.datosProducto=res;
    },(error)=>{
      console.log(error)
    }
  )

}
cheack(id_producto: any) {

  console.log(id_producto);
  this._service.getProducto(id_producto).subscribe(
    (res) => {
      console.log(res);
      this.habilitar = true;
      this.stockProducto = res.stock;
      this.formulario.get('cantidad')?.setValidators([Validators.required, Validators.min(1), Validators.max(this.stockProducto)]);
      this.formulario.get('cantidad')?.updateValueAndValidity();


    },
    (error) => {
      console.log(error);
      this.habilitar = false;
      this.stockProducto = 0;
    }
  );
}

  enviarFormulario() {
    if (this.formulario.valid) {
      const usuarioCrear: DetallePedidoCreate = this.formulario.value;
      const id_vendedor:string=this.formulario.value.id_vendedor;
      const id_producto:string=this.formulario.value.id_producto;      
      this._service.addPedido(usuarioCrear,id_vendedor,id_producto).subscribe(
     
        (res)=>{
          console.log(res)
          this.mostrarSnackBar('Detalle Pedido creado con éxito');
          this.formularioEnviado.emit();  
        },
        (error)=>{
          console.log(error)
          this.mostrarSnackBar('Error al crear Detalle pedido. Por favor, inténtelo de nuevo.');
        }       

      )
      this.formulario.reset();
      console.log(usuarioCrear);

    }
  }
  mostrarSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 10000, 
      verticalPosition: 'top'      
    });
  }
}



