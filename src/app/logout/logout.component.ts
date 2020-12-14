import { Component, OnInit } from '@angular/core';
import {Config} from '../classes/config';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private config: Config) {
    this.config.isLoading = true;
    window.location.href = `${this.config.domainServer}/logout`;
  }

  ngOnInit() {
  }

}
