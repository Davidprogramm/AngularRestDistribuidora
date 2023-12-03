import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy,Inject,OnInit} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common'
import { PeticionesService } from '../../Servicios/PeticionesService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnDestroy, OnInit {
 
  mobileQuery: MediaQueryList;
  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);
  
  private _mobileQueryListener: () => void;


  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private _activeR: ActivatedRoute, 
    @Inject(DOCUMENT) public document: Document, public auth: AuthService,  private _service: PeticionesService,) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
   
    this.auth.user$.subscribe(user => {
      if (user) {
        this.usuarioEmail = user.email;
      }
    });

  }

  ngOnInit(): void {

    this.auth.user$.subscribe(user => {
      if (user) {
        this.usuarioEmail = user.email;
        console.log(this.usuarioEmail); 
        this.comprobar();
      } 
    });

  }
public datosUsuario:any=[];
public usuarioEmail:any;
public habilitarAdmi:boolean=false;
public habilitarVendedor:boolean=false;

  comprobar(){
    this._service.getUsuario(this.usuarioEmail).subscribe(
      (res)=>{
        console.log(res)
        if(res){

            this.datosUsuario=res;     
            if(this.datosUsuario.rol == 'admi'){
              this.habilitarAdmi=true;

            }if(this.datosUsuario.rol=='vendedor'){
              this.habilitarVendedor=true;
              this.habilitarAdmi=false;
            }

        }
      },(error)=>{
        this.habilitarAdmi=false;
        this.habilitarVendedor=false;
        console.log(error)
      }
    )  
  
    

 
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    
  }

  
  
}

  


