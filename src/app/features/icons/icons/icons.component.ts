 import { Component,ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { Chart } from 'angular-highcharts';
@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})
export class IconsComponent {

  lineChart = new Chart({
    chart: {
      type: 'line'
    },
    title: {
      text: 'Linechart'
    },
    credits: {
      enabled: false
    },
    series: [
      {type:'pie',
        data: [1, 2, 3]
      }
    ]
  });
  pieChart = new Chart({
    chart: {
      type: 'pie',
      plotShadow: false,
    },
    credits: {
      enabled: false
    },
    plotOptions:{
      pie:{
        innerSize: '99%',
        borderWidth:10,
        borderColor:'',
        slicedOffset:10,
        dataLabels:{
          connectorWidth:0,
        },

      },
    },
    title:{
      verticalAlign:'middle',
      floating:true,
      text: 'Diseases',
    },
    legend:{
      enabled:false,
    },
    series: [
      {
        type:'pie',
        data:[
          {name:'Discapacidad 1', y:1, color:'#eeeeee'},
          {name:'Discapacidad 2', y:2, color:'#393e46'},
          {name:'Discapacidad 3', y:3, color:'#00adb5'},

        ]
      }
    ]
  }); }
