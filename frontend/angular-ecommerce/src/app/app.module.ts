import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import {HttpClientModule} from '@angular/common/http'
import { ProductService } from './services/product/product.service';
import { CategoriesListComponent } from './components/categories-list/categories-list/categories-list.component';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import {ToastrModule} from "ngx-toastr";

import { NotificationComponent } from './components/notification/notification.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { PaginationComponent } from './components/pagination/pagination.component';
import {MatPaginatorModule} from "@angular/material/paginator";


const routes :Routes=[
  {path: 'search/:keyword',component:ProductListComponent},
  {path: 'products/:id',component:ProductDetailsComponent},
  {path: 'category/:id',component:ProductListComponent},
  {path: 'category',component:ProductListComponent},
  {path: 'products',component:ProductListComponent},

  {path: '',redirectTo: '/products',pathMatch:'full'},
  {path: '**',redirectTo: '/products', pathMatch: 'full'}
];
@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    CategoriesListComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    NotificationComponent,
    PaginationComponent

  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: "toast-bottom-right",
      timeOut: 1500
    }),
    MatPaginatorModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
