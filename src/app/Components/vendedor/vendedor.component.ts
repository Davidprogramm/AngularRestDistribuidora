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
  id_vendedor: string;
  identificacion: string;
  nombre: string;
  apellido: string;
  direccion:string;
  email: string; 
  telefono:string;  

}

@Component({
  selector: 'app-vendedor',
  templateUrl: './vendedor.component.html',
  styleUrl: './vendedor.component.css'
})
export class VendedorComponent  implements AfterViewInit,OnInit {
 
  public datosActualizar:any={}
  displayedColumns: string[] = ['identificacion', 'nombre', 'direccion', 'telefono', 'email','accion'];
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
    const dialogRef = this.dialog.open(VendedorCreate);
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
    this._service.getVendedores().subscribe(
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
    const dialogRef = this.dialog.open(VendedorAcciones);

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
  selector: 'vendedor-create',
  templateUrl: './vendedor-create.html',
  styleUrl: './vendedor.component.css'


})

export class VendedorCreate implements OnInit {

  constructor(  private fb: FormBuilder,
    private _service: PeticionesService,
    private snackBar: MatSnackBar
    ){
    
  
  }

  @Output() formularioEnviado: EventEmitter<void> = new EventEmitter<void>();

  formulario: FormGroup = this.fb.group({
    
    identificacion: ['', Validators.required],
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    direccion: ['', Validators.required],
    telefono: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
ngOnInit(): void {

}

  enviarFormulario() {
    if (this.formulario.valid) {
      const usuarioCrear: VendedorCrear = this.formulario.value;
      console.log(usuarioCrear);
      this._service.addVendedor(usuarioCrear).subscribe(
        (res)=>{
          console.log(res)
          this.mostrarSnackBar('Vendedor creado con éxito');
          this.formularioEnviado.emit();    
        },
        (error)=>{
          console.log(error)
          this.mostrarSnackBar('Error al crear Vendedor');
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
  selector: 'vendedor-acciones',
  templateUrl: './vendedor-acciones.html',
  styleUrl: './vendedor.component.css'
  

})


export class VendedorAcciones implements OnInit {

  datosActualizar: UserData | undefined;
 formulario!: FormGroup; // el ! indica que sera definido despues del contructor 
 dialogRef: MatDialogRef<VendedorAcciones>;
 @Output() Eliminar: EventEmitter<void> = new EventEmitter<void>();
 @Output() Actualzar: EventEmitter<void> = new EventEmitter<void>();


 constructor(private fb: FormBuilder,
  private _service: PeticionesService,  
  private snackBar: MatSnackBar,
  dialogRef: MatDialogRef<VendedorAcciones>
  

  ) {    
    this.dialogRef = dialogRef;
  }
  

ngOnInit(): void {
console.log(this.datosActualizar)
  this.formulario = this.fb.group({
    id_vendedor: [this.datosActualizar?.id_vendedor || ''],
    identificacion:[this.datosActualizar?.identificacion || '',Validators.required],
    nombre: [this.datosActualizar?.nombre || '', Validators.required],
    apellido:[this.datosActualizar?.apellido || '',Validators.required], 
    direccion: [this.datosActualizar?.direccion || '', Validators.required],
    telefono: [this.datosActualizar?.telefono || '', Validators.required],   
    email: [this.datosActualizar?.email || '', [Validators.required, Validators.email]],


  });
}

update(){
  if (this.formulario.valid) {

    const usuarioCrear: VendedorCrear = this.formulario.value;
    console.log (usuarioCrear)
    this._service.updateVendedor(usuarioCrear).subscribe(
      (res)=>{
        console.log(res)
        this.mostrarSnackBar('Vendedor Actualizado con Exito');
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
  const idTienda = this.datosActualizar?.id_vendedor;
  if (idTienda) {
    this._service.deleteVendedor(idTienda).subscribe(
      (res) => {
        console.log(res);
        this.mostrarSnackBar('Vendedor Eliminado con éxito');
        this.Eliminar.emit();

        this.dialogRef.close();
      },
      (error) => {
        console.error(error);
        this.mostrarSnackBar('Error al eliminar el Vendedor');
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