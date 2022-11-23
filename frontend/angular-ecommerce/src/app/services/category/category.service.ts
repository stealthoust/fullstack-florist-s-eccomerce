import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/app/common/category/category';
import { map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl='http://localhost:8080/api/categories';

  constructor(private httpClient:HttpClient) { }

  getCategoriesList(): Observable<Category[]> {
    return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
      map(response=>response._embedded.categories)
    );
  }

}

interface GetResponse{
  _embedded:{
    categories:Category[];
  }
}