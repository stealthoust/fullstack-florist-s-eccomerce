import {Component, OnInit} from '@angular/core';
import {Product} from "../../common/product/product";
import {ProductService} from "../../services/product/product.service";
import {ActivatedRoute} from "@angular/router";
import {CartService} from "../../services/cart/cart.service";
import {CartItem} from "../../common/cart-item/cart-item";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = new Product();

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductsDetails();
    })
  }

  private handleProductsDetails() {
    const productsId: number = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(productsId).subscribe(
      data => {
        this.product = data;
      }
    )
  }
  addToCart(){
    let theCartItem=new CartItem(this.product.id,this.product.name,this.product.imageUrl,this.product.unitPrice);
    this.cartService.addToCart(theCartItem);
  }
}
