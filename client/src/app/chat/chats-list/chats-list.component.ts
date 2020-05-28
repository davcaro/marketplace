import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ChatService } from '../chat.service';
import { Chat } from '../chat.model';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { SocketioService } from 'src/app/shared/socketio.service';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/users/user.model';
import { NotificationsService } from 'src/app/shared/header/notifications/notifications.service';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.less']
})
export class ChatsListComponent implements OnInit, OnDestroy {
  apiUrl: string;
  user: User;
  chats: Chat[];
  chatSelected: number;
  newChat: Chat;
  archived: boolean;

  socket: SocketIOClient.Socket;
  routeParamsSubscription: Subscription;
  removeChatSubscription: Subscription;
  updateUnreadSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private socketioService: SocketioService
  ) {
    this.apiUrl = environment.apiUrl;
    this.user = this.authService.user.value;
    this.archived = false;

    this.notificationsService.deleteNotification.next('new_message');

    const state = this.router.getCurrentNavigation().extras.state;
    if (state && state.chat) {
      this.newChat = state.chat;
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
        this.chatSelected = +paramMap.get('id');
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

    this.updateUnreadSubscription = this.chatService.updateUnreadCount.subscribe(count => {
      if (this.chats) {
        const selectedChat = this.chats.find(chat => chat.id === this.chatSelected);

        if (selectedChat) {
          selectedChat.unreadMessages = count;
        }
      }
    });

    this.socket = this.socketioService.getSocket();
    this.socket.on('message received', (message: any) => {
      const newChat = Object.assign(new Chat(), message.chat);

      if (newChat.isArchived(this.user.id) === this.archived) {
        let chatFound = this.chats.find(chat => chat.id === newChat.id);

        if (!chatFound) {
          newChat.unreadMessages = 0;
          this.chats.unshift(newChat);
          chatFound = newChat;
        }

        chatFound.unreadMessages++;
      }

      this.notificationsService.deleteNotification.next('new_message');
    });
  }

  ngOnDestroy() {
    this.routeParamsSubscription.unsubscribe();

    this.socket.off('message received');
  }

  onStatusChange(): void {
    this.chatService.getChats(this.archived).subscribe(chats => {
      this.chats = chats.map((chat: any) => Object.assign(new Chat(), chat));
    });
  }

  onSelectChat(chat: Chat): void {
    chat.unreadMessages = 0;
  }
}
