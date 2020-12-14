import { Component, OnInit } from '@angular/core';
import {Config} from '../classes/config';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  isLoading = true;

  constructor(public config: Config) {
    this.config.isLoading = true;
    this.config.isLoading = false;
    this.isLoading = false;
  }

  ngOnInit() {
  }

}
