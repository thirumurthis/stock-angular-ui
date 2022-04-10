import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogStockDeleteComponent } from './dialog-stock-delete.component';

describe('DialogStockDeleteComponent', () => {
  let component: DialogStockDeleteComponent;
  let fixture: ComponentFixture<DialogStockDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogStockDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogStockDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
