import { Injectable } from '@angular/core';
import {map, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Country} from "../../common/country/country";
import {Category} from "../../common/category/category";
import {State} from "../../common/state/state";

@Injectable({
  providedIn: 'root'
})
export class MyShopService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient:HttpClient) { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let data:number[]=[];
    for(let theMonth=startMonth;theMonth<=12;theMonth++){
      data.push(theMonth);
    }
    return of (data);
  }
  getCreditCardYears(): Observable<number[]> {
    let data:number[]=[];
    const startYear:number=new Date().getFullYear();
    const endYear:number=startYear+10;
    for(let theYear=startYear;theYear<=endYear;theYear++){
      data.push(theYear);
    }
    return of(data);
  }
    getCountries():Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response=>response._embedded.countries)
    );
    }
    getStates(theCountryCode:string):Observable<State[]>{
    const searchStatesUrl=`${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response=>response._embedded.states)
    );

    }
}
interface GetResponseCountries{
  _embedded:{
    countries:Country[];
  }
}
interface GetResponseStates{
_embedded:{
    states:State[];
}
}
