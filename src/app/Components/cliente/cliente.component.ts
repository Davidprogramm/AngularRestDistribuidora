import {AfterViewInit, Component, ViewChild,OnInit, Injectable, Inject} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { PeticionesService } from '../../Servicios/PeticionesService';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioCrear } from '../Models/usuario-crear.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Output, EventEmitter } from '@angular/core';


export interface UserData {
  id_tienda: string;
  encargado: string;
  departamento: string;
  municipio: string;
  telefono:string;
  email: string; 
  nombre:string;
  direccion:string;

}

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent  implements AfterViewInit,OnInit {
 
  public datosActualizar:any={}
  displayedColumns: string[] = ['nombre', 'encargado', 'departamento', 'municipio', 'telefono', 'email','accion'];
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
    const dialogRef = this.dialog.open(clienteCreate);
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
    this._service.getTiendas().subscribe(
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
    const dialogRef = this.dialog.open(clienteAcciones);

    // Establece los datos directamente en la propiedad del componente
    dialogRef.componentInstance.datosActualizar = row;
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }


  
}

@Component({
  selector: 'cliente-create',
  templateUrl: './cliente-create.html',
  styleUrl: './cliente.component.css'


})

export class clienteCreate implements OnInit {

  constructor(  private fb: FormBuilder,
    private _service: PeticionesService,
    private snackBar: MatSnackBar
    ){
    
  
  }

  @Output() formularioEnviado: EventEmitter<void> = new EventEmitter<void>();

  formulario: FormGroup = this.fb.group({
    
    nombre_tienda: ['', Validators.required],
    encargado: ['', Validators.required],
    direccion: ['', Validators.required],
    departamento: ['', Validators.required],
    municipio: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
  });
ngOnInit(): void {

}
  enviarFormulario() {
    if (this.formulario.valid) {
      const usuarioCrear: UsuarioCrear = this.formulario.value;
      // Aquí puedes enviar usuarioCrear al servicio o realizar cualquier acción que desees
      console.log(usuarioCrear);
      this._service.addTienda(usuarioCrear).subscribe(
        (res)=>{
          console.log(res)
          this.mostrarSnackBar('Tienda creada con éxito');
          this.formularioEnviado.emit();

        },
        (error)=>{
          console.log(error)
          this.mostrarSnackBar('Error al crear la tienda');
        }       

      )
      this.formulario.reset();
      console.log(usuarioCrear);

    }
  }
  mostrarSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 10000, // Duración del mensaje en milisegundos (10 segundos en este caso)
      verticalPosition: 'top' // Posición vertical superior      
    });
  }
}


@Component({
  selector: 'cliente-acciones',
  templateUrl: './cliente-acciones.html',
  styleUrl: './cliente.component.css'
  

})


export class clienteAcciones implements OnInit {

  datosActualizar: UserData | undefined;
 formulario!: FormGroup; // el ! indica que sera definido despues del contructor 
 constructor(private fb: FormBuilder,
  private _service: PeticionesService,  
  private snackBar: MatSnackBar
  ) {}
  

ngOnInit(): void {
console.log(this.datosActualizar)
  this.formulario = this.fb.group({
    id_tienda: [this.datosActualizar?.id_tienda || ''],
    nombre:[this.datosActualizar?.nombre || '',Validators.required],
    encargado: [this.datosActualizar?.encargado || '', Validators.required],
    direccion:[this.datosActualizar?.direccion || '',Validators.required], 
    departamento: [this.datosActualizar?.departamento || '', Validators.required],
    municipio: [this.datosActualizar?.municipio || '', Validators.required],
    telefono: [this.datosActualizar?.telefono || '', Validators.required],
    email: [this.datosActualizar?.email || '', [Validators.required, Validators.email]],


  });
}

enviarActualizar(){
  if (this.formulario.valid) {

    const usuarioCrear: UsuarioCrear = this.formulario.value;
    console.log (usuarioCrear)
    this._service.updateTienda(usuarioCrear).subscribe(
      (res)=>{
        console.log(res)
        this.mostrarSnackBar('Tienda Actualizada con éxito');

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
    duration: 10000, // Duración del mensaje en milisegundos (10 segundos en este caso)
    verticalPosition: 'top' // Posición vertical superior      
  });
}
}