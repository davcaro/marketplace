import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ChatService } from '../chat.service';
import { Chat } from '../chat.model';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.less']
})
export class ChatsListComponent implements OnInit, OnDestroy {
  apiUrl: string;
  chats: Chat[];
  chatSelected: boolean;
  newChat: Chat;
  archived: boolean;

  routeParamsSubscription: Subscription;
  removeChatSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private chatService: ChatService) {
    this.apiUrl = environment.apiUrl;
    this.archived = false;

    const state = this.router.getCurrentNavigation().extras.state;
    if (state && state.chat) {
      this.newChat = Object.assign(new Chat(), state.chat);
    }

    this.routeParamsSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.route),
        map(activeRoute => {
          while (activeRoute.firstChild) activeRoute = activeRoute.firstChild;
          return activeRoute;
        }),
        switchMap(activeRoute => activeRoute.paramMap)
      )
      .subscribe(paramMap => {
        this.chatSelected = !!paramMap.get('id');
      });
  }

  ngOnInit(): void {
    this.chatService.getChats().subscribe(chats => {
      this.chats = chats.map((chat: any) => Object.assign(new Chat(), chat));

      if (this.newChat) {
        this.chats.unshift(this.newChat);
      }
    });

    this.removeChatSubscription = this.chatService.removeChat.subscribe(id => {
      const chatToRemove = this.chats.find(chat => chat.id === id);

      this.chats.splice(this.chats.indexOf(chatToRemove), 1);
    });
  }

  ngOnDestroy() {
    this.routeParamsSubscription.unsubscribe();
  }

  onStatusChange(): void {
    this.chatService.getChats(this.archived).subscribe(chats => {
      this.chats = chats.map((chat: any) => Object.assign(new Chat(), chat));
    });
  }
}
