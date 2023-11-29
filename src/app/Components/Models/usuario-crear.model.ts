
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