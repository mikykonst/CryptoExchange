import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CryptoComponent } from './components/crypto/crypto.component';
import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from './components/main/main.component';
import { CryptoChartComponent } from './components/crypto-chart/crypto-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    CryptoComponent,
    MainComponent,
    CryptoChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
