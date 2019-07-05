import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { STOCKS } from '../../models/stocks';
import { CryptoService } from '../../services/crypto.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-crypto-chart',
  templateUrl: './crypto-chart.component.html',
  styleUrls: ['./crypto-chart.component.scss']
})
export class CryptoChartComponent implements OnInit {

  title = 'Crypto Exchange';
  @Input() dataArray: [] = [];
  @ViewChild('lineChart') private chartRef;
  chart: any;
  datasets = [];
  labels = [];

  constructor(private cryptoService: CryptoService) {
  }

  ngOnInit() {
    this.cryptoService.coinsData.subscribe((value: any) => {
      this.dataArray = value;
      this.createChart(this.dataArray.map((data: any) => data.data));
    });
  }

  createChart(data) {
    if (this.chart) {
      this.chart.destroy();
      this.datasets = [];
      this.labels = [];
    }
    data.forEach((coin: any) => {
      this.datasets.push({
        data: coin.map(el => (el.price)), borderColor: '#29e7ff',
        fill: false
      });
      this.labels = coin.map(el => el.date.toLocaleString());
    });
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: this.datasets
      },
      options: {
        tooltips: {
          enabled: false
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
  }
}
