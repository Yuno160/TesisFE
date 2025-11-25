import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import * as moment from 'moment';

import { AuthenticationService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
        private notificationService: NotificationService,
        private authService: AuthenticationService) { }

    canActivate(): boolean {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.token) {
      return true;
    }

    this.router.navigate(['/auth/login']); 
    return false;
  }
}
