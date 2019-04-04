import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThingspeakChartsComponent } from './thingspeak-charts.component';

describe('ThingspeakChartsComponent', () => {
  let component: ThingspeakChartsComponent;
  let fixture: ComponentFixture<ThingspeakChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThingspeakChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThingspeakChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
