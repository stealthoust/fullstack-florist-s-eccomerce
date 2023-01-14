import {Component, OnInit} from '@angular/core';
import {Product} from 'src/app/common/product/product';
import {ProductService} from 'src/app/services/product/product.service';

import {ActivatedRoute} from '@angular/router';
import {CartService} from "../../services/cart/cart.service";
import {CartItem} from "../../common/cart-item/cart-item";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute) {}

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


  handleListProducts() {

    const ifCategoryExsist: boolean = this.route.snapshot.paramMap.has('id');
    if (ifCategoryExsist) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.productService.getProductList(this.currentCategoryId).subscribe(
        data => {
          this.products = data;
        }
      )
    } else {
      this.productService.getProductListPaginateNoCategory().subscribe(
        data => {
          this.products = data;
        }
      )
    }

    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
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
    let theCartItem=new CartItem(product.id, product.name,product.imageUrl,
      product.unitPrice)
    this.cartService.addToCart(theCartItem);
  }
}
