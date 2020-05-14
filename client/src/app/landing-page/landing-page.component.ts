import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Category } from '../shared/category.model';
import { ItemsService } from '../items/items.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  categories: Category[];

  categoriesSubscription: Subscription;

  constructor(private itemsService: ItemsService, private router: Router) {
    this.categories = this.itemsService.categories.value;

    this.form = new FormGroup({
      category: new FormControl(this.categories[0].id),
      keywords: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.categoriesSubscription = this.itemsService.categories.subscribe(categories => {
      this.categories = categories;
    });
  }

  ngOnDestroy(): void {
    this.categoriesSubscription.unsubscribe();
  }

  searchItems(): void {
    const { category, keywords } = this.form.value;

    this.router.navigate(['search'], {
      queryParams: {
        category: category !== -1 ? category : null,
        keywords
      }
    });
  }
}
