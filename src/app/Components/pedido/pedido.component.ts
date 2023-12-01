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



export interface UserData {
  id_pedido: string;
  fecha: string;
  forma_pago: string;
  estado: string;
  id_vendedor:string;
  id_tienda: string;  

}

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css'
})
export class PedidoComponent  implements AfterViewInit,OnInit,OnDestroy {
 

  public datosActualizar:any={}
  displayedColumns: string[] = ['fecha', 'forma_pago', 'estado', 'id_vendedor', 'id_tienda', 'accion', 'eliminar'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _service: PeticionesService,
    public dialog: MatDialog  ,
    private fb: FormBuilder
    ){

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource<UserData>();
  }
  openDialog() {
    const dialogRef = this.dialog.open(PedidoCreate);

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
    const dialogRef = this.dialog.open(PedidoDelete);
    dialogRef.componentInstance.id_pedido = row.id_pedido;

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
    this._service.getPedido()
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
    const dialogRef = this.dialog.open(PedidoAcciones);

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
  selector: 'pedido-create',
  templateUrl: './pedido-create.html',
  styleUrl: './pedido.component.css'


})

export class PedidoCreate implements OnInit {

  constructor(  private fb: FormBuilder,
    private _service: PeticionesService,
    private snackBar: MatSnackBar,
  
    ){
    
  
  }
  public datosVendedor:any=[];
  public datosTienda:any=[];
  public opcionFormaPago:any=['Efectivo','Tarjeta Credito','Tarjeta Debito','Transferencia']

  @Output() formularioEnviado: EventEmitter<void> = new EventEmitter<void>();

  formulario: FormGroup = this.fb.group({
    
    fecha: ['', Validators.required],
    forma_pago: ['', Validators.required],
    estado: ['', Validators.required],
    id_vendedor: ['', Validators.required],
    id_tienda: ['', Validators.required],
    
  });
ngOnInit(): void {
  this.formulario.get('estado')?.setValue('En Toma');
this.getDatos()
}
getDatos(){
  this._service.getVendedores().subscribe(
    (res)=>{
      this.datosVendedor=res;
    },(error)=>{
      console.log(error)
    }
  )
  this._service.getTiendas().subscribe(
    (res)=>{
      this.datosTienda=res;
    },(error)=>{
      console.log(error)
    }
  )
}


  enviarFormulario() {
    if (this.formulario.valid) {
      const usuarioCrear: PedidoCreate = this.formulario.value;
      const id_vendedor:string=this.formulario.value.id_vendedor;
      const id_tienda:string=this.formulario.value.id_tienda;      
      this._service.addPedido(usuarioCrear,id_vendedor,id_tienda).subscribe(
     
        (res)=>{
          console.log(res)
          this.mostrarSnackBar('Pedido creado con éxito');
          this.formularioEnviado.emit();    
      
         
          
        },
        (error)=>{
          console.log(error)
          this.mostrarSnackBar('Error al crear Pedido. Por favor, inténtelo de nuevo.');
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
  selector: 'pedido-acciones',
  templateUrl: './pedido-acciones.html',
  styleUrl: './pedido.component.css'
  

})


export class PedidoAcciones implements OnInit {
  public datosVendedor:any=[];
  public datosTienda:any=[];
  getDatos(){
    this._service.getVendedores().subscribe(
      (res)=>{
        this.datosVendedor=res;
      },(error)=>{
        console.log(error)
      }
    )
    this._service.getTiendas().subscribe(
      (res)=>{
        this.datosTienda=res;
      },(error)=>{
        console.log(error)
      }
    )
  }
  datosActualizar: UserData | undefined;
 formulario!: FormGroup; 
 dialogRef: MatDialogRef<PedidoAcciones>;
 @Output() Eliminar: EventEmitter<void> = new EventEmitter<void>();
 @Output() Actualzar: EventEmitter<void> = new EventEmitter<void>();


 constructor(private fb: FormBuilder,
  private _service: PeticionesService,  
  private snackBar: MatSnackBar,
  dialogRef: MatDialogRef<PedidoAcciones>,
  public dialog: MatDialog
  

  ) {    
    this.dialogRef = dialogRef;
  }
  
 

ngOnInit(): void {
  this.getDatos();
console.log(this.datosActualizar)
  this.formulario = this.fb.group({
    id_pedido: [this.datosActualizar?.id_pedido || ''],
    fecha:[this.datosActualizar?.fecha || '',Validators.required],
    forma_pago: [this.datosActualizar?.forma_pago || '', Validators.required],
    estado:[this.datosActualizar?.estado || '',Validators.required], 
    id_vendedor: [this.datosActualizar?.id_vendedor || '', Validators.required],
    id_tienda: [this.datosActualizar?.id_tienda || '', Validators.required],   


  });
}


public id_vendedor!: string ;
public id_tienda!: string;
update(){
  var usuarioCrear: VendedorCrear | undefined;

  if (this.formulario.valid) {
     usuarioCrear = this.formulario.value;
      this.id_vendedor = this.formulario.value.id_vendedor;
      this.id_tienda = this.formulario.value.id_tienda;
    console.log (usuarioCrear)
    console.log("ENTRO A ACTUALZIAR")

    this._service.updatePedido(usuarioCrear,this.id_vendedor,this.id_tienda).subscribe(
     
      (res)=>{
        console.log(res);
        this.mostrarSnackBar('Pedido Actualizado con Éxito');
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
  selector: 'pedido-delete',
  templateUrl: './pedido-delete.html',
  styleUrl: './pedido.component.css'
})
export class PedidoDelete implements OnInit {
  @Input() id_pedido?: string;

  constructor(
    private _service: PeticionesService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PedidoDelete> // Inyectar MatDialogRef

  ) {}

  @Output() formularioEnviado: EventEmitter<void> = new EventEmitter<void>();
  @Output() eliminadoExitosamente: EventEmitter<void> = new EventEmitter<void>();

  async ngOnInit(): Promise<void> {
    if (this.id_pedido !== undefined) {
      await this.delete();
    } else {
      console.error("id_pedido es undefined");
    }
  }
  async delete() {
    try {
      if (this.id_pedido !== undefined) {
        await this._service.deletePedido(this.id_pedido).toPromise();
        this.snackBar.open('Pedido eliminado con éxito', 'Cerrar', {
          duration: 10000,
          verticalPosition: 'top'
        });
        this.eliminadoExitosamente.emit();
        this.formularioEnviado.emit(); // Emitir evento cuando se completa la eliminación
        this.dialogRef.close(); // Cerrar el diálogo
      }
    } catch (error) {
      console.error(error);
      this.snackBar.open('Error al eliminar el pedido', 'Cerrar', {
        duration: 10000,
        verticalPosition: 'top'
      });
    }
  }
}
