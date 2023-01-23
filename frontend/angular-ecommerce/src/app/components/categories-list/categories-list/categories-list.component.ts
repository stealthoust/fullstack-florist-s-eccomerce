import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Category} from 'src/app/common/category/category';
import {CategoryService} from 'src/app/services/category/category.service';
import {MyShopService} from "../../../services/myShop/my-shop.service";


@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {

  categories: Category[] = [];

  constructor(private categoryService: CategoryService, private mySHopService: MyShopService) {
  }

  ngOnInit(): void {
    this.listCategories();
  }
changeCategory() {
  this.mySHopService.categoriesListEvent.next("Search by keyword...");
}
  listCategories() {
    this.categoryService.getCategoriesList().subscribe(
      data => {
        this.categories = data;
      }
    )
  }


}
