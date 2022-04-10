import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-stock-edit',
  templateUrl: './dialog-stock-edit.component.html',
  styleUrls: ['./dialog-stock-edit.component.css']
})
export class DialogStockEditComponent implements OnInit {

  public sybmol : string = "";
  public stockCount: number = 0.0;
  public avgStockPrice : number = 0.0;
  public userId : any = "";
  public apiKey : any ="";
  public jwtToken: any = "";
  public validInput : boolean = true;
  
  constructor(
    public dialogRef : MatDialogRef<DialogStockEditComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any 
  ) { 
    this.userId = data.userId;
    this.apiKey = data.apiKey;
    this.jwtToken = data.jwtToken;
  }

  ngOnInit(): void {
    if(!this.jwtToken || this.jwtToken ===''){
      this.jwtToken = sessionStorage.getItem("jwt");
    } 
  }

  closeDialog(eventName: string) {

    let stockData = {};
    if (eventName == 'add' || eventName == 'update') {
      if (!this.sybmol || !this.avgStockPrice || !this.stockCount) {
        this.validInput = false;
      }
      if (this.stockCount == 0 || this.avgStockPrice == 0) {
        this.validInput = false;
      }
      if (!this.validInput) {
        return;
      }
      stockData = { "userName": this.userId, "apiKey": this.apiKey, "jwtToken": this.jwtToken, "symbol": this.sybmol, "stockCount": this.stockCount, "avgStockPrice": this.avgStockPrice };
    } 
    this.dialogRef.close({ event: eventName, data: stockData })
  }

}
