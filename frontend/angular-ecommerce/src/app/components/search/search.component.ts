import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MyShopService} from "../../services/myShop/my-shop.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private router: Router, private myShopService: MyShopService) {
  }
  @ViewChild('searchInput') searchInput: ElementRef;
  ngOnInit(): void {
    this.myShopService.categoriesListEvent.subscribe(data => {
        this.searchInput.nativeElement.placeholder = data;
        this.searchInput.nativeElement.value = "";

      }
    )
  }

  searchProduct(value: string) {
    console.log(`value=${value}`);
    this.router.navigateByUrl(`/search/${value}`)
  }
}
