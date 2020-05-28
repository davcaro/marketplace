import { Component, OnInit } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { Subscription } from 'rxjs';
import { Notification, NotificationGroup } from './notification.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less']
})
export class NotificationsComponent implements OnInit {
  unreadNotificationsCount: number;
  notifications: NotificationGroup[];
  reloadNotifications: boolean;
  loading: boolean;
  isOpen: boolean;

  unreadNotificationsCountSub: Subscription;
  newNotificationsSub: Subscription;
  deleteNotificationSub: Subscription;

  constructor(private notificationsService: NotificationsService) {
    this.notifications = [];
  }

  ngOnInit(): void {
    this.unreadNotificationsCountSub = this.notificationsService.unreadNotificationsCount.subscribe((count: number) => {
      this.unreadNotificationsCount = count;
    });

    this.newNotificationsSub = this.notificationsService.reloadNotifications.subscribe(
      (reloadNotifications: boolean) => {
        this.reloadNotifications = reloadNotifications;

        if (this.isOpen && reloadNotifications) {
          this.loadNotifications();
          this.markAllAsRead();
        }
      }
    );

    this.deleteNotificationSub = this.notificationsService.deleteNotification.subscribe((type: string) => {
      this.notificationsService.reloadNotifications.next(true);
      this.notificationsService.deleteNotifications(type).subscribe(() => {
        this.notificationsService.getUnreadNotificationsCount().subscribe((count: number) => {
          this.notificationsService.unreadNotificationsCount.next(count);
        });
      });
    });

    this.notificationsService.getUnreadNotificationsCount().subscribe((count: number) => {
      this.notificationsService.unreadNotificationsCount.next(count);
    });
  }

  loadNotifications(): void {
    if (this.reloadNotifications) {
      this.loading = true;

      this.notificationsService.getNotifications().subscribe((notifications: Notification[]) => {
        this.notifications = this.groupNotifications(notifications);

        this.notificationsService.reloadNotifications.next(false);
        this.loading = false;
      });
    }
  }

  groupNotifications(notifications: Notification[]): NotificationGroup[] {
    const parsedNotifications: NotificationGroup[] = [];

    // Get the types of all notifications
    const notificationTypes = notifications.map(notification => notification.type);
    // Remove duplicated types
    const types = notificationTypes.filter((type, index) => notificationTypes.indexOf(type) === index);

    // Parse notifications by type
    types.forEach(type => {
      const notificationsFound = notifications.filter(notification => notification.type === type);

      if (notificationsFound.length) {
        parsedNotifications.push(this.getNotificationGroup(type, notificationsFound));
      }
    });

    return parsedNotifications;
  }

  getNotificationGroup(type: string, notifications: Notification[]): NotificationGroup {
    if (notifications.length === 1) {
      const notification = notifications[0];

      switch (type) {
        case 'new_message':
          return {
            type,
            count: notifications.length,
            icon: 'chat',
            url: ['/', 'chat'],
            title: 'Tienes 1 nuevo mensaje',
            description: `De ${notification.fromUser.name} sobre el artículo "${notification.item.title}"`
          };
        case 'favorite':
          return {
            type,
            count: notifications.length,
            icon: 'heart',
            url: ['/', 'item', notification.item.id],
            title: 'Tienes un nuevo favorito',
            description: `${notification.fromUser.name} ha marcado como favorito tu artículo "${notification.item.title}"`
          };

        case 'review':
          return {
            type,
            count: notifications.length,
            icon: 'star',
            url: ['/', 'reviews', 'others'],
            title: 'Tienes una nueva valoración',
            description: `De ${notification.fromUser.name} sobre el artículo "${notification.item.title}"`
          };

        case 'pending_review':
          return {
            type,
            count: notifications.length,
            icon: 'star',
            url: ['/', 'reviews', 'pending'],
            title: `${notification.fromUser.name} te ha solicitado una valoración`,
            description: `Deja una valoración de tu compra de "${notification.item.title}"`
          };
      }
    } else {
      switch (type) {
        case 'new_message':
          return {
            type,
            count: notifications.length,
            icon: 'chat',
            url: ['/', 'chat'],
            title: `Tienes ${notifications.length} nuevos mensajes sin leer`,
            description: '¡Echa un vistazo a tus conversaciones!'
          };
        case 'favorite':
          return {
            type,
            count: notifications.length,
            icon: 'heart',
            url: ['/', 'catalog', 'items'],
            title: `Tienes ${notifications.length} favoritos nuevos`,
            description: '¡Echa un vistazo a tus artículos!'
          };

        case 'review':
          return {
            type,
            count: notifications.length,
            icon: 'star',
            url: ['/', 'reviews', 'others'],
            title: 'Varias valoraciones nuevas',
            description: 'Tienes algunas nuevas valoraciones ¡Échales un vistazo!'
          };

        case 'pending_review':
          return {
            type,
            count: notifications.length,
            icon: 'star',
            url: ['/', 'reviews', 'pending'],
            title: 'Tienes varias solicitudes de valoración',
            description: 'Echa un vistazo a tus solicitudes pendientes'
          };
      }
    }
  }

  markAllAsRead(): void {
    if (this.unreadNotificationsCount) {
      this.notificationsService.unreadNotificationsCount.next(0);

      this.notificationsService.markAllAsRead().subscribe();
    }
  }

  deleteNotification(notification: NotificationGroup): void {
    this.notifications.splice(this.notifications.indexOf(notification), 1);
    this.notificationsService.unreadNotificationsCount.next(this.unreadNotificationsCount - notification.count);
    this.notificationsService.deleteNotifications(notification.type).subscribe();
  }

  deleteAllNotifications(): void {
    if (this.notifications.length) {
      this.notifications = [];
      this.notificationsService.unreadNotificationsCount.next(0);
      this.notificationsService.deleteNotifications('all').subscribe();
    }
  }

  closeNotifications(): void {
    this.isOpen = false;
  }
}
