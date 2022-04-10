import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject, Optional } from '@angular/core';

@Component({
  selector: 'app-dialog-stock-delete',
  templateUrl: './dialog-stock-delete.component.html',
  styleUrls: ['./dialog-stock-delete.component.css']
})
export class DialogStockDeleteComponent implements OnInit {


  public symbols : string[] = [];
  public selectedSymbol :string = "";

  public userId : any = "";
  public apiKey : any ="";
  public jwtToken: any = "";

  //@Optional() - used to prevent error when there is no data in the dialog token
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
               public dialogRef: MatDialogRef<DialogStockDeleteComponent>) { 
                 this.symbols = data.symbols;
                 this.userId = data.userId;
                 this.apiKey = data.apiKey;
                 this.jwtToken = data.jwtToken;
               }

  ngOnInit(): void {
  }

  public validInput : boolean = true;
  closeDialog(eventName: string) {
    debugger;
    let stockData = {};
    if (eventName === 'delete') {
      if (!this.selectedSymbol || this.selectedSymbol == "Select Sybmol") {
        this.validInput = false;
      }
      if (!this.validInput) {
        return;
      }
      stockData = { "userName": this.userId, "apiKey": this.apiKey, "jwtToken": this.jwtToken, "symbol": this.selectedSymbol};
    } 
    this.dialogRef.close({ event: eventName, data: stockData });
  }
}
