import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/users/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { ChatMessage } from '../chat-message.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatService } from '../chat.service';
import { Chat } from '../chat.model';
import { environment } from 'src/environments/environment';
import { NzModalService } from 'ng-zorro-antd';
import { SocketioService } from 'src/app/shared/socketio.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit, OnDestroy {
  apiUrl: string;
  chat: Chat;
  user: User;
  form: FormGroup;
  limit: number;
  page: number;
  total: number;
  scrollDown: boolean;
  @ViewChild('messages') private messagesElement: ElementRef;
  @ViewChild('chatBottom') private chatBottomElement: ElementRef;

  socket: SocketIOClient.Socket;
  routeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private chatService: ChatService,
    private socketioService: SocketioService,
    private modal: NzModalService
  ) {
    this.apiUrl = environment.apiUrl;
    this.user = this.authService.user.value;
    this.limit = 30;
    this.page = 1;

    this.form = new FormGroup({
      message: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.data.subscribe(data => {
      this.chat = Object.assign(new Chat(), data.chat);
      this.chat.messages.data = this.chat.messages.data.map(message => Object.assign(new ChatMessage(), message));
      this.total = this.chat.messages.pagination.total;

      this.scrollToBottom('auto');
    });

    this.socket = this.socketioService.getSocket();
    this.socket.on('message received', (message: any) => {
      const scrollAtBottom = this.getScrollBottom() === 0;

      this.chat.messages.data.push(Object.assign(new ChatMessage(), message.message));

      if (scrollAtBottom) {
        this.scrollToBottom();
      }
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  sendMessage(): void {
    const message = this.form.value.message;

    if (this.form.valid) {
      this.form.reset();

      this.chatService.sendMessage(this.chat.id, message);
      this.chat.messages.data.push(new ChatMessage(this.user.id, message));

      this.scrollToBottom();
    }
  }

  loadMessages(): void {
    const offset = this.page * this.limit;

    if (offset < this.total) {
      this.chatService.getChat(this.chat.id, { limit: this.limit, offset }).subscribe(res => {
        this.page++;

        const messages = res.messages.data.map((message: any) => Object.assign(new ChatMessage(), message));
        this.chat.messages.data.unshift(...messages);
      });
    }
  }

  onArchiveChat(): void {
    this.chatService.updateChat(this.chat.id, !this.chat.isArchived(this.user.id)).subscribe(res => {});

    this.chatService.removeChat.next(this.chat.id);
    this.router.navigate(['/', 'chat']);
  }

  scrollToBottom(behavior: string = 'smooth'): void {
    setTimeout(() => {
      this.chatBottomElement.nativeElement.scrollIntoView({ behavior });
    }, 0);
  }

  showDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: '¿Seguro que quieres eliminar ésta conversación?',
      nzOkText: 'Eliminar',
      nzOkType: 'danger',
      nzOnOk: () => this.onDeleteChat(),
      nzCancelText: 'Cancelar'
    });
  }

  onDeleteChat(): void {
    this.chatService.deleteChat(this.chat.id).subscribe(res => {
      this.chatService.removeChat.next(this.chat.id);

      this.router.navigate(['/', 'chat']);
    });
  }

  isSameDay(index: number): boolean {
    if (index === 0) {
      return false;
    }

    const currentMessage = new Date(this.chat.messages.data[index].createdAt);
    const previousMessage = new Date(this.chat.messages.data[index - 1].createdAt);

    return (
      currentMessage.getUTCFullYear() === previousMessage.getUTCFullYear() &&
      currentMessage.getUTCMonth() === previousMessage.getUTCMonth() &&
      currentMessage.getUTCDate() === previousMessage.getUTCDate()
    );
  }

  // Get the scroll distance from bottom of the chat
  getScrollBottom(): number {
    if (!this.messagesElement) {
      return 0;
    }

    const element = this.messagesElement.nativeElement;
    return element.scrollHeight - (element.scrollTop + element.offsetHeight);
  }

  onScroll(): void {
    this.scrollDown = this.getScrollBottom() > 100;
  }
}
