import {AfterViewInit, Component, ViewChild,OnInit,Injectable, Inject,OnDestroy, Input} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { PeticionesService } from '../../Servicios/PeticionesService';
import { MatDialog } from '@angular/material/dialog';
import { PedidoCrear, ProductoCrear, VendedorCrear } from '../Models/usuario-crear.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MatNativeDateModule} from '@angular/material/core';
import { Subject, Subscription, takeUntil } from 'rxjs';



export interface UserData {
  id_producto: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock:number;
  unidad_venta:string;
  id_categoria: string;  
  id_descuento:string;

}

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent  implements AfterViewInit,OnInit,OnDestroy {
 

  public datosActualizar:any={}
  displayedColumns: string[] = ['nombre', 'descripcion', 'precio', 'stock', 'id_categoria','unidad_venta', 'id_descuento', 'accion','eliminar'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _service: PeticionesService,
    public dialog: MatDialog  ,
    private fb: FormBuilder
    ){

   
    this.dataSource = new MatTableDataSource<UserData>();
  }
  openDialog() {
    const dialogRef = this.dialog.open(ProductoCreate);

    dialogRef.componentInstance.formularioEnviado.subscribe(() => {
      this.create();
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
      this.create()
      
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  eliminar(row: UserData): void {
    const dialogRef = this.dialog.open(ProductoDelete);
    dialogRef.componentInstance.id_pedido = row.id_producto;

    const eliminarExitosamenteSubscription = dialogRef.componentInstance.eliminadoExitosamente.subscribe(() => {
      this.create();
      dialogRef.close();
    });

    const formularioEnviadoSubscription = dialogRef.componentInstance.formularioEnviado.subscribe(() => {
      this.create(); 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      eliminarExitosamenteSubscription.unsubscribe();
      formularioEnviadoSubscription.unsubscribe();
    });
  }
  create() {
    this._service.getProductos()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
            (res) => {
                console.log(res);
                this.dataSource.data = res;
            },
            (error) => {
                console.log(error);
            }
        );
}
  captarfila(row: UserData){
    console.log('Datos de la fila:', row);
    this.datosActualizar=row;
    
  }
 
  eliminarSubscription: Subscription | undefined;
  actualizarSubscription: Subscription | undefined
  limpiarSuscripciones(): void {
    if (this.eliminarSubscription && !this.eliminarSubscription.closed) {
      this.eliminarSubscription.unsubscribe();
    }
  
    if (this.actualizarSubscription && !this.actualizarSubscription.closed) {
      this.actualizarSubscription.unsubscribe();
    }
  }
  
  ngOnDestroy(): void {
    this.limpiarSuscripciones();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  openDialogAcciones(row: UserData):void {
     
console.log(row);
    const dialogRef = this.dialog.open(ProductoAcciones);

    dialogRef.componentInstance.datosActualizar = row;
  
    
    this.eliminarSubscription = dialogRef.componentInstance.Eliminar.subscribe(() => {
      this.create();
    });

    this.actualizarSubscription = dialogRef.componentInstance.Actualzar.subscribe(() => {
      this.create();
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }


  
}

@Component({
  selector: 'producto-create',
  templateUrl: './producto-create.html',
  styleUrl: './producto.component.css'


})

export class ProductoCreate implements OnInit {

  constructor(  private fb: FormBuilder,
    private _service: PeticionesService,
    private snackBar: MatSnackBar,
  
    ){
    
  
  }

  public datosUnidadVenta:any=['unidad','litro','caja 10','caja 20','caja 30','caja 40']
  public datosCategoria:any=[];
  public datosDescuento:any=[];

  @Output() formularioEnviado: EventEmitter<void> = new EventEmitter<void>();

  formulario: FormGroup = this.fb.group({
    
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: ['', Validators.required],
    stock: ['', Validators.required],
    unidad_venta: ['', Validators.required],
    id_categoria: ['', Validators.required],
    id_descuento: ['', Validators.required],
 

    
  });
ngOnInit(): void {
this.getDatos()
}
getDatos(){
  this._service.getCategoria().subscribe(
    (res)=>{
      this.datosCategoria=res;
    },(error)=>{
      console.log(error)
    }
  )
  this._service.getDescuento().subscribe(
    (res)=>{
      this.datosDescuento=res;
    },(error)=>{
      console.log(error)
    }
  )
}


  enviarFormulario() {
    if (this.formulario.valid) {
      const usuarioCrear: ProductoCreate = this.formulario.value;
      const id_categoria:string=this.formulario.value.id_categoria;
      const id_descuento:any=this.formulario.value.id_descuento;   

      console.log(usuarioCrear)

      this._service.addProducto(usuarioCrear,id_categoria,id_descuento).subscribe(
     
        (res)=>{
          console.log(res)
          this.mostrarSnackBar('Producto creado con éxito');
          this.formularioEnviado.emit();    
      
         
          
        },
        (error)=>{
          console.log(error)
          this.mostrarSnackBar('Error al crear Producto. Por favor, inténtelo de nuevo.');
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


@Component({
  selector: 'producto-acciones',
  templateUrl: './producto-acciones.html',
  styleUrl: './producto.component.css'
  

})


export class ProductoAcciones implements OnInit {

  public datosUnidadVenta:any=['unidad','litro','caja 10','caja 20','caja 30','caja 40']
  public datosCategoria:any=[];
  public datosDescuento:any=[];
  getDatos(){
    this._service.getCategoria().subscribe(
      (res)=>{
        this.datosCategoria=res;
      },(error)=>{
        console.log(error)
      }
    )
    this._service.getDescuento().subscribe(
      (res)=>{
        this.datosDescuento=res;
      },(error)=>{
        console.log(error)
      }
    )
  }
  datosActualizar: UserData | undefined;
 formulario!: FormGroup; 
 dialogRef: MatDialogRef<ProductoAcciones>;
 @Output() Eliminar: EventEmitter<void> = new EventEmitter<void>();
 @Output() Actualzar: EventEmitter<void> = new EventEmitter<void>();


 constructor(private fb: FormBuilder,
  private _service: PeticionesService,  
  private snackBar: MatSnackBar,
  dialogRef: MatDialogRef<ProductoAcciones>,
  public dialog: MatDialog
  

  ) {    
    this.dialogRef = dialogRef;
  }
  
 

ngOnInit(): void {
  this.getDatos();
console.log(this.datosActualizar)

  this.formulario = this.fb.group({
    id_producto: [this.datosActualizar?.id_producto || ''],
    nombre:[this.datosActualizar?.nombre || '',Validators.required],
    descripcion: [this.datosActualizar?.descripcion || '', Validators.required],
    precio:[this.datosActualizar?.precio || '',Validators.required], 
    stock: [this.datosActualizar?.stock || '', Validators.required],
    unidad_venta: [this.datosActualizar?.unidad_venta || '', Validators.required] ,
    id_descuento: [this.datosActualizar?.id_descuento || '', Validators.required],   
    id_categoria: [this.datosActualizar?.id_categoria || '', Validators.required] ,
    


  });

}



update(){
 

  if (this.formulario.valid) {    

      const usuarioCrear: ProductoCreate = this.formulario.value;
      const id_categoria:string=this.formulario.value.id_categoria;
      const id_descuento:any=this.formulario.value.id_descuento;   
    console.log (usuarioCrear)
    console.log("ENTRO A ACTUALZIAR")

    this._service.updateProducto(usuarioCrear,id_categoria,id_descuento).subscribe(
     
      (res)=>{
        console.log(res);
        this.mostrarSnackBar('Producto Actualizado con Éxito');
        this.Actualzar.emit(); 
        this.dialogRef.close();
      },
      (error)=>{
        console.log(error)
        this.mostrarSnackBar('Error Al Actualizar');

      }
    )

  } else {
    console.log('Formulario no válido. No se puede enviar.');
  }

}

mostrarSnackBar(mensaje: string) {
  this.snackBar.open(mensaje, 'Cerrar', {
    duration: 10000, 
    verticalPosition: 'top'    
  });
}


}

@Component({
  selector: 'producto-delete',
  templateUrl: './producto-delete.html',
  styleUrl: './producto.component.css'
})
export class ProductoDelete implements OnInit {
  @Input() id_pedido?: string;

  constructor(
    private _service: PeticionesService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ProductoDelete> // Inyectar MatDialogRef

  ) {}

  @Output() formularioEnviado: EventEmitter<void> = new EventEmitter<void>();
  @Output() eliminadoExitosamente: EventEmitter<void> = new EventEmitter<void>();

  async ngOnInit(): Promise<void> {
    if (this.id_pedido !== undefined) {
      await this.delete();
    } else {
      console.error("id_producto es undefined");
    }
  }
  async delete() {
    try {
      if (this.id_pedido !== undefined) {
        await this._service.deleteProducto(this.id_pedido).toPromise();
        this.snackBar.open('Producto eliminado con éxito', 'Cerrar', {
          duration: 10000,
          verticalPosition: 'top'
        });
        this.eliminadoExitosamente.emit();
        this.formularioEnviado.emit(); 
        this.dialogRef.close(); 
      }
    } catch (error) {
      console.error(error);
      this.snackBar.open('Error al eliminar el Producto', 'Cerrar', {
        duration: 10000,
        verticalPosition: 'top'
      });
    }
  }
}
