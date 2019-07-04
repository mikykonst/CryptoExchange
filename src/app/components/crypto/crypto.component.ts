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
        return {price: item.price, dateTime: item.timestamp = new Date(parseFloat(item.timestamp))};
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
      debugger;
      this.cryptoArray.push({
        name: symbol, data: response.data.history.map((item: any) => (
          {date: new Date(item.timestamp).toLocaleString(), price: item.price}
        ))
      });
    });
  }
}
