import { ProductDataTransferService } from './../../../shared/services/product/product-data-transfer.service';
import { ProductService } from './../../../services/product/product-service.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { ProductResponse } from 'src/app/models/interfaces/products/ProductResponse';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EventAction } from 'src/app/models/interfaces/products/EventAction';
import { DeleteProductAction } from 'src/app/models/interfaces/products/DeleteProductAction';

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
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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
    if (event) {
      console.log('Dados recebidos ', event);
    }
  }

  handleDeleteAction(event: DeleteProductAction): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Confirma a exclusão do produto ${event?.productName}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteProduct(event?.id),
      });
    }
  }

  deleteProduct(id: string) {
    if (id) {
      this.productService
        .deleteProduct(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            if (resp) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Exclusão realizada com sucesso!',
                life: 3000,
              });
            }
            this.getApiProductsData();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Exclusão não concluida',
              life: 3000,
            });
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
