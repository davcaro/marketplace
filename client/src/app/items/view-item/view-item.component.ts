import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../item.model';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/users/user.model';
import { ItemsService } from '../items.service';

@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.less']
})
export class ViewItemComponent implements OnInit {
  apiUrl: string;
  user: User;
  item: Item;
  isFavorited: boolean;

  constructor(private authService: AuthService, private itemsService: ItemsService, private route: ActivatedRoute) {
    this.apiUrl = environment.apiUrl;

    this.user = this.authService.user.value;
  }

  ngOnInit(): void {
    this.item = Object.assign(new Item(), this.route.snapshot.data.item);

    this.itemsService.getItemFavorites(this.item.id).subscribe(res => {
      this.isFavorited = !!res.find(favorite => favorite.userId === this.user.id);
    });

    if (this.user) {
      this.itemsService.addView(this.item.id).subscribe();
    }
  }

  onMarkAsFavorite() {
    if (this.isFavorited) {
      this.itemsService.removeFavorite(this.item.id).subscribe(res => {
        this.isFavorited = !this.isFavorited;
      });
    } else {
      this.itemsService.addFavorite(this.item.id).subscribe(res => {
        this.isFavorited = !this.isFavorited;
      });
    }
  }
}
