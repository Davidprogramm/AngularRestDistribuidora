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
}
