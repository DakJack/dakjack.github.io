import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomePageComponent} from './home-page/home-page.component';
import {CVComponent} from './cv/cv.component';
import {ThingspeakChartsComponent} from './thingspeak-charts/thingspeak-charts.component';
import {RtfLoaderComponent} from './rtf-loader/rtf-loader.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'resume',
    component: CVComponent
  },
  {
    path: 'plant',
    component: ThingspeakChartsComponent
  },
  {
    path: 'articles',
    component: RtfLoaderComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
