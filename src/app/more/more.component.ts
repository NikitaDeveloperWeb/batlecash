import { Component, OnInit } from '@angular/core';
import {Socket} from 'ng-socket-io';
import {Config} from '../classes/config';
import {User} from '../classes/user';

declare var $: any;

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.css']
})
export class MoreComponent implements OnInit {
  isLoading = true;

  constructor(private socket: Socket, private config: Config, private user: User) {
    this.config.isLoading = true;
    this.socket.on('user.daily', (data) => {
      $('#dailyBlock').html('');
      if (this.user.provider === 'vkontakte') {
        $('#dailyBlock').html('  <h3>Ежедневный бонус</h3>\n' +
          '  <h6>Не забудьте вступить <a href="https://vk.com/battle_wtf" target="_blank">в группу</a></h6>\n' +
          '  <h6><i class="fas fa-circle icon"></i>Стандартный: 0.1</h6>\n' +
          '  <h6 style="cursor: pointer;" routerLink="/faq"><i class="fas fa-circle icon"></i><span class="premium">[PREMIUM]:</span> 1</h6>\n' +
          '  <h6 style="cursor: pointer;" routerLink="/faq"><i class="fas fa-circle icon"></i><span class="vip">[VIP]:</span> 5</h6>');
      } else {
        $('#dailyBlock').html('  <h3>Ежедневный бонус</h3>\n' +
          '  <h6>Не забудьте вступить <a href="https://ok.ru/group/54296817959132" target="_blank">в группу</a></h6>\n' +
          '  <h6><i class="fas fa-circle icon"></i>Стандартный: 0.1</h6>\n' +
          '  <h6 style="cursor: pointer;" routerLink="/faq"><i class="fas fa-circle icon"></i><span class="premium">[PREMIUM]:</span> 1</h6>\n' +
          '  <h6 style="cursor: pointer;" routerLink="/faq"><i class="fas fa-circle icon"></i><span class="vip">[VIP]:</span> 5</h6>');
      }
      if (data['show']) {
        $('#dailyBlock').append(data['message']);
      } else {
        $('#dailyBlock').append('<h5 id="bonustext" style="color: #6EC932;text-align: center;"><i class="fas fa-lock-open icon"></i>Бонус уже доступен!</h5>');
        $('#dailyBlock').append('<div id="timeBonusBut" class="button" style="background-color: #070707; color: white; margin: 10px auto;"><i class="far fa-handshake" style="margin-right: 5px;"></i>Получить</div>');
        $('#timeBonusBut').click( () => {
          this.dailyBonus();
        });
      }
      this.config.isLoading = false;
      this.isLoading = false;
    });

    this.socket.emit('user.loadDaily');
  }

  ngOnInit() {
  }

  dailyBonus() {
    this.socket.emit('user.dailyBonus');
    this.socket.emit('user.loadDaily');
  }

}
