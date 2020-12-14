import { Component, OnInit } from '@angular/core';
import {User} from '../classes/user';
import {Socket} from 'ng-socket-io';
import {Config} from '../classes/config';

declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(public user: User, private socket: Socket, private config: Config) {
    this.config.isLoading = true;
    this.socket.emit('user.loadProfile');

    this.socket.on('user.profile', (data) => {
      $('#history_profile').html('');
      for (const bet of data['historyBets']) {
        let color = '#3454D1';
        let wonColor = '#3454D1';
        let winColor = 'green';
        if (bet['betColor'] === 'red') {
          color = '#D1345B';
        }
        if (bet['colorWin'] === 0) {
          wonColor = '#D1345B';
        }
        if (bet['win']  === 0) {
          winColor = 'red';
        }
        $('#history_profile').append('<div class="withdraw-history-item" style="padding: 3px 0px 3px 0px;border-bottom: 1px solid #000000;">\n' +
          '        <div class="row">\n' +
          '          <div class="col-2">\n' +
          '            #' + bet['id'] + '\n' +
          '          </div>\n' +
          '          <div class="col-2">\n' +
          '            ' + bet['sum'] + '\n' +
          '          </div>\n' +
          '          <div class="col-2">\n' +
          '            <div class="lastgame" style="background-color: ' + color + '; width: 25px;\n' +
          '    height: 25px;"></div>\n' +
          '          </div>\n' +
          '          <div class="col-3">\n' +
          '            <div class="lastgame" style="background-color: ' + wonColor + '; width: 25px;\n' +
          '    height: 25px;"></div>\n' +
          '          </div>\n' +
          '          <div class="col-2" style="color: ' + winColor + '">\n' +
          '            ' + bet['winSum'] + '\n' +
          '          </div>\n' +
          '        </div>\n' +
          '      </div>');
      }
      this.config.isLoading = false;
    });
  }

  ngOnInit() {
  }

}
