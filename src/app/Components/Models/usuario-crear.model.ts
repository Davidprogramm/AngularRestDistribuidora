
export interface UsuarioCrear {
  nombre_tienda: string;
  encargado: string;
  direccion: string;
  municipio: string;
  departamento: string;
  telefono: string;
  email: string;
}

export interface VendedorCrear{
  identificacion:string;
  nombre:string;
  apellido:string;
  direccion:string;
  telefono:string;
  email:string;  
}
export interface PedidoCrear{
  fecha:string;
  forma_pago:string;
  estado:string;
  id_vendedor:string;
  id_tienda:string;
 
}
export interface ProductoCrear{
  nombre: string;
  descripcion: string;
  precio: number;
  stock:number;
  unidad_venta:string;
  id_categoria: string;  
  id_descuento:string;
 
}

export interface DetalleCrear{
  cantidad: number;
  valorTotal: number;
  id_pedido: string;
  id_producto:string;
 
}
