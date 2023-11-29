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
      map((response: any) => response), // Map only the data
      catchError((error) => throwError(() => error)) // Handle errors
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
  const request = "/addpedido/"+id_vendedor+"/"+id_tienda;
  const url = this.urlApi + request;
  const objetoJson = JSON.stringify(nuevo);
  const headers = new HttpHeaders().set("Content-Type", "application/json");
  return this._http.post(url, objetoJson, { headers }).pipe(
    map((response: any) => response), 
    catchError((error) => throwError(() => error)) 
  );
}

updatePedido(update: any,id_vendedor:string,id_tienda:string): Observable<any> {
  const request = "/updatepedido"+id_vendedor+"/"+id_tienda;
  const url = this.urlApi + request;
  const objetoJson = JSON.stringify(update);
  const headers = new HttpHeaders().set("Content-Type", "application/json");
  return this._http.post(url, objetoJson, { headers }).pipe(
    map((response: any) => response),
    catchError((error) => throwError(() => error))
  );
}

deletePedido(id: string): Observable<any> {
  const request = "/deletepedido/" + id;
  const url = this.urlApi + request;

  return this._http.delete(url).pipe(
    map((response: any) => response),
    catchError((error) => throwError(() => error))
  );
}

  

}
