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
  @ViewChild('messages') private messagesElement: ElementRef;

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

    this.form = new FormGroup({
      message: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.data.subscribe(data => {
      this.chat = Object.assign(new Chat(), data.chat);
      this.chat.users[0].messages = this.chat.messages.map((message: any) => Object.assign(new ChatMessage(), message));

      this.scrollToBottom();
    });

    this.socket = this.socketioService.getSocket();
    this.socket.on('message received', (message: any) => {
      this.chat.messages.push(Object.assign(new ChatMessage(), message.message));
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
      this.chat.messages.push(new ChatMessage(this.user.id, message));

      this.scrollToBottom();
    }
  }

  onArchiveChat(): void {
    this.chatService.updateChat(this.chat.id, !this.chat.isArchived(this.user.id)).subscribe(res => {});

    this.chatService.removeChat.next(this.chat.id);
    this.router.navigate(['/', 'chat']);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.messagesElement.nativeElement.scrollTop = this.messagesElement.nativeElement.scrollHeight;
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

    const currentMessage = new Date(this.chat.messages[index].createdAt);
    const previousMessage = new Date(this.chat.messages[index - 1].createdAt);

    return (
      currentMessage.getUTCFullYear() === previousMessage.getUTCFullYear() &&
      currentMessage.getUTCMonth() === previousMessage.getUTCMonth() &&
      currentMessage.getUTCDate() === previousMessage.getUTCDate()
    );
  }
}
