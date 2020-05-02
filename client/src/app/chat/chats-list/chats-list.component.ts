import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.less']
})
export class ChatsListComponent implements OnInit {
  chat: number;

  constructor(private route: ActivatedRoute) {
    this.chat = this.route.snapshot.params.id;
  }

  ngOnInit(): void {}
}
