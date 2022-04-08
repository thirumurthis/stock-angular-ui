import { StockDetails } from './../data/stock-details';
import { Router } from '@angular/router';
import { StockInfo } from './../data/stock-info';
import { InfoService } from './../info.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { catchError, throwError, map, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit, OnDestroy {

  public stocks : StockInfo = new StockInfo();
  
  displayedColumns:string[] = ["symbol","currentPrice","currentInvestedAmount","actualInvestedAmount","difference","profitOrLoss"]
  public displaySpinner: boolean = true;
  /*
  displayHeader: any[] = [{"symbol":"Symbol"},
                           {"companyName":"Company Name"},
                          {"currentPrice":"Current Price"},
                          {"currentInvestedAmount":"Current Invested $"},
                          {"actualInvestedAmount":"Actual Invested $"},
                          {"difference":"Difference"},
                          {"profitOrLoss":"Profit/Loss"},
                          {"lastAccessed":"Last Accessed"}];
  */
 displayHeader: string[] = ["Symbol","Current Price","Current Invested Amount","Actual Invested Amount","Difference","Profit/Loss"]
  // create the table only for hte stock info details
  //dataSource : any = {};
  public dataSource: MatTableDataSource<StockDetails> = new MatTableDataSource();

  private subForInfo : Subscription = new Subscription();
  constructor(private infoservice : InfoService,private router: Router) { }

  ngOnDestroy(): void {
    this.subForInfo.unsubscribe();
  }

  //@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator = new MatPaginator( new MatPaginatorIntl());
  @ViewChild(MatSort, {static: true}) sort: MatSort = new MatSort();

 // @ViewChild(MatSort) sort: MatSort = new MatSort();
  ngOnInit(): void {
    this.getSampleStockInfo();
  }

  getSampleStockInfo (){
    //console.log("invoke info endpoint");
    this.subForInfo = this.infoservice.getAppInfo().pipe(
      map(res => Object.assign(new StockInfo(),res))
    ).subscribe(
      (response : StockInfo)  => {
        //console.log(response);
        this.stocks = response;
        this.dataSource = new MatTableDataSource(this.stocks.stockInfo);
        this.dataSource.sort = this.sort;
        this.displaySpinner =  false;
        //console.log("from the call "+this.dataSource.data)
        //this.router.navigate(['/info'],{state :{stocks:this.stocks}});
      }
    )
  }

  getToolTipData(selectSymbol: string): string {

    if(selectSymbol){
    //  console.log(selectSymbol);
     const stock = this.stocks.stockInfo.find(i => i.symbol === selectSymbol);
    // console.log(JSON.stringify(stock)+" - "+stock?.companyName);
     //this.toolTipMsg = stock?.companyName;
     return `${stock?.companyName}`;
    } else{
       return "";
    }
 }

  backToLogin(){
    this.router.navigate(['/login']);
  }

}
