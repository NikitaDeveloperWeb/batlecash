import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {Config} from './classes/config';
import {SocketIoModule, SocketIoConfig} from 'ng-socket-io';
import {User} from './classes/user';
import {LogoutComponent} from './logout/logout.component';
import {HomeComponent} from './home/home.component';
import {SnotifyModule, SnotifyService, ToastDefaults} from 'ng-snotify';
import {DepositComponent} from './deposit/deposit.component';
import {WithdrawComponent} from './withdraw/withdraw.component';
import { BonusComponent } from './bonus/bonus.component';
import { MoreComponent } from './more/more.component';
import { FaqComponent } from './faq/faq.component';
import { AuthokComponent } from './authok/authok.component';
import { ProfileComponent } from './profile/profile.component';

const config: SocketIoConfig = {url: 'http://7loto.ru:8080', options: {}};

const appRoutes: Routes = [
  {path: 'auth/vkontakte', component: AuthComponent},
  {path: 'logout', component: LogoutComponent},
  {path: '', component: HomeComponent},
  {path: 'deposit', component: DepositComponent},
  {path: 'withdraw', component: WithdrawComponent},
  {path: 'bonus', component: BonusComponent},
  {path: 'more', component: MoreComponent},
  {path: 'faq', component: FaqComponent},
  {path: 'auth/ok', component: AuthokComponent},
  {path: 'profile', component: ProfileComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LogoutComponent,
    HomeComponent,
    DepositComponent,
    WithdrawComponent,
    BonusComponent,
    MoreComponent,
    FaqComponent,
    AuthokComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes
    ),
    SocketIoModule.forRoot(config),
    SnotifyModule
  ],
  providers: [Config, User, {provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
