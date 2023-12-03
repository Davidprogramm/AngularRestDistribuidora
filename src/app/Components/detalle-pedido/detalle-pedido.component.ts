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
import { PedidoCreate } from '../pedido/pedido.component';
import { BehaviorSubject } from 'rxjs';
import { SharedService } from '../../Servicios/Compartir';


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
export class DetallePedidoComponent implements OnInit,AfterViewInit {
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  public factura:any=[]
  create() {
    console.log(this.datosPedido.id_pedido)
    this._service.allDetallesPedido(this.datosPedido.id_pedido)
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
        this._service.facturaDate(this.datosPedido.id_pedido).subscribe(
          (res)=>{
            console.log(res)
            this.factura = res.length > 0 ? res[0] : null;
            
          },
          (error)=>{
            console.log(error)
          }
        )
    
}
  displayedColumns: string[] = ['cantidad', 'valor_total', 'nombre',];

  public datosPedido:any=[];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  ngOnInit(): void {
    this.sharedService.pedidoCreado$.subscribe((pedido) => {
      console.log('Pedido recibido en DetallePedidoComponent:', pedido);
      this.datosPedido=pedido;
    });
    this.create()
  }
 constructor(public dialogRef: MatDialogRef<DetallePedidoComponent>,
  private sharedService: SharedService,
  private _service: PeticionesService,
    public dialog: MatDialog  ,
    private fb: FormBuilder){
            this.dataSource = new MatTableDataSource<UserData>();


 }


 cerrarDialogo(): void {
  this.dialogRef.close();
}
}


export interface DetallePedidoCreateData {
  id_pedido: string;
  // Otros campos que puedas recibir
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
    private sharedService: SharedService,
    private dialog: MatDialog



  
    ){
    
  
  } 
  @Input() data!: DetallePedidoCreateData 

  public habilitar:boolean=false;
  id_producto!: any;
  public datosProductos:any=[];
  public stockProducto: number = 0;


  @Output() formularioEnviado: EventEmitter<void> = new EventEmitter<void>();

  formulario: FormGroup = this.fb.group({
    
    cantidad: ['', Validators.required],
    valorTotal: ['', Validators.required],    
    id_producto: ['', Validators.required]    
  });
  public dato:any={}
ngOnInit(): void {
  


this.getDatos()
this.calcularValorTotal();

this.sharedService.pedidoCreado$.subscribe((pedido) => {
  console.log('Pedido recibido en DetallePedidoCreate:', pedido);
this.dato=pedido;
});

this.formulario.get('cantidad')?.valueChanges.subscribe(() => {
  this.calcularValorTotal();
});
console.log(this.dato)
}



getDatos(){
  this._service.getProductos().subscribe(
    (res)=>{
      this.datosProductos=res;
    },(error)=>{
      console.log(error)
    }
  )

}
public datosProducto:any={};
public descuentoProducto:any={};
cheack(id_producto: any) {

  console.log(id_producto);
  this._service.getProducto(id_producto).subscribe(
    (res) => {
      console.log(res);
      this.datosProducto=res;
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
  this._service.getDescuentoProducto(id_producto).subscribe(
    (res)=>{
      console.log(res)
      this.descuentoProducto=res[0].porcentaje;
      console.log(this.descuentoProducto)
    },(error)=>{
      console.log(error)
    }
  )

}
public stockActualiza!:number;
public pasarAfactura:boolean=false;
calcularValorTotal() {
  const cantidad = this.formulario.get('cantidad')?.value;
  const precio = this.datosProductos.find((producto: any) => producto.id_producto === this.formulario.get('id_producto')?.value)?.precio;

  if (cantidad && precio) {
    const valorTotal = cantidad * precio;
    this.formulario.get('valorTotal')?.setValue(valorTotal);
    if(this.descuentoProducto>0){

      const descuento=(valorTotal*this.descuentoProducto)/100
      const ValorFinal=valorTotal-descuento;      
      this.formulario.get('valorTotal')?.setValue(ValorFinal); 
      console.log(ValorFinal)
     }
  }

 
  
  
}

  enviarFormulario() {

    if (this.formulario.valid) {
      const usuarioCrear: DetallePedidoCreate = this.formulario.value;
      const id_pedido: string = this.dato.id_pedido;    
      const id_producto:string=this.formulario.value.id_producto;     
      console.log(usuarioCrear) ;
      console.log(this.formulario.value.valorTotal)   
      this.stockActualiza=this.datosProducto.stock-this.formulario.value.cantidad;
      console.log(this.stockActualiza)     
      this._service.addDetalle(usuarioCrear,id_pedido,id_producto).subscribe(

        (res)=>{
          console.log(res)
          this.mostrarSnackBar('Detalle Pedido creado con éxito');
          console.log(this.stockActualiza)
          console.log(this.stockActualiza)
          this._service.updateStockProducto(this.stockActualiza,id_producto).subscribe(
            (res)=>{
              console.log(res)
              this.habilitar = false;
              this.pasarAfactura=true;


            },
            (error)=>{
              console.log(error)
            },
          )
   
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

  verFactura() {
    const dialogRef = this.dialog.open(DetallePedidoComponent, {
      // Puedes agregar configuraciones adicionales aquí
      data: {  }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Diálogo cerrado', result);
    });
  }
  mostrarSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 10000, 
      verticalPosition: 'top'      
    });
  }
}



