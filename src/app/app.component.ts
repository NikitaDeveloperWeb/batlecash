import {Component} from '@angular/core';
import {Config} from './classes/config';
import {Socket} from 'ng-socket-io';
import {User} from './classes/user';
import {SnotifyService} from "ng-snotify";
import {Observable} from "rxjs";

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  as = 1;
  isLoading = true;

  chatBan(id) {
    this.socket.emit('chat.ban', id);
  }

  deleteMessage(id) {
    this.socket.emit('chat.delete', id);
  }

  constructor(public config: Config, private socket: Socket, public user: User, private snotifyService: SnotifyService) {
    this.config.domainServer = 'http://7loto.ru:3000';
    this.config.nameSite = '7loto.ru';
    this.config.isLoading = true;

    this.isLoading = this.config.isLoading;
    $('title').text(this.config.nameSite);

    this.socket.on('auth', (data) => {
      if (data.auth) {
        this.user.auth = true;
        this.user.id = data.user.id;
        this.user.username = data.user.username;
        this.user.avatar = data.user.avatar;
        this.user.identificator = data.user.identificator;
        this.user.balance = data.user.balance;
        this.user.time = data.user.time;
        this.user.status = data.user.status;
        this.user.provider = data.user.provider;
      } else {
        this.user.auth = false;
      }
    });

    this.socket.on('online', (online) => {
      $('#online').text(online);
    });

    this.socket.on('chat.load', (messages) => {
      $('#message_block').html('');
      messages.forEach((data) => {
        let adm_act1 = '';
        let adm_act2 = '';
        if (this.user.status === 4) {
          adm_act1 = '<i class="fas fa-lock" style="color: #3454D1; margin-right: 5px;cursor: pointer" data-id="' + data['user']['id'] + '"></i>';
          adm_act2 = '<i class="fas fa-trash-alt chaticon" style="color: #D1345B" data-id="' + data['id'] + '"></i>';
        }
        const prefix = [['', 'span'], ['[PREMIUM] ', 'premium'], ['[VIP] ', 'vip'], ['<i class="fab fa-youtube"></i> ', 'yt'], ['<i class="fas fa-crown"></i> ', 'adm']];
        if (data.user.status === 4 || data.user.status === 5) {
          let color = '#d1345b';
          let username = 'Администратор';
          if (data.user.status === 5) { username = 'Модератор'; color = 'blue'; }
          $('#message_block').append('<div class="message-item" message_id="' + data.id + '"><div class="flex" style="justify-content: left;"><div class="ava" style="background-image: url(https://vk.com/images/camera_50.png?ava=1); cursor: pointer;"></div><div class="message-name" style="color: ' + color + '">' + adm_act1 + '<' + prefix[data.user.status][1] + '>' + prefix[data.user.status][0] + '</' + prefix[data.user.status][1] + '>' + username + adm_act2 + '</div></div><div class="message-text">' + data.message + '</div></div>');
        } else {
          let url = 'https://vk.com/id' + data.user.identificator;
          if (data.user.provider === 'odnoklassniki') { url = 'https://ok.ru/profile/' + data.user.identificator; }
          $('#message_block').append('<div class="message-item" message_id="' + data.id + '"><div class="flex" style="justify-content: left;"><div class="ava" style="background-image: url(' + data.user.avatar + '); cursor: pointer;" onclick="window.open(\'' + url + '\')"></div><div class="message-name">' + adm_act1 + '<' + prefix[data.user.status][1] + '>' + prefix[data.user.status][0] + '</' + prefix[data.user.status][1] + '>' + data.user.username + adm_act2 + '</div></div><div class="message-text">' + data.message + '</div></div>');
        }
      });
      if (this.as === 1) {
        $('#message_block')[0].scrollTop = $('#message_block')[0].scrollHeight;
      }
      $('.message-item').not($('.message-item').slice(-50)).remove();
      $('#message_block .fa-lock').click((event) => {
        this.chatBan($(event.currentTarget).data('id'));
      });
      $('#message_block .fa-trash-alt').click((event) => {
        this.deleteMessage($(event.currentTarget).data('id'));
      });
    });

    this.socket.on('chat.newMessage', (data) => {
      let adm_act1 = '';
      let adm_act2 = '';
      if (this.user.status === 4) {
        adm_act1 = '<i class="fas fa-lock" style="color: #3454D1; margin-right: 5px;cursor: pointer" (click)="this.chatBan(' + data['user']['id'] + ')"></i>';
        adm_act2 = '<i class="fas fa-trash-alt chaticon" style="color: #D1345B" (click)="this.deleteMessage(' + data['id'] + ')"></i>';
      }
      const prefix = [['', 'span'], ['[PREMIUM] ', 'premium'], ['[VIP] ', 'vip'], ['<i class="fab fa-youtube"></i> ', 'yt'], ['<i class="fas fa-crown"></i> ', 'adm']];
      if (data.user.status === 4 || data.user.status === 5) {
        let color = '#d1345b';
        let username = 'Администратор';
        if (data.user.status === 5) { username = 'Модератор'; color = 'blue'; }
        $('#message_block').append('<div class="message-item" message_id="' + data.id + '"><div class="flex" style="justify-content: left;"><div class="ava" style="background-image: url(https://vk.com/images/camera_50.png?ava=1); cursor: pointer;"></div><div class="message-name" style="color: ' + color + '">' + adm_act1 + '<' + prefix[data.user.status][1] + '>' + prefix[data.user.status][0] + '</' + prefix[data.user.status][1] + '>' + username + adm_act2 + '</div></div><div class="message-text">' + data.message + '</div></div>');
      } else {
        let url = 'https://vk.com/id' + data.user.identificator;
        if (data.user.provider === 'odnoklassniki') { url = 'https://ok.ru/profile/' + data.user.identificator; }
        $('#message_block').append('<div class="message-item" message_id="' + data.id + '"><div class="flex" style="justify-content: left;"><div class="ava" style="background-image: url(' + data.user.avatar + '); cursor: pointer;" onclick="window.open(\'' + url + '\')"></div><div class="message-name">' + adm_act1 + '<' + prefix[data.user.status][1] + '>' + prefix[data.user.status][0] + '</' + prefix[data.user.status][1] + '>' + data.user.username + adm_act2 + '</div></div><div class="message-text">' + data.message + '</div></div>');
      }
      if (this.as === 1) {
        $('#message_block')[0].scrollTop = $('#message_block')[0].scrollHeight;
      }
      $('.message-item').not($('.message-item').slice(-50)).remove();
      $('#message_block .fa-lock').click((event) => {
        this.chatBan($(event.currentTarget).data('id'));
      });
      $('#message_block .fa-trash-alt').click((event) => {
        this.deleteMessage($(event.currentTarget).data('id'));
      });
    });

    this.socket.on('user.updateBalance', (data) => {
      if (this.user.id === data['id']) {
        $('#balance').text(data['balance']);
      }
    });

    this.socket.on('user.notify', (data) => {
      if (data['id'] === this.user.id) {
        if (data['type'] === 'success') {
          this.snotifyService.success(data['message'], 'Оповещение', {
            timeout: 3000
          });
        } else if (data['type'] === 'error') {
          this.snotifyService.error(data['message'], 'Оповещение', {
            timeout: 3000
          });
        }
      }
    });
  }

  sendMessage() {
    const message = $('#chatMessage').val();
    message.replace(/[<>\/\\]/i, '');

    if (message.length > 0) {
      $('#chatMessage').val('');
      this.socket.emit('chat.sendMessage', message);
    }
  }

  autoScroll() {
    if (this.as === 1) {
      this.as = 0;
      $('#autoscroll').css('color', '#070707');
    } else {
      this.as = 1;
      const chat_scroll = $('#message_block')[0];
      chat_scroll.scrollTop = chat_scroll.scrollHeight;
      $('#autoscroll').css('color', '#3454D1');
    }
  }
}
