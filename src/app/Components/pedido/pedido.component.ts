import {AfterViewInit, Component, ViewChild,OnInit, Injectable, Inject} from '@angular/core';
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
export class PedidoComponent  implements AfterViewInit,OnInit {
 
  public datosActualizar:any={}
  displayedColumns: string[] = ['fecha', 'forma_pago', 'estado', 'vendedor', 'sucursal','accion'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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


  create(){
    this._service.getPedido().subscribe(
      (res)=>{
        console.log(res)
        this.dataSource.data = res;

      },
      (error)=>{
        console.log(error)
      }
    )
  };
  captarfila(row: UserData){
    console.log('Datos de la fila:', row);
    this.datosActualizar=row;
    
  }
 

  openDialogAcciones(row: UserData):void {
     
console.log(row);
    const dialogRef = this.dialog.open(PedidoAcciones);

    dialogRef.componentInstance.datosActualizar = row;
  
    dialogRef.componentInstance.Eliminar.subscribe(() => {
      this.create();
    });

    dialogRef.componentInstance.Actualzar.subscribe(() => {
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
    private snackBar: MatSnackBar
    ){
    
  
  }

  @Output() formularioEnviado: EventEmitter<void> = new EventEmitter<void>();

  formulario: FormGroup = this.fb.group({
    
    fecha: ['', Validators.required],
    forma_pago: ['', Validators.required],
    estado: ['', Validators.required],
    id_vendedor: ['', Validators.required],
    id_tienda: ['', Validators.required],
    
  });
ngOnInit(): void {

}

  enviarFormulario() {
    if (this.formulario.valid) {
      const usuarioCrear: VendedorCrear = this.formulario.value;
      const id_vendedor:string=""
      const id_tienda:string=""
      console.log(usuarioCrear);
      this._service.addPedido(usuarioCrear,id_vendedor,id_tienda).subscribe(
        (res)=>{
          console.log(res)
          this.mostrarSnackBar('Pedido creado con éxito');
          this.formularioEnviado.emit();    
        },
        (error)=>{
          console.log(error)
          this.mostrarSnackBar('Error al crear Pedido');
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

  datosActualizar: UserData | undefined;
 formulario!: FormGroup; 
 dialogRef: MatDialogRef<PedidoAcciones>;
 @Output() Eliminar: EventEmitter<void> = new EventEmitter<void>();
 @Output() Actualzar: EventEmitter<void> = new EventEmitter<void>();


 constructor(private fb: FormBuilder,
  private _service: PeticionesService,  
  private snackBar: MatSnackBar,
  dialogRef: MatDialogRef<PedidoAcciones>
  

  ) {    
    this.dialogRef = dialogRef;
  }
  

ngOnInit(): void {
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

update(){
  if (this.formulario.valid) {

    const usuarioCrear: VendedorCrear = this.formulario.value;
    const id_vendedor:string=""
    const id_tienda:string=""
    console.log (usuarioCrear)
    this._service.updatePedido(usuarioCrear,id_vendedor,id_tienda).subscribe(
      (res)=>{
        console.log(res)
        this.mostrarSnackBar('Pedido Actualizado con Exito');
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
delete() {
  const idPedido = this.datosActualizar?.id_vendedor;
  if (idPedido) {
    this._service.deletePedido(idPedido).subscribe(
      (res) => {
        console.log(res);
        this.mostrarSnackBar('Pedido Eliminado con éxito');
        this.Eliminar.emit();

        this.dialogRef.close();
      },
      (error) => {
        console.error(error);
        this.mostrarSnackBar('Error al eliminar ');
      }
    );
  } else {
    console.error('ID del Vendedor no válido');
  }
}

mostrarSnackBar(mensaje: string) {
  this.snackBar.open(mensaje, 'Cerrar', {
    duration: 10000, 
    verticalPosition: 'top'    
  });
}
}