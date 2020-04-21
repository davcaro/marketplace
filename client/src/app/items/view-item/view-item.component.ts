import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../item.model';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/users/user.model';

@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.less']
})
export class ViewItemComponent implements OnInit {
  apiUrl: string;
  item: Item;
  user: User;

  constructor(private authService: AuthService, private route: ActivatedRoute) {
    this.apiUrl = environment.apiUrl;

    this.user = this.authService.user.value;
  }

  ngOnInit(): void {
    this.item = Object.assign(new Item(), this.route.snapshot.data.item);
  }
}
