import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/common/category/category';
import { CategoryService } from 'src/app/services/category/category.service';
import {ProductService} from "../../../services/product/product.service";

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {

  categories:Category[]=[];

  constructor(private categoryService:CategoryService, private productService:ProductService) { }

  ngOnInit(): void {
    this.listCategories();
  }

  listCategories() {
    this.categoryService.getCategoriesList().subscribe(
      data=>{
        this.categories=data;
      }
    )
  }
}
