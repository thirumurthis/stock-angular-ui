import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockResultComponent } from './stock-result.component';

describe('StockResultComponent', () => {
  let component: StockResultComponent;
  let fixture: ComponentFixture<StockResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
