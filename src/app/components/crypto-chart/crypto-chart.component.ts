import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'app-crypto-chart',
  templateUrl: './crypto-chart.component.html',
  styleUrls: ['./crypto-chart.component.scss']
})
export class CryptoChartComponent implements OnInit {

  currencyNames: [];
  lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
    { data: [180, 480, 770, 90, 1000, 270, 400], label: 'Series C', yAxisID: 'y-axis-1' }
  ];

  lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType = 'line';
  barChartOptions: any = { legend: { display: true, labels: { fontColor: 'black' } } };
  public barChartData = [];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(private _currencyService: CurrencyService) { }

  ngOnInit() {
    this._currencyService.getCurrency().subscribe((result: any) => {
      this.currencyNames = result.data.coins.map((coin: any) => coin.symbol);
      let currencies = [];
      currencies = result.data.coins.forEach((coin: any) => {
        this.barChartLabels = coin.history;
        if (coin.symbol === 'BTC' || coin.symbol === 'ETH' || coin.symbol === 'XLM') {
          this.barChartData.push({ label: coin.symbol, data: coin.history.map(item => parseFloat(item)) });
        }
      });
    });
  }

  deleteCryptoFromList(event, currency) {
    const index = this.barChartData.indexOf(currency);
    this.barChartData.splice(index, 1);
  }


}
