import { inject } from '@angular/core';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { MessagesService } from 'app/layout/common/messages/messages.service';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { forkJoin } from 'rxjs';
import { UserService } from './core/user/user.service';

export const initialDataResolver = () => {
    const messagesService = inject(MessagesService);
    const navigationService = inject(NavigationService);
    const notificationsService = inject(NotificationsService);
    const _user = inject(UserService);


    // Fork join multiple API endpoint calls to wait all of them to finish
    return forkJoin([
        _user.get(),
        navigationService.get(),

        messagesService.getAll(),
        notificationsService.getAll()
    ]);
};
