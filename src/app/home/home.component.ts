import {Component, OnInit} from '@angular/core';
import {User} from '../classes/user';
import {Config} from '../classes/config';
import {Socket} from 'ng-socket-io';
import {SnotifyService} from 'ng-snotify';

declare var $: any;
declare var d3: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    isLoading = true;
    isSlider = false;

    constructor(public config: Config, public user: User, public socket: Socket, private snotifyService: SnotifyService) {
      this.config.isLoading = true;
        this.socket.on('game.load', (obj) => {
            try {
                if (obj.red === 0 || obj.blue === 0) {
                    $('#red_persent').html('<i class="fas fa-question"></i>');
                    $('#blue_persent').html('<i class="fas fa-question"></i>');
                    $('#red_tickets').html('<i class="fas fa-question"></i>');
                    $('#blue_tickets').html('<i class="fas fa-question"></i>');
                } else {
                    $('#red_persent').html(Math.round(parseFloat(obj.red) * 100) + '%');
                    $('#blue_persent').html(Math.round(parseFloat(obj.blue) * 100) + '%');
                    $('#red_tickets').html(parseFloat(obj.red) * 1000);
                    $('#blue_tickets').html(parseFloat(obj.red) * 1000 + 1);
                }
            } catch (e) {

            }
            $('#circle').css('transition', '');
            $('#circle').css('transform', 'rotate(0deg)');
            $('#red_list').html(obj.red_list);
            $('#blue_list').html(obj.blue_list);
            if (obj.red === 0 || obj.blue === 0) {
                $('#red_factor').html('<i class="fas fa-question"></i>');
                $('#red_sum').html(obj.red_sum);
                $('#blue_sum').html(obj.blue_sum);
                $('#blue_factor').html('<i class="fas fa-question"></i>');
            } else {
                let coefRed = (100 / (parseFloat(obj.red) * 100)).toFixed(2);
                if (!isFinite(parseFloat(coefRed))) {
                  coefRed = 100.00.toString();
                }
                let coefBlue = (100 / (parseFloat(obj.blue) * 100)).toFixed(2);
                if (!isFinite(parseFloat(coefBlue))) {
                  coefBlue = 100.00.toString();
                }
                $('#red_factor').html('x' + coefRed);
                $('#red_sum').html(obj.red_sum);
                $('#blue_factor').html('x' + coefBlue);
                $('#blue_sum').html(obj.blue_sum);
            }
            if (obj.red > 0 && obj.blue > 0) {
                $('title').text('🔴 ' + Math.round(parseFloat(obj.red) * 100) + '%' + ' ⚔ ' + Math.round(parseFloat(obj.blue) * 100) + '%' + ' 🔵');
            } else {
                $('title').text(this.config.nameSite);
            }

            $('#history').html('');

            for (const game of obj.games) {
                const json = JSON.parse(game.json);
                let color = "";
                if (game.won === 0) {
                    color = 'D1345B';
                } else {
                    color = '3454D1';
                }
                $('#history').append('<form data-id="' + game.id + '" action="https://api.random.org/verify" method="post" target="_blank"><input type="hidden" name="format" value="json"><input type="hidden" name="random" value=\'' + JSON.stringify(json) + '\'><input type="hidden" name="signature" value="' + game.signature + '"><input class="lastgame" type="submit" style="background-color: #' + color + '" value=""></form>');
                $('#history').children().slice(10).remove();
            }

            this.build(obj.blue);
          this.config.isLoading = false;
            this.isLoading = false;
        });

        this.socket.on('game.newBet', (obj) => {
          this.isSlider = false;
            try {
                if (obj.red === 0 || obj.blue === 0) {
                    $('#red_persent').html('<i class="fas fa-question"></i>');
                    $('#blue_persent').html('<i class="fas fa-question"></i>');
                    $('#red_tickets').html('<i class="fas fa-question"></i>');
                    $('#blue_tickets').html('<i class="fas fa-question"></i>');
                } else {
                    $('#red_persent').html(Math.round(parseFloat(obj.red) * 100) + '%');
                    $('#blue_persent').html(Math.round(parseFloat(obj.blue) * 100) + '%');
                    $('#red_tickets').html(parseFloat(obj.red) * 1000);
                    $('#blue_tickets').html(parseFloat(obj.red) * 1000 + 1);
                }
            } catch (e) {

            }
            $('#circle').css('transition', '');
            $('#circle').css('transform', 'rotate(0deg)');
            $('#red_list').html(obj.red_list);
            $('#blue_list').html(obj.blue_list);
            if (obj.red === 0 || obj.blue === 0) {
                $('#red_factor').html('<i class="fas fa-question"></i>');
                $('#red_sum').html(obj.red_sum);
                $('#blue_sum').html(obj.blue_sum);
                $('#blue_factor').html('<i class="fas fa-question"></i>');
            } else {
              let coefRed = (100 / (parseFloat(obj.red) * 100)).toFixed(2);
              if (!isFinite(parseFloat(coefRed))) {
                coefRed = 100.00.toString();
              }
              let coefBlue = (100 / (parseFloat(obj.blue) * 100)).toFixed(2);
              if (!isFinite(parseFloat(coefBlue))) {
                coefBlue = 100.00.toString();
              }
              $('#red_factor').html('x' + coefRed);
              $('#red_sum').html(obj.red_sum);
              $('#blue_factor').html('x' + coefBlue);
              $('#blue_sum').html(obj.blue_sum);
            }
            if (obj.red > 0 && obj.blue > 0) {
                $('title').text('🔴 ' + Math.round(parseFloat(obj.red) * 100) + '%' + ' ⚔ ' + Math.round(parseFloat(obj.blue) * 100) + '%' + ' 🔵');
            } else {
                $('title').text(this.config.nameSite);
            }
            this.build(obj.blue);
        });

        this.socket.on('game.timer', (obj) => {
            if (obj.time < 17) {
                $('#timer').html(17 - obj.time);
                $('#timer').css('-webkit-animation', '');
                $('#timer').css('animation', '');
                $('#timer').css('font-size', '1em');
                if ((17 - obj.time) === 3) {
                    $('#timer').addClass('explode');
                    $('#timer').css('color', '#D1345B');
                    setTimeout(function () {
                        $('#timer').removeClass('explode');
                    }, 3000);
                }
            } else {
                $('#timer').css('font-size', '0.3em');
                $('#timer').css('color', 'rgb(7, 7, 7)');
                $('#timer').removeClass('explode');
                $('#timer').html('Старт через ' + (20 - obj.time));
                $('#timer').css('-webkit-animation', '');
                $('#timer').css('animation', '');
            }
        });

        this.socket.on('game.slider', (obj) => {
          if (!this.isSlider) {
            this.isSlider = true;
            $('#timer').css('font-size', '1em');
            $('#circle').css('transition', 'transform 4s cubic-bezier(0.15, 0.15, 0, 1)');
            $('#circle').css('transform', 'rotate(' + (3600 + obj.number * 0.36) + 'deg)');
            $('#timer').html('<i class="fas fa-play"></i>');
            $('#timer').css('color', '#070707');
            $('title').text('▷ Игра....');
            setTimeout(function () {
              let color = '';
              if (obj.won === 0) {
                color = 'D1345B';
              } else {
                color = '3454D1';
              }
              if ($('form[data-id=' + obj.id + ']').length === 0) {
                  const json = JSON.stringify(obj.json);
                  $('#history').prepend('<form data-id="' + obj.id + '" action="https://api.random.org/verify" method="post" target="_blank"><input type="hidden" name="format" value="json"><input type="hidden" name="random" value=\'' + json + '\'><input type="hidden" name="signature" value="' + obj.signature + '"><input class="lastgame" type="submit" style="background-color: #' + color + '" value=""></form>');
                  $('#history').children().slice(10).remove();
              }
            }, 4000);
            const timeout = setTimeout(() => {
              $('#timer').html('<i class="fas fa-hourglass-start"></i>');
              $('#timer').css('-webkit-animation', 'blink 2s linear infinite');
              $('#timer').css('animation', 'blink 2s linear infinite');
              $('#red_list').html('');
              $('#blue_list').html('');
              $('#circle').css('transition', '');
              $('#circle').css('transform', 'rotate(0deg)');
              $('#red_persent').html('50%');
              $('#blue_persent').html('50%');
              $('title').text(this.config.nameSite);
              $('#red_tickets').html(500);
              $('#blue_tickets').html(501);
              $('#red_factor').html('x2');
              $('#blue_factor').html('x2');
              $('#blue_sum').html('0');
              $('#red_sum').html('0');
              this.build(0.5);
            }, 6000);
          }
        });

        if (this.user.auth) {
          this.socket.emit('user.getBalance');
        }

        this.socket.emit('game.getLoad');
    }

    ngOnInit() {

    }

    bet(color, sum) {
        this.socket.emit('game.bet', {
            color: color,
            sum: sum
        });
    }

    build(blue_cur) {
        const blue = d3.arc()
            .innerRadius(155)
            .outerRadius(180)
            .startAngle(0)
            .endAngle(2 * Math.PI * blue_cur);
        $('#blue').attr('d', blue());
        const red = d3.arc()
            .innerRadius(155)
            .outerRadius(180)
            .startAngle(2 * Math.PI * blue_cur)
            .endAngle(2 * Math.PI);
        $('#red').attr('d', red());
    }

}
