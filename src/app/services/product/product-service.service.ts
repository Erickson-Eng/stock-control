import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import { ProductResponse } from 'src/app/models/interfaces/products/ProductResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookieService.get('USER_TOKEN');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`,
    }),
  };

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getAllProducts(): Observable<Array<ProductResponse>> {
    return this.http
      .get<Array<ProductResponse>>(`${this.API_URL}/products`, this.httpOptions)
      .pipe(map((product) => product.filter((data) => data?.amount > 0)));
  }

  deleteProduct(id: string): Observable<ProductResponse> {

    return this.http.delete<ProductResponse>(`${this.API_URL}/product/delete`,
    {
      ...this.httpOptions,
      params: {
        product_id: id,
      }
    })
  }
}
