import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Socket} from 'ng-socket-io';
import {User} from '../classes/user';
import {Config} from '../classes/config';

declare var $: any;

@Component({
  selector: 'app-bonus',
  templateUrl: './bonus.component.html',
  styleUrls: ['./bonus.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BonusComponent implements OnInit {

  isLoading = false;
  promocode = '';

  constructor(private socket: Socket, public user: User, private config: Config) {
    this.config.isLoading = true;
    this.promocode = `C0${this.user.id}`;

    let node = document.createElement('script');
    node.src = 'https://www.google.com/recaptcha/api.js';
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);

    this.socket.emit('user.loadReferrals');

    this.socket.on('user.loadReferral', (referral) => {
      $('#referrals').text(referral);

      this.isLoading = false;
      this.config.isLoading = false;
    });
  }

  ngOnInit() {
  }

  promoUse(promo) {
    this.socket.emit('user.promoUse', {
      promo: promo,
      recaptcha_response: $('.g-recaptcha-response').val()
    });
  }

  createPromo(name, val, use) {
    this.socket.emit('user.createPromo', {
      name: name,
      val: val,
      use: use
    });
  }

}
