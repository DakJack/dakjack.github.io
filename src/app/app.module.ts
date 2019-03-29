// Core
import { NgModule } from '@angular/core';

// Declarations
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CVComponent } from './cv/cv.component';

// Imports
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HighchartsChartComponent } from 'highcharts-angular';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    CVComponent,
    HighchartsChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
