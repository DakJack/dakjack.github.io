import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.scss']
})
export class CVComponent implements OnInit {

  restService: RestService;
  personalInformation: any

  constructor(private rest: RestService) {
    this.restService = rest;
  }

  ngOnInit() {
    this.getRestData();
  }

  private getRestData(): any {
    this.restService.Get('assets/personal.json').then((data) => {
      this.personalInformation = data;
  });
  }
}