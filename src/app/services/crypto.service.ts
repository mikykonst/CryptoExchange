import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  url = 'https://api.coinranking.com/v1/public/coins';

  constructor(private http: HttpClient) {
  }

  getAllCurrencies() {
    return this.http.get(this.url);
  }

  getCurrencyBySymbols(...symbols) {
    return this.http.get(`${this.url}?symbols=${symbols.toString()}`);
  }

  getExchangeHistoryById(id, timeframe) {
    return this.http.get(`https://api.coinranking.com/v1/public/coin/${id}/history/${timeframe}`);
  }
}
