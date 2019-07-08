import { Component, OnInit, ViewChild } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  cryptoArray: Array<any>;
  exchanges: Array<any>;
  timestamp: [];
  data: any;
  coinsNames: Array<any>;
  @ViewChild('coinslist') private coinsList;


  constructor(private cryptoService: CryptoService) {
  }

  ngOnInit() {
    this.timestamp = [];
    this.exchanges = [];
    this.cryptoService.coinsData.subscribe(value => {
      this.getCurrenciesNames();
      return this.cryptoArray = value;
    });
    this.getCurrencies('BTC', 'ETH', 'XLM');
  }

  getCurrenciesNames() {
    return this.cryptoService.getAllCurrencies().subscribe((response: any) => {
      this.filterCurrentCoins(response.data.coins.map(coin => ({symbol: coin.symbol, id: coin.id})));
    });
  }

  filterCurrentCoins(coins: []) {
    this.coinsNames = coins;
    return this.cryptoArray.forEach(data => {
      this.coinsNames = this.coinsNames.filter((coin: any) => {
        return coin.symbol !== data.name;
      });
    });
  }

  getCurrencies(...symbols) {
    return this.cryptoService.getCurrencyBySymbols(symbols).subscribe((response: any) => {
      response.data.coins.forEach((coin: any) => {
        this.getExchangeHistoryById(coin.id, coin.symbol);
      });
    });
  }

  getExchangeHistoryById(id: number, symbol: string) {
    return this.cryptoService.getExchangeHistoryById(id, '30d').subscribe((response: any) => {
      this.cryptoArray.push({
        name: symbol, data: response.data.history.map((item: any) => (
          {date: new Date(item.timestamp), price: parseFloat(item.price)}
        ))
      });
      this.cryptoService.coinsData.next(this.cryptoArray);
    });
  }

  deleteCoinByName(name) {
    this.cryptoService.coinsData.next(this.cryptoArray.filter(item => item.name !== name));
  }

  addCoin() {
    const coinName = this.coinsList.nativeElement.selectedOptions[0].text;
    this.getCurrencies(coinName);
  }
}
