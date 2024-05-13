import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { ProductResponse } from 'src/app/models/interfaces/products/ProductResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductDataTransferService {

  public productsDataEmmiter$ = new BehaviorSubject<Array<ProductResponse> | null>(null);

  public productDatas: Array<ProductResponse> = [];

  constructor() { }


  setProductDatas(productList : Array<ProductResponse>): void {
    if (productList){
      this.productsDataEmmiter$.next(productList);
      this.getProductDatas();
    }
  }

  getProductDatas(){
    this.productsDataEmmiter$
    .pipe(
      take(1),
      map((product) => product?.filter((data) => data?.amount > 0))
    ).subscribe(
      {
        next: (resp) => {
          if(resp){
            this.productDatas = resp;
          }
        },
      }
    )
    return this.productDatas;
  }
}
