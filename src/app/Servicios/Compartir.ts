// shared.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private pedidoCreadoSource = new BehaviorSubject<any>(null);
  pedidoCreado$ = this.pedidoCreadoSource.asObservable();

  enviarPedidoCreado(pedido: any) {
    this.pedidoCreadoSource.next(pedido);
  }
}
