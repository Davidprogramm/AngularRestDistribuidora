import {Injectable} from '@angular/core';
import { HttpClient,HttpHeaders,HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
    providedIn: 'root',
}
  
    )

   
// creamos un metodo
export class PeticionesService{

    //buscamos el Url de la pagina
    public urlApi:String="";
    
  
    //Se crea el constructor y se inyecta el servicio Http

    constructor(

        private _http:HttpClient
        
    ){
        this.urlApi="http://localhost:8080"


    }

    // creamos un metodo
    getTiendas():Observable<any>{       
        
       var request= "/listartiendas"
       var url=this.urlApi+request
       return this._http.get(url)

    }
    addTienda(nuevaTienda:any):Observable<any>{
        var request= "/addtienda"
        var url=this.urlApi+request
        let objetoJson=JSON.stringify(nuevaTienda);
        var header= new HttpHeaders().set("Content-Type","application/json")
        return this._http.post(url,objetoJson,{headers: header})
       
    }
  
}