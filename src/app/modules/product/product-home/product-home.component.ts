import { ProductDataTransferService } from './../../../shared/services/product/product-data-transfer.service';
import { ProductService } from './../../../services/product/product-service.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { ProductResponse } from 'src/app/models/interfaces/products/ProductResponse';
import { MessageService } from 'primeng/api';
import { EventAction } from 'src/app/models/interfaces/products/EventAction';

@Component({
  selector: 'app-product-home',
  templateUrl: './product-home.component.html',
  styleUrls: [],
})
export class ProductHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public productsData: Array<ProductResponse> = [];

  constructor(
    private productService: ProductService,
    private productDTOService: ProductDataTransferService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getServiceProductsData();
  }

  getServiceProductsData() {
    const productsLoaded = this.productDTOService.getProductDatas();
    if (productsLoaded.length > 0) {
      this.productsData = productsLoaded;
    } else {
      this.getApiProductsData();
    }
  }

  getApiProductsData() {
    this.productService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          if (resp.length > 0) {
            console.log(resp);
            this.productsData = resp;
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Erro ao buscar produtos',
            life: 3000,
          });
          this.router.navigate(['/dashboard']);
        },
      });
  }

  handleProductAction(event: EventAction): void {
    if(event){
      console.log('Dados recebidos ', event);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
