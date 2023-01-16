import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {Product} from 'src/app/common/product/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private httpClient: HttpClient) {
  }

  getProduct(productId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  getProductList(categoryId: number): Observable<Product[]> {

    const url = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(url);
  }

  getProductListPaginate(page: number,
                         pageSize: number,
                         categoryId: number): Observable<GetResponse> {

    const url = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}
    &page=${page}&size=${pageSize}`;
    return this.httpClient.get<GetResponse>(url);
  }

  searchProducts(theKeyword: string) {
    const url = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(url);
  }

  private getProducts(url: string) {
    return this.httpClient.get<GetResponse>(url).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductListPaginateNoCategory( thePage: number,thePageSize: number ) :Observable<GetResponse> {
    const searchUrl = `${this.baseUrl}`
      + `?size=${thePageSize}&page=${thePage}`;

    return this.httpClient.get<GetResponse>(searchUrl);

  }
}

interface GetResponse {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number;
    totalElements: number,
    totalPages: number,
    number: number
  }
}
