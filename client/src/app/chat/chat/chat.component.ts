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

  routeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private chatService: ChatService,
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
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  sendMessage(): void {
    const message = this.form.value.message;

    if (this.form.valid) {
      this.form.reset();

      this.chatService.sendMessage(this.chat.id, message).subscribe((res: any) => {
        this.chat.messages.push(new ChatMessage(this.user.id, message));

        this.scrollToBottom();
      });
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
}
