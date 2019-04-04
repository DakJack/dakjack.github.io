import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RtfLoaderComponent } from './rtf-loader.component';

describe('RtfLoaderComponent', () => {
  let component: RtfLoaderComponent;
  let fixture: ComponentFixture<RtfLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RtfLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RtfLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
