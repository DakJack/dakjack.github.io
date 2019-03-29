import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { RestService } from '../rest.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  private mergedData: any;
  private groupedData: any;
  private channelData: any[] = [];
  private dataLoaded: boolean = false;
  private url: string = 'https://api.thingspeak.com/channels/{{channel_id}}/feeds.json?api_key={{channel_key}}&results=1000';
  private channels: any[] = [ { id: "686886", key: "8X5MFI6TH6PFFSHB"}, { id: "719733", key: "C1UHDHGSYC10VBJU"}];
  private chartData: Object[] = [];

  constructor(private router: Router, private rest: RestService) {

   }

  ngOnInit() {
    this.channels.forEach((channel) => {
      let builtUrl = this.url.replace("{{channel_id}}", channel.id).replace("{{channel_key}}",channel.key);

      this.rest.Get(builtUrl).then((data) => {
        this.channelData.push(data);
        if (this.channelData.length == this.channels.length){
          this.mergedData = this.mergeData();
         // this.groupedData = this.groupDataByDay(this.mergeData());
          this.renderCharts();
        }
      });
    });
  }

  private mergeData(): Object{
    let mergedData = {};

    this.channelData.forEach((data) => {
      Object.entries(data.channel).forEach((entry) => {
        if (entry[0].indexOf("field") > -1) {
          let fieldName = "field" + (Object.keys(mergedData).length + 1);
          let item = {"field": fieldName, "value": entry[1]};

          let values = [];
          let dates = [];
          Object.entries(data.feeds).forEach((feed) => {
            let value = feed[1][entry[0]];
            let date = feed[1]["created_at"];

            values.push(parseFloat(value));
            dates.push(new Date(date));
          });

          let fieldAndValues = {'field': entry[1], 'values': values, 'dates': dates};

          mergedData[fieldName] = fieldAndValues;
        }
      });
    })
    console.log(mergedData);
    return mergedData;
  }

  // private groupDataByDay(input): any{
  //   let groupedData = {};

  //   let day

    
  //   Object.entries(input).forEach((data) => {
  //     let rawData:any = data[1];


  //   });

  //   return groupedData;
  // }

  private renderCharts(): void{

    Object.entries(this.mergedData).forEach((data) => {
      let rawData:any = data[1];

      let chart = Highcharts;
      let chartOptions = {
        title: {text: ''},
        yAxis: {
          title: {
              text: rawData.field
          }
        },
        plotOptions: {
          series: {
              label: {
                  connectorAllowed: false,
                  data: rawData.dates
              },
              //pointStart: 2010
          }
        },
        series: [{
            showInLegend: false,
            name: rawData.field,
            data:  rawData.values
        }],
        responsive: {
          rules: [{
              condition: {
                  maxWidth: 500
              },
              chartOptions: {
                  legend: {
                      layout: 'horizontal',
                      align: 'center',
                      verticalAlign: 'bottom'
                  }
              }
          }]
        }

      };
      let chartObj = {chart: chart, options: chartOptions}

      console.log(rawData);

      this.chartData.push(chartObj)
    });
    this.dataLoaded = true;
  }

}