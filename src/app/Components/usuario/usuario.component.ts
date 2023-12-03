import {AfterViewInit, Component, ViewChild,OnInit,Injectable, Inject,OnDestroy, Input} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { PeticionesService } from '../../Servicios/PeticionesService';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioApp, UsuarioCrear, VendedorCrear } from '../Models/usuario-crear.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MatNativeDateModule} from '@angular/material/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { DetallePedidoCreate } from '../detalle-pedido/detalle-pedido.component';
import { BehaviorSubject } from 'rxjs';
import { SharedService } from '../../Servicios/Compartir';


export interface UserData {
  id_usuario: string;
  nombre: string;
  correo: string;
  rol: string;
}

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent  implements AfterViewInit,OnInit,OnDestroy {
 

  public datosActualizar:any={}
  public datosDelete:any={};
  displayedColumns: string[] = ['nombre', 'correo', 'rol', 'accion', 'eliminar'];
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
    const dialogRef = this.dialog.open(UsusarioCreate);

    dialogRef.componentInstance.formularioEnviado.subscribe(() => {
    
      this.create();
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  public datosPedidoCreado: any;


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
    const dialogRef = this.dialog.open(UsuarioDelete);
    dialogRef.componentInstance.datosEliminar = row;

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
    this._service.getUsusarios()
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

    const dialogRef = this.dialog.open(UsuarioAcciones);

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
  selector: 'usario-create',
  templateUrl: './usuario-create.html',
  styleUrl: './usuario.component.css'


})

export class UsusarioCreate implements OnInit {


  constructor(  private fb: FormBuilder,
    private _service: PeticionesService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialogRef: MatDialogRef<UsusarioCreate> ,

  
    ){
    
  
  }




  @Output() formularioEnviado: EventEmitter<void> = new EventEmitter<void>();

  formulario: FormGroup = this.fb.group({
    
    nombre: ['', Validators.required],
    rol: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
 
    
  });
ngOnInit(): void {

}


enviarFormulario() {
    if (this.formulario.valid) {
      const usuarioCrear: UsuarioApp = this.formulario.value;
        console.log(usuarioCrear)
      this._service.addUsuario(usuarioCrear).subscribe(     
        (res)=>{
          console.log(res)
          this.mostrarSnackBar('Vendedor creado con éxito'); 

          this.dialogRef.close();                   
        },
        (error)=>{
          this.mostrarSnackBar('Error al crear Vendedor. Por favor, inténtelo de nuevo.');
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
  selector: 'usuario-acciones',
  templateUrl: './usuario-acciones.html',
  styleUrl: './usuario.component.css'
  

})


export class UsuarioAcciones implements OnInit {

  datosActualizar: UserData | undefined;
 formulario!: FormGroup; 
 dialogRef: MatDialogRef<UsuarioAcciones>;
 @Output() Eliminar: EventEmitter<void> = new EventEmitter<void>();
 @Output() Actualzar: EventEmitter<void> = new EventEmitter<void>();


 constructor(private fb: FormBuilder,
  private _service: PeticionesService,  
  private snackBar: MatSnackBar,
  dialogRef: MatDialogRef<UsuarioAcciones>,
  public dialog: MatDialog
  

  ) {    
    this.dialogRef = dialogRef;
  }
  
 

ngOnInit(): void {
console.log(this.datosActualizar)
  this.formulario = this.fb.group({
    id_usuario: [this.datosActualizar?.id_usuario || ''],
    nombre:[this.datosActualizar?.nombre || '',Validators.required],
    correo: [this.datosActualizar?.correo || '', [Validators.required, Validators.email]],
    rol:[this.datosActualizar?.rol || '',Validators.required]

  });
}



update(){
  var usuarioCrear: UsuarioApp | undefined;

  if (this.formulario.valid) {
     usuarioCrear = this.formulario.value;     
    console.log (usuarioCrear)
    console.log("ENTRO A ACTUALZIAR")

    this._service.updateUsusario(usuarioCrear).subscribe(
     
      (res)=>{
        console.log(res);
        this.mostrarSnackBar('Usuario Actualizado con Éxito');
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
  selector: 'ususario-delete',
  templateUrl: './usuario-delete.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioDelete implements OnInit {

  datosEliminar!: UserData ;

  @Input() id_usuario?: string;

  constructor(
    private _service: PeticionesService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UsuarioDelete> 

  ) {}

  @Output() formularioEnviado: EventEmitter<void> = new EventEmitter<void>();
  @Output() eliminadoExitosamente: EventEmitter<void> = new EventEmitter<void>();
public id_eliminar!:string;
  async ngOnInit(): Promise<void> {
    this.id_eliminar=this.datosEliminar?.id_usuario;
    

    if (this.id_eliminar!== undefined) {
      await this.delete();
    } else {
      console.error("id_pedido es undefined");
    }
  }
  async delete() {
    try {
      if (this.id_eliminar !== undefined) {
        await this._service.deleteUsuario(this.id_eliminar).toPromise();
        this.snackBar.open('Usuario eliminado con éxito', 'Cerrar', {
          duration: 10000,
          verticalPosition: 'top'
        });
        this.eliminadoExitosamente.emit();
        this.formularioEnviado.emit(); 
        this.dialogRef.close(); 

      }
    } catch (error) {
      console.error(error);
      this.snackBar.open('Error al eliminar el Ususario', 'Cerrar', {
        duration: 10000,
        verticalPosition: 'top'
      });
    }
  }
}
