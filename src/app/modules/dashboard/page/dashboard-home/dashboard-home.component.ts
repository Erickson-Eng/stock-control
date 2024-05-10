import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProductResponse } from 'src/app/models/interfaces/products/ProductResponse';
import { ProductService } from 'src/app/services/product/product-service.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit{

  public productList: Array<ProductResponse> = [];

  constructor(
    private productService: ProductService,
    private messageService: MessageService
  ){}


  ngOnInit(): void {
    this.getProductDatas();
  }


  getProductDatas(): void {
    this.productService.getAllProducts().subscribe({
      next: (resp) => {
        if(resp.length > 0){
          this.productList = resp;
        }
      }
    })
  }
}
