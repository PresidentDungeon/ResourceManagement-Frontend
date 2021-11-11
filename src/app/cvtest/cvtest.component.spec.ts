import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvtestComponent } from './cvtest.component';

describe('CvtestComponent', () => {
  let component: CvtestComponent;
  let fixture: ComponentFixture<CvtestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvtestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvtestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
