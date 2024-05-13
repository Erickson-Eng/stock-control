import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ProductResponse } from 'src/app/models/interfaces/products/ProductResponse';
import { ProductService } from 'src/app/services/product/product-service.service';
import { ProductDataTransferService } from 'src/app/shared/services/product/product-data-transfer.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>();
  public productList: Array<ProductResponse> = [];

  public productsChartDatas!: ChartData;
  public productsChartOptions!: ChartOptions;

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private productDtService: ProductDataTransferService
  ){}


  ngOnInit(): void {
    this.getProductDatas();
  }


  getProductDatas(): void {
    this.productService.getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resp) => {
        if(resp.length > 0){
          this.productList = resp;
          this.productDtService.setProductDatas(this.productList);
          this.setProductsChartConfig();
        }
      }, error : (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar produtos!',
          life: 2500
        })
      }
    })
  }

  setProductsChartConfig(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textcolorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.productsChartDatas = {
      labels: this.productList.map((element) => element?.name),
      datasets: [
        {
          label: 'Quantidade',
          backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
          borderColor: documentStyle.getPropertyValue('--indigo-400'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-700'),
          data: this.productList.map((element) => element?.amount),
        },
      ],
    };

    this.productsChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },

      scales: {
        x: {
          ticks: {
            color: textcolorSecondary,
            font: {
              weight: 500,
            },
          },
          grid : {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textcolorSecondary,
          },
          grid : {
            color: surfaceBorder
          }
        },
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
