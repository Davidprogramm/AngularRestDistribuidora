import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PeticionesService {
  private urlApi: string = "http://localhost:8080";

  constructor(private _http: HttpClient) {}

  getTiendas(): Observable<any> {
    const request = "/listtiendas";
    const url = this.urlApi + request;

    return this._http.get(url).pipe(
      map((response: any) => response), // Mapea solo la data
      catchError((error) => throwError(() => error)) // Maneja errores
    );
  }

  addTienda(nuevaTienda: any): Observable<any> {
    const request = "/addtienda";
    const url = this.urlApi + request;
    const objetoJson = JSON.stringify(nuevaTienda);
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    return this._http.post(url, objetoJson, { headers }).pipe(
      map((response: any) => response), // Mapea solo la data
      catchError((error) => throwError(() => error)) // Maneja errores
    );
  }

  updateTienda(update:any):Observable<any>{
    const request = "/updatetienda";

    const url = this.urlApi + request;

    const objetoJson = JSON.stringify(update);
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    return this._http.post(url, objetoJson, { headers }).pipe(
      map((response: any) => response), 
      catchError((error) => throwError(() => error)) 
    );
  }

  deleteTienda(id: string): Observable<any> {
    const request = "/deletetienda/" + id;
    const url = this.urlApi + request;
  
    return this._http.delete(url).pipe(
      map((response: any) => response),
      catchError((error) => throwError(() => error))
    );
  }

  // VENDEDORES 
  
  getVendedores(): Observable<any> {
    const request = "/listvendedores";
    const url = this.urlApi + request;

    return this._http.get(url).pipe(
      map((response: any) => response), // Map only the data
      catchError((error) => throwError(() => error)) // Handle errors
    );
  }

  

  addVendedor(nuevoVendedor: any): Observable<any> {
    const request = "/addvendedor";
    const url = this.urlApi + request;
    const objetoJson = JSON.stringify(nuevoVendedor);
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    return this._http.post(url, objetoJson, { headers }).pipe(
      map((response: any) => response), 
      catchError((error) => throwError(() => error)) 
    );
  }

  updateVendedor(update: any): Observable<any> {
    const request = "/updatevendedor";
    const url = this.urlApi + request;

    const objetoJson = JSON.stringify(update);
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    return this._http.post(url, objetoJson, { headers }).pipe(
      map((response: any) => response),
      catchError((error) => throwError(() => error))
    );
  }

  deleteVendedor(id: string): Observable<any> {
    const request = "/deletevendedor/" + id;
    const url = this.urlApi + request;

    return this._http.delete(url).pipe(
      map((response: any) => response),
      catchError((error) => throwError(() => error))
    );
  }

// PEDIDO 
  
getPedido(): Observable<any> {
  const request = "/dellatepedido";
  const url = this.urlApi + request;
  return this._http.get(url).pipe(
    map((response: any) => response), 
    catchError((error) => throwError(() => error)) 
  );
}



addPedido(nuevo: any,id_vendedor:string,id_tienda:string): Observable<any> {
  const request = "/addpedido/"+id_vendedor+"/"+id_tienda
  const url = this.urlApi + request;
  const objetoJson = JSON.stringify(nuevo);
  const headers = new HttpHeaders().set("Content-Type","application/json");
  return this._http.post(url,objetoJson,{headers }).pipe(
    map((response: any) => response),
    catchError((error) => throwError(() => error))
  );
}


updatePedido(update: any,id_v:string,id_t:string): Observable<any> {
  const request = "/updatepedido/"+id_v+"/"+id_t;
  const url = this.urlApi + request;
  const objetoJson = JSON.stringify(update);
  const headers = new HttpHeaders().set("Content-Type", "application/json");
  return this._http.post(url, objetoJson, { headers }).pipe(
    map((response: any) => response),
    catchError((error) => throwError(() => error))
  );
}

deletePedido(id: string): Observable<any> {
  const request = "/deletepedido/"+id;
  const url = this.urlApi + request;
  return this._http.delete(url).pipe(
    map((response: any) => response),
    catchError((error) => throwError(() => error))
  );
}
// Categoria
getCategoria(): Observable<any> {
  const request = "/listcategoria";
  const url = this.urlApi + request;
  return this._http.get(url).pipe(
    map((response: any) => response), 
    catchError((error) => throwError(() => error)) 
  );
}
//Descuento
getDescuento(): Observable<any> {
  const request = "/listdescuentos";
  const url = this.urlApi + request;
  return this._http.get(url).pipe(
    map((response: any) => response), 
    catchError((error) => throwError(() => error)) 
  );
}

// PRODUCTO
getProductos(): Observable<any> {
  const request = "/listproductos";
  const url = this.urlApi + request;
  return this._http.get(url).pipe(
    map((response: any) => response),
    catchError((error) => throwError(() => error))
  );
}

getDescuentoProducto(id_producto:string): Observable<any> {
  const request = "/descuentoproducto/"+id_producto;
  const url = this.urlApi + request;
  return this._http.get(url).pipe(
    map((response: any) => response),
    catchError((error) => throwError(() => error))
  );
}

getProducto(id_producto:string): Observable<any> {
  const request = "/getproducto/"+id_producto;
  const url = this.urlApi + request;
  return this._http.get(url).pipe(
    map((response: any) => response),
    catchError((error) => throwError(() => error))
  );
}

addProducto(nuevo: any, id_categoria: string, id_descuento: string): Observable<any> {
  const request = "/addproducto/" + id_categoria + "/" + id_descuento;
  const url = this.urlApi + request;
  const objetoJson = JSON.stringify(nuevo);
  const headers = new HttpHeaders().set("Content-Type", "application/json");
  return this._http.post(url, objetoJson, { headers }).pipe(
    map((response: any) => response),
    catchError((error) => throwError(() => error))
  );
}

updateProducto(update: any,id_categoria:string,id_descuento:string): Observable<any> {
  const request = "/updateproducto/"+id_categoria+"/"+id_descuento;
  const url = this.urlApi + request;
  const objetoJson = JSON.stringify(update);
  const headers = new HttpHeaders().set("Content-Type", "application/json");
  return this._http.post(url, objetoJson, { headers }).pipe(
    map((response: any) => response),
    catchError((error) => throwError(() => error))
  );
}

updateStockProducto(stock: number, id_producto: string): Observable<any> {
  const request = "/updatestock";
  const url = this.urlApi + request;
  const update = { stock, id_producto };
  const objetoJson = JSON.stringify(update);
  const headers = new HttpHeaders().set("Content-Type", "application/json");
  return this._http.post(url, objetoJson, { headers }).pipe(
    map((response: any) => response),
    catchError((error) => throwError(() => error))
  );
}

deleteProducto(id: string): Observable<any> {
  const request = "/deleteproducto/" + id;
  const url = this.urlApi + request;
  return this._http.delete(url).pipe(
    map((response: any) => response),
    catchError((error) => throwError(() => error))
  );
}

//detallePedido
allDetallesPedido(id_pedido:string): Observable<any> {
  const request = "/allpedidodetalle/"+id_pedido;
  const url = this.urlApi + request;
  return this._http.get(url).pipe(
    map((response: any) => response),
    catchError((error) => throwError(() => error))
  );
}
facturaDate(id_pedido:string): Observable<any> {
  const request = "/factura/"+id_pedido;
  const url = this.urlApi + request;
  return this._http.get(url).pipe(
    map((response: any) => response),
    catchError((error) => throwError(() => error))
  );
}

addDetalle(nuevo: any, id_pedido: string, id_producto: string): Observable<any> {
  const request = "/adddetallepedido/" + id_pedido + "/" + id_producto;
  const url = this.urlApi + request;
  const objetoJson = JSON.stringify(nuevo);
  const headers = new HttpHeaders().set("Content-Type", "application/json");
  return this._http.post(url, objetoJson, { headers }).pipe(
    map((response: any) => response),
    catchError((error) => throwError(() => error))
  );
}
  

}
