import { Component, OnInit } from '@angular/core';
import {Config} from '../classes/config';

@Component({
  selector: 'app-authok',
  templateUrl: './authok.component.html',
  styleUrls: ['./authok.component.css']
})
export class AuthokComponent implements OnInit {

  constructor(public config: Config) {
    this.config.isLoading = true;
  }

  ngOnInit() {
    window.location.href = `${this.config.domainServer}/auth/odnoklassniki`;
  }

}
