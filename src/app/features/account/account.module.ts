import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* import { AccountRoutingModule } from './account-routing.module';
import { AccountPageComponent } from './account-page/account-page.component'; */
/* import { ChangePasswordComponent } from './change-password/change-password.component'; */
// import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  // declarations: [AccountPageComponent, ChangePasswordComponent, ProfileDetailsComponent],
  exports: []
})
export class AccountModule { }
