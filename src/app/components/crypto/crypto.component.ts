import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss']
})
export class CryptoComponent implements OnInit {

  cryptoArray: Array<any>;
  exchanges: Array<any>;
  timestamp: [];
  displayedColumns: any[] = [];
  dateExchange: {} = {};

  constructor(private cryptoService: CryptoService) {
  }

  ngOnInit() {
    this.cryptoService.coinsData.subscribe(value => {
      this.cryptoArray = value;
      this.displayedColumns = [];
      this.cryptoArray.forEach((coin: any) => {
        coin.data.forEach((data: any, index) => {
          let test = {};
          test[coin.name] = data.price;
          test['date'] = data.date;
          if (!this.displayedColumns.some(elem => elem.hasOwnProperty(coin.name)) && this.displayedColumns.length > 0) {
            debugger;
            this.displayedColumns[index][coin.name] = data.price;
          } else {
            this.displayedColumns.push(test);
          }
        });
      })
    });
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
    });
  }
  sortByDate(sort: string) {
    debugger;
    this.timestamp.sort((a, b) => {
      return a - b;
    });
  }
  sortByCoin(sort: string) {
    this.cryptoArray.forEach((coin: any) => {
      debugger;
      if (coin.name === sort) {
        coin.data.sort((a, b) => {
          return a.price - b.price;
        })
      }
    });
  }
}
