import {Component, OnInit} from '@angular/core';
import {Product} from 'src/app/common/product/product';
import {ProductService} from 'src/app/services/product/product.service';

import {ActivatedRoute} from '@angular/router';
import {CartService} from "../../services/cart/cart.service";
import {CartItem} from "../../common/cart-item/cart-item";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;


  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });

  }


  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts()
    } else {
      this.handleListProducts();
    }
  }

OnPageChange(e:PageEvent)
{
  this.thePageSize=e.pageSize;
  this.theTotalElements=e.length;
  this.thePageNumber=e.pageIndex+1;
  this.listProducts();

}
  handleListProducts() {

    const ifCategoryExsist: boolean = this.route.snapshot.paramMap.has('id');
    if (ifCategoryExsist) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

      if (this.previousCategoryId != this.currentCategoryId) {
        this.thePageNumber = 1;
      }
      this.previousCategoryId=this.currentCategoryId;
      this.productService.getProductListPaginate(this.thePageNumber-1,
        this.thePageSize,
        this.currentCategoryId).subscribe(this.getNestedProductsData())
    } else {
      this.productService.getProductListPaginateNoCategory(this.thePageNumber-1,this.thePageSize).subscribe(this.getNestedProductsData())
    }

    /*    this.productService.getProductList(this.currentCategoryId).subscribe(
          data => {
            this.products = data;
          }
        )*/
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    );
  }

  addToCart(product: Product) {
    console.log(`Adding to cart: ${product.name}`)
    let theCartItem = new CartItem(product.id, product.name, product.imageUrl,
      product.unitPrice)
    this.cartService.addToCart(theCartItem);
  }
  getNestedProductsData(){
    return(data:any)=>{
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }
}
