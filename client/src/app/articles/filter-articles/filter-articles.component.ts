import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/shared/category.model';
import { ArticlesService } from '../articles.service';

@Component({
  selector: 'app-filter-articles',
  templateUrl: './filter-articles.component.html',
  styleUrls: ['./filter-articles.component.less']
})
export class FilterArticlesComponent implements OnInit {
  categoryVisible: boolean;
  priceVisible: boolean;
  orderVisible: boolean;
  priceRange = [1, 20];

  categories: Category[];

  constructor(private articlesService: ArticlesService) {}

  ngOnInit() {
    this.articlesService.getCategories().subscribe((res: Category[]) => {
      this.categories = res;
    });
  }

  closeCategoryPopover(): void {
    this.categoryVisible = false;
  }

  closePricePopover(): void {
    this.priceVisible = false;
  }

  closeOrderPopover(): void {
    this.orderVisible = false;
  }

  onPriceRangeChange() {
    // Force slider to update
    this.priceRange = this.priceRange.slice();
  }
}
