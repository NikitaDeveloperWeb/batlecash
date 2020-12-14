import {Component, OnInit} from '@angular/core';
import {Socket} from 'ng-socket-io';
import {Config} from '../classes/config';
import {st} from "@angular/core/src/render3";

declare var $: any;

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {

  isLoading = true;

  constructor(private socket: Socket, private config: Config) {
    this.config.isLoading = true;

    this.socket.emit('user.loadWithdraws');

    this.socket.on('user.loadWithdraw', (data) => {
      $('#wd_history').html('');
      if (data.length === 0) {
        $('#wd_history').html('<h6 style="text-align: center; margin-top: 20px;">История пуста</h6>');
      }
      data.forEach((withdraw) => {
        let status_html = '';
        if (withdraw['status'] === 0) {
          status_html = '<div class="status_wait"><i class="fas fa-spinner" data-toggle="tooltip" title="" data-original-title="Ожидание"></i></div>';
        } else if (withdraw['status'] === 1) {
          status_html = '<div class="status_success"><i class="fas fa-check-circle" data-toggle="tooltip" title="" data-original-title="Выполнено"></i></div>';
        } else if (withdraw['status'] === 2) {
          status_html = '<div class="status_decline"><i class="fas fa-times" data-toggle="tooltip" title="" data-original-title="Откланено"></i></div>';
        }
        $('#wd_history').append('<div class="withdraw-history-item">\n' +
          '      <div class="row">\n' +
          '        <div class="col-2">\n' +
          '          <i class="far fa-calendar-alt" data-toggle="tooltip" title="" style="cursor: help" data-original-title="' + withdraw['date'] + '"></i>\n' +
          '        </div>\n' +
          '        <div class="col-6">\n' +
          '          <img src="../static/wallets/4.png" style="width: 1em; height: 1em;">' + withdraw['phone'] + '\n' +
          '        </div>\n' +
          '        <div class="col-2">\n' +
          '          ' + withdraw['sum'] + '\n' +
          '        </div>\n' +
          '        <div class="col-2">\n' +
          '          ' + status_html + '\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </div>');
      });
      this.isLoading = false;
      this.config.isLoading = false;
    });
  }

  ngOnInit() {
  }

  withdraw(sum, phone, method) {
    this.socket.emit('user.withdraw', {
      sum: sum,
      phone: phone,
      method: method
    });
  }

}
