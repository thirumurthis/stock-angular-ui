import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogStockEditComponent } from './dialog-stock-edit.component';

describe('DialogStockEditComponent', () => {
  let component: DialogStockEditComponent;
  let fixture: ComponentFixture<DialogStockEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogStockEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogStockEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
