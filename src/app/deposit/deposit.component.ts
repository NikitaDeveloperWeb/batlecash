import {Component, OnInit} from '@angular/core';
import {Socket} from 'ng-socket-io';
import {Config} from '../classes/config';

declare var $: any;

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
    styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {

    isLoading = true;

    constructor(private socket: Socket, private config: Config) {
      this.config.isLoading = true;
        this.socket.emit('user.loadDeposits');

        this.socket.on('user.loadDeposit', (data) => {
            $('.add-history').html('');
            if (data.length === 0) {$('.add-history').html('<h6 style="text-align: center; margin-top: 20px;">История пуста</h6>');}
            data.forEach((payment) => {
                $('.add-history').append('<div class="add-history-item"><div class="row">\n' +
                    '        <div class="col-6" style="text-align: center;">\n' +
                    '          <h3><i class="fas fa-coins" style="margin-right: 10px"></i>' + payment['sum'] + '</h3>\n' +
                    '        </div>\n' +
                    '        <div class="col-6" style="text-align: center;">\n' +
                    '          <h3><i class="far fa-calendar-alt" style="margin-right: 10px"></i>' + payment['date'] + '</h3>\n' +
                    '        </div>\n' +
                    '      </div></div>');
            });
          this.config.isLoading = false;
            this.isLoading = false;
        });

        this.socket.on('user.checkDeposit', (data) => {
          window.location.href = data;
        });
    }

    ngOnInit() {
    }

    deposit(sum) {
        this.socket.emit('user.deposit', sum);
    }

}
