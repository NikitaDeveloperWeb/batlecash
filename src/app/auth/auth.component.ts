import { Component, OnInit } from '@angular/core';
import {Config} from '../classes/config';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(public config: Config) {
    this.config.isLoading = true;
  }

  ngOnInit() {
    window.location.href = `${this.config.domainServer}/auth/vkontakte`;
  }

}
