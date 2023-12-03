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
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {

  constructor(  private fb: FormBuilder,
    private _service: PeticionesService,
    private snackBar: MatSnackBar
    ){
    
  
  }
  formulario: FormGroup = this.fb.group({    
    nombre: ['', Validators.required],
    correo: ['', Validators.required],
    rol: ['', Validators.required]    
  });

  enviarFormulario() {
    if (this.formulario.valid) {
      const usuarioCrear: UsuarioCrear = this.formulario.value;
      this._service.addUsuario(usuarioCrear).subscribe(
        (res)=>{
          console.log(res)
          this.mostrarSnackBar('Usuario creado con éxito');        

        },
        (error)=>{
          console.log(error)
          this.mostrarSnackBar('Error al crear Usuario');
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
