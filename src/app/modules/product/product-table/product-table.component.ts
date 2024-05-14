import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductEvent } from 'src/app/models/enums/product/ProductEvent.enum';
import { EventAction } from 'src/app/models/interfaces/products/EventAction';
import { ProductResponse } from 'src/app/models/interfaces/products/ProductResponse';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: [],
})
export class ProductTableComponent {
  @Input() products: Array<ProductResponse> = [];
  @Output() productEvent = new EventEmitter<EventAction>()
  public productSelected!: ProductResponse;
  public addProductEvent = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT;


  handleProductEvent(action: string, id?: string): void {
    if(action && action !== ''){
      const productEventData = id  && id !== '' ? {action, id} : {action};
      this.productEvent.emit(productEventData);
    }
  }


}
