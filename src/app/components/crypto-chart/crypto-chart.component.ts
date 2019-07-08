import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-crypto-chart',
  templateUrl: './crypto-chart.component.html',
  styleUrls: ['./crypto-chart.component.scss']
})
export class CryptoChartComponent implements OnInit {
  
  dataArray: any[] = [];
  chart: any;
  datasets = [];
  labels = [];
  displayedColumns: any[] = [];
  headers: string[] = [];

  constructor(private cryptoService: CryptoService) {
  }

  ngOnInit() {
    this.cryptoService.coinsData.subscribe((value: any) => {
      this.dataArray = value;
      this.displayedColumns = [];
      this.convertDataToValidArray(this.dataArray);
      this.headers = this.dataArray[0].data.map(data => data.date.toLocaleString());
      this.createChart();
    });
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
      this.datasets = [];
      this.labels = [];
    }
    const keys = Object.keys(this.displayedColumns[0]);
    const datasets = [];
    keys.forEach(key => {
      if (key !== 'date') {
        datasets.push({
          data: this.displayedColumns.map(coin => {
            return coin[key];
          }),
          borderColor: '#29e7ff',
          fill: false,
          label: key
        });
      }
    });
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: this.headers,
        datasets: datasets
      },
      options: {
        tooltips: {
          enabled: true
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

  convertDataToValidArray(data: any[]) {
    data.forEach((coin: any) => {
      coin.data.forEach((coinData: any, index) => {
        const eachExchange = {};
        eachExchange['date'] = coinData.date.toLocaleString();
        eachExchange[coin.name] = coinData.price;
        if (this.displayedColumns[index] && !this.displayedColumns[index].hasOwnProperty(coin.name)) {
          this.displayedColumns[index][coin.name] = coinData.price;
        } else {
          this.displayedColumns.push(eachExchange);
        }
      });
    });
  }
}
