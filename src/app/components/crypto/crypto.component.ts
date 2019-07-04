import { Component, OnInit, ViewChild } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss']
})
export class CryptoComponent implements OnInit {

  cryptoArray: Array<any>;
  exchanges: Array<any>;
  timestamp: [];

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

  @ViewChild(BaseChartDirective, { read: true }) chart: BaseChartDirective;


  constructor(private cryptoService: CryptoService) {
  }

  ngOnInit() {
    this.timestamp = [];
    this.exchanges = [];
    this.cryptoArray = [];
    this.getMainCurrencies();
  }

  getCurrencies() {
    this.cryptoService.getAllCurrencies().subscribe((res: any) => {
      return res.data.history.map((item: any) => {
        return { price: item.price, dateTime: item.timestamp = new Date(parseFloat(item.timestamp)) };
      });
    });
  }

  getMainCurrencies() {
    return this.cryptoService.getCurrencyBySymbols('BTC', 'ETH', 'XLM').subscribe((response: any) => {
      response.data.coins.forEach((coin: any) => {
        this.getExchangeHistoryById(coin.id, coin.symbol);
      });
    });
  }

  getExchangeHistoryById(id: number, symbol: string) {
    return this.cryptoService.getExchangeHistoryById(id, '30d').subscribe((response: any) => {
      this.timestamp = response.data.history.map((item: any) => (
        new Date(item.timestamp).toLocaleString()
      ));
      this.cryptoArray.push({
        name: symbol,
        data: response.data.history.map((item: any) => (
          { date: new Date(item.timestamp).toLocaleString(), price: item.price }
        ))
      });

      this.barChartData.push({
        label: symbol,
        data: response.data.history.map((item: any) => parseFloat(item.price))
      });
    });
  }
}
