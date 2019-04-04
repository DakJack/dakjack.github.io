import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-thingspeak-charts',
  templateUrl: './thingspeak-charts.component.html',
  styleUrls: ['./thingspeak-charts.component.scss']
})
export class ThingspeakChartsComponent implements OnInit {
  private groupedData: any;
  private channelData: any[] = [];
  private dataLoaded: boolean = false;
  private url: string = 'https://api.thingspeak.com/channels/{{channel_id}}/feeds.json?api_key={{channel_key}}&results=1500';
  private channels: any[] = [ { id: "686886", key: "8X5MFI6TH6PFFSHB"}, { id: "719733", key: "C1UHDHGSYC10VBJU"}];
  private chartData: Object[] = [];

  constructor(private rest: RestService) {

   }

   // idea: move all of the chart stuff into it's own component then you can plop it anywhere and move it easily. Also this controller would be more clean

  ngOnInit() {
    // this would be nice if it were synchronous
    this.channels.forEach((channel) => {
      let builtUrl = this.url.replace("{{channel_id}}", channel.id).replace("{{channel_key}}",channel.key);

      this.rest.Get(builtUrl).then((data) => {
        this.channelData.push(data);
        if (this.channelData.length == this.channels.length){
          this.groupedData = this.groupDataByHour(this.mergeData());
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
    });
    return mergedData;
  }

  private groupDataByHour(input): any{
    let groupedData = {};

    
    Object.entries(input).forEach((data) => {
      let rawData:any = data[1];

      let groupedDates = [];
      let groupedValues = [];
      let currentDate: Date = rawData.dates[0]; // a temp comparisson variable
      let dayData = []; // a temp comparisson variable

      for(let i = 0; i < rawData.dates.length; i++){
        var date = rawData.dates[i];
        var value = rawData.values[i];

        // checking if the dates match hour, if so add them to the array
        if(currentDate.getFullYear() == date.getFullYear() 
        && currentDate.getMonth() == date.getMonth() 
        && currentDate.getDate() == date.getDate() 
        && currentDate.getHours() == date.getHours()){
          dayData.push(value)  
        }
        else{
          let sum:number = 0;
          let sumCount: number = 0;
          dayData.forEach((dayValue) => {
            sum += dayValue;
            sumCount++;
          });
          
          groupedValues.push(sum/sumCount);
          groupedDates.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours()));

          // resetting the values and putting it into the temp array
          dayData = [];
          dayData.push(value);
          currentDate = date;
        }
      }
      groupedData[data[0]] = {"field": rawData.field, 'values': groupedValues, 'dates': groupedDates};
    });

    
    let normalizedReturnData = {};
    // normalize start date of all data
    let latestStartDate:Date = new Date(0);
    let shortestArrayCount:number = 0;
    Object.entries(groupedData).forEach((object) =>{
      let data:any = object[1];
      let date = data.dates[0];
      if(latestStartDate < date){
        latestStartDate = date;
        shortestArrayCount = data.dates.length;
      }
    });

    Object.entries(groupedData).forEach((object) => {
      let data:any = object[1];
      let resultData:any = {};

      if(data.dates[0] < latestStartDate){
        // trim the data
        let returnDates = [];
        let returnValues = [];

        for(let i = 0; i < data.dates.length; i++){
          let currentDate = data.dates[i];

          if (currentDate >= latestStartDate){
            returnDates.push(currentDate);
            returnValues.push(data.values[i]);
          }

        }

        resultData['field'] = data.field;
        resultData['values'] = returnValues;
        resultData['dates'] = returnDates;
        resultData['tickDivisor'] = returnDates.length / shortestArrayCount;

      }
      else{
        data["tickDivisor"] = 1;
        resultData = data;
      }

      normalizedReturnData[object[0]] = resultData;
    });

    console.log(latestStartDate);


    return normalizedReturnData;
  }

  private renderCharts(): void{
 

    Object.entries(this.groupedData).forEach((data) => {
      let rawData:any = data[1];
      rawData['formattedDates'] = [];

      //convert date to user friendly string
      for(let i = 0; i < rawData.dates.length; i++){
        rawData.formattedDates.push(this.formatDate(rawData.dates[i]));
      }

      let chart = Highcharts;
      let chartOptions = {
        global: {
          useUTC: false
        },
        title: {text: ''},
        yAxis: {
          title: {
              text: rawData.field
          }
        },
        tooltip: {
          valueDecimals: 2
        },
        plotOptions: {
          series: {
              marker: {
                  enabled: false
              },
              color: "#0077be"
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
     if (Object.keys(this.groupedData).indexOf(data[0]) == (Object.keys(this.groupedData).length - 1)){
        chartOptions['xAxis'] = {
          type: 'datetime',
          tickInterval: 10 * rawData.tickDivisor,
          categories: rawData.formattedDates,
          lineColor: '#000000',
        };
      }
      else{
        chartOptions['credits'] = {
          enabled: false
        };
        chartOptions['xAxis'] = {
          visible: true,
          labels: {
            enabled: false
          },
          lineColor: '#000000',
          tickLength: 0,
          minorTickLength: 0
        };
      }


      let chartObj = {chart: chart, options: chartOptions}

      this.chartData.push(chartObj)
    });
    this.dataLoaded = true;
  }

  private formatDate(input: Date):string{
    let days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];   

    let formatAMPM =(date) => { // This is to display 12 hour format like you asked
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ampm;
      return strTime;
    }
    return days[input.getDay()] + ' ' + formatAMPM(input);
  }
}
