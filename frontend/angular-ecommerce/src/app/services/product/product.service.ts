import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from 'src/app/common/product/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private baseUrl='http://localhost:8080/api/products';

  constructor(private httpClient:HttpClient) { }

  getProductList(categoryId:number): Observable<Product[]> {

    const url=`${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(url);
  }

  searchProducts(theKeyword: string) {
    const url=`${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(url);
  }

  private getProducts(url: string) {
    return this.httpClient.get<GetResponse>(url).pipe(
      map(response => response._embedded.products)
    );
  }
}

interface GetResponse{
  _embedded:{
    products:Product[];
  }
}