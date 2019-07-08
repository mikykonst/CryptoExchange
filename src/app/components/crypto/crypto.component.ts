import { Component, OnInit, ViewChild } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { Chart } from 'chart.js';
import { MatPaginator, MatSort, MatTableDataSource, Sort } from '@angular/material';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss']
})
export class CryptoComponent implements OnInit {

  cryptoArray: Array<any>;
  timestamp: [];
  displayedColumns: any[] = [];
  headers: string[];
  columnsToDisplay: string[];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private cryptoService: CryptoService) {
  }

  ngOnInit() {
    this.cryptoService.coinsData.subscribe(value => {
      this.cryptoArray = value;
      this.displayedColumns = [];
      this.headers = [];
      this.columnsToDisplay = [];
      this.convertDataToValidArray(this.cryptoArray);
      this.headers = Object.keys(this.displayedColumns[0]);
      this.columnsToDisplay = this.headers.slice();
      this.dataSource = new MatTableDataSource(this.displayedColumns);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    this.getMainCurrencies();
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

  getMainCurrencies() {
    return this.cryptoService.getCurrencyBySymbols('BTC', 'ETH', 'XLM').subscribe((response: any) => {
      response.data.coins.forEach((coin: any) => {
        this.getExchangeHistoryById(coin.id);
      });
    });
  }

  getExchangeHistoryById(id: number) {
    return this.cryptoService.getExchangeHistoryById(id, '30d').subscribe((response: any) => {
      this.timestamp = response.data.history.map((item: any) => (
        new Date(item.timestamp).toLocaleString()
      ));
    });
  }

  convertArrayOfObjectsToCSV(args) {
    let result;
    let ctr;
    let keys;
    let columnDelimiter;
    let lineDelimiter;
    let data;

    data = args.data || null;
    if (data == null || !data.length) {
      return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach((item) => {
      ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) {
          result += columnDelimiter;
        }

        result += item[key];
        ctr++;
      });
      result += lineDelimiter;
    });
    return result;
  }

  downloadCSV() {
    const args = {filename: 'stock-data.csv'};
    let data;
    let filename;
    let link;
    let csv = this.convertArrayOfObjectsToCSV({
      data: this.displayedColumns
    });
    if (csv == null) {
      return;
    }

    filename = args.filename || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
      csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
  }
}
