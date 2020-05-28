import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../users/user.model';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../shared/header/notifications/notifications.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.less']
})
export class CatalogComponent {
  itemsCount: number;
  itemsStatus: string;
  user: User;

  constructor(
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute
  ) {
    this.itemsCount = 0;
    this.itemsStatus = this.route.snapshot.data.itemsStatus;
    this.user = this.authService.user.value;

    this.notificationsService.deleteNotification.next('favorite');
  }

  updateItemsCount(count: number) {
    this.itemsCount = count;
  }
}
