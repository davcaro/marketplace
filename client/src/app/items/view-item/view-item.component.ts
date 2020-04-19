import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../item.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.less']
})
export class ViewItemComponent implements OnInit {
  apiUrl: string;
  item: Item;

  constructor(private route: ActivatedRoute) {
    this.apiUrl = environment.apiUrl;
  }

  ngOnInit(): void {
    this.item = Object.assign(new Item(), this.route.snapshot.data.item);
  }
}
