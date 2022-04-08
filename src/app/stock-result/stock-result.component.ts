import { StockInfo } from './../data/stock-info';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorHandlerService } from './../shared/error-handler.service';
import { catchError, throwError, Observable, map, Subscription, tap } from 'rxjs';
import { Signupresponse } from './../signupresponse';
import { LoginService } from './../login.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { StockDetails } from '../data/stock-details';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-stock-result',
  templateUrl: './stock-result.component.html',
  styleUrls: ['./stock-result.component.css']
})
export class StockResultComponent implements OnInit, AfterViewInit, OnDestroy {

  public apiKey : any ="";
  public userId : any ="";
  public jwtToken : any ="";
  public signupResponse: Signupresponse = new Signupresponse("","","");
  public msg: any = "";
  private tokenSub : Subscription = new Subscription();
  private apiSub : Subscription = new Subscription();
  private stockSub : Subscription = new Subscription();
  // Originally used column header
  //displayedColumns:string[] = ["symbol","companyName","currentPrice","currentInvestedAmount","actualInvestedAmount","difference","profitOrLoss","lastAccessed"]
  // removed few of them
  displayedColumns:string[] = ["symbol","stockCount","currentPrice","currentInvestedAmount","actualInvestedAmount","difference","profitOrLoss"]
  displayHeader: string[] = ["Symbol","# of Stock","Current Price","Current Invested Amount","Actual Invested Amount","Difference","Profit/Loss"]
 // displayHeader: string[] = ["Symbol","Company Name","Current Price","Current Invested Amount","Actual Invested Amount","Difference","Profit/Loss","Last Accessed"]
  public dataSource: MatTableDataSource<StockDetails> = new MatTableDataSource();
  public stocks : StockInfo = new StockInfo();
  public subForStockPage = new Subscription();

  length = 100;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  public maxPerPageSize : number = 5;
  public toolTipMsg? : string ="";
  constructor(private router: Router,
              private loginService: LoginService, 
              private errorHandler : ErrorHandlerService,
              private snackbar : MatSnackBar) { 
    this.msg = this.router.getCurrentNavigation()?.extras.state;
    console.log("message from the other route:- "+this.msg)
    if(this.msg){
      this.snackbar.open(this.msg.msg, 'close', {duration: 10000});
    }
    this.userId = sessionStorage.getItem("userId");
    if(this.userId){
      this.apiKey = localStorage.getItem(this.userId);
    }
    this.getToken({"userName":this.userId,"apiKey":this.apiKey});
  }
  ngAfterViewInit(): void {
    let model = {"userName":this.userId,"apiKey":this.apiKey,"jwtToken":this.jwtToken};
    //in this lifecycle hook the pagintor member variable will be avialable
    if(this.paginator)
        this.paginator.page
        .pipe(

          //we add tap side effect operator 
          //to reload the new page.
          tap( () => this.getStockPaginatorData(this.paginator?.pageIndex ?? 0,
                 this.paginator?.pageSize ?? 5))
        ).subscribe()
  }
  ngOnDestroy(): void {
    this.tokenSub.unsubscribe();
    this.apiSub.unsubscribe();
    this.stockSub.unsubscribe();
    this.subForStockPage.unsubscribe();
  }

  @ViewChild(MatSort, {static: true}) sort?: MatSort; // initialzing the component is an antipattern
  //we tell need to handle the paginator event
  //@viewchild decorator will get the event from the template
  // we need the MatPageinator event 
  @ViewChild(MatPaginator) paginator?: MatPaginator;// for providing default value use ??
  // NOTE the viewchild decartor not ncessarily gets inialized on the ngInit
  // but it should be available part of ngAfterinitView. so we use that hook here.

  //Since there was a mattable exception in the browser couldn't find the
  //template rowRender
  @ViewChild(MatTable) matTable?: MatTable<{string: string}>;
  ngOnInit(): void {

    //console.log("init- invoked the stock route")
    this.userId = sessionStorage.getItem("userId");
    if(this.userId){
      this.apiKey = localStorage.getItem(this.userId);
    }
    this.getToken({"userName":this.userId,"apiKey":this.apiKey});
    if(!this.jwtToken || this.jwtToken ===''|| this.jwtToken == null){
      this.jwtToken = sessionStorage.getItem("jwt");
    } 
    // commented this to check the paginator
    this.getStockDetails({"userName":this.userId,"apiKey":this.apiKey,"jwtToken":this.jwtToken});
    //this.getStockPage({"userName":this.userId,"apiKey":this.apiKey,"jwtToken":this.jwtToken},0,5);
  }

  getToken(model:any){
//    debugger;
    this.tokenSub = this.loginService.getToken(model).pipe(
      catchError(err => {
        //console.log('Handling error locally and rethrowing it...', err);
        this.errorHandler.handleError(err);
        return throwError(() => new Error('Error occurred during submission'));
      })
    ).subscribe(
      response => {
       // console.log("response from token:- "+response);
        this.signupResponse = new Signupresponse(response.statusMessage, response.apiKey, response.userId);
        this.signupResponse.setsStatusAndToken(response.status,response.jwtToken);
        this.jwtToken=response.jwtToken;
        sessionStorage.setItem("jwt",this.jwtToken);
      })
  }
  getApiDetails(model: any){
   this.apiSub = this.loginService.getApiKey(model).pipe(
          catchError(err => {
            //console.log('Handling error locally and rethrowing it...', err);
            this.errorHandler.handleError(err);
            return throwError(() => new Error('Error occurred during submission'));
          })
        ).subscribe(
          response => {
            //console.log(response);
            this.signupResponse = new Signupresponse(response.statusMessage, response.apiKey, response.userId);
            this.signupResponse.setsStatusAndToken(response.status,response.jwtToken);
            //console.log(response.jwtToken);
          })
  }

  getStockDetails(model:any){
    //console.log(model)
     this.stockSub = this.loginService.getStockInfo(model).pipe(
      map(res => Object.assign(new StockInfo(),res))
    ).subscribe(
      (response : StockInfo)  => {
       // console.log(response);
        this.stocks = response;
        
        this.dataSource = new MatTableDataSource(this.stocks.stockInfo);
        if(this.sort)  //since we using ? undefined we need to check using if
            this.dataSource.sort = this.sort;
        //debugger
        if(this.paginator)  // since we are using undefined during initialization better to use if 
        this.dataSource.paginator = this.paginator;
      }
    )
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
  }
  /* currrently below is not used, if in case the backend has 
  the ablity to fetch from the backend based on the pagenumber we can  use it
   not used for now.
  */
  getStockPage(model:any,pageStart:number,pageEnd:number){
    //console.log(model)
     this.subForStockPage = this.loginService.getStockInfo(model).pipe(
      map(res => Object.assign(new StockInfo(),res))
    ).subscribe(
      (response : StockInfo)  => {
        debugger;
       // console.log(response);
        this.stocks = response;
        //if(pageStart >=1 && pageStart <=this.stocks.stockInfo.length) pageStart--;
        let start = pageStart;// >=this.stocks.stockInfo.length? this.stocks.stockInfo.length:pageStart;
        let end = pageEnd;// >= this.stocks.stockInfo.length ? this.stocks.stockInfo.length : pageEnd;
        console.log("start && end: "+start+" "+end);
        let responseArray = this.stocks.stockInfo.slice(pageStart,end);
        console.log("result "+JSON.stringify(response) +" length: "+responseArray.length);
        
        this.dataSource = new MatTableDataSource(responseArray);
        if(this.sort)
            this.dataSource.sort = this.sort;
        if(this.paginator)  // since we are using undefined during initialization better to use if 
           this.dataSource.paginator = this.paginator;
        //debugger
      }
    )
  }

  getStockPaginatorData(pageIndex:number,pageSize:number){
    //console.log(model)
        //if(pageStart >=1 && pageStart <=this.stocks.stockInfo.length) pageStart--;
        let start = pageIndex*pageSize;// 0 * 5 =0; 1 * 5=5>=this.stocks.stockInfo.length? this.stocks.stockInfo.length:pageStart;
        let end = (pageIndex*pageSize)+pageSize;// >= this.stocks.stockInfo.length ? this.stocks.stockInfo.length : pageEnd;
        console.log("start && end: "+start+" "+end);
        let responseArray = this.stocks.stockInfo.slice(start,end);
        //this.dataSource = new MatTableDataSource(responseArray);
        this.dataSource = new MatTableDataSource(this.stocks.stockInfo);
        if(this.sort)
            this.dataSource.sort = this.sort;
        if(this.paginator)  // since we are using undefined during initialization better to use if 
           this.dataSource.paginator = this.paginator;
        //debugger
      }
  
    getToolTipData(selectSymbol: string): string {

       if(selectSymbol){
       //  console.log(selectSymbol);
        const stock = this.stocks.stockInfo.find(i => i.symbol === selectSymbol);
       // console.log(JSON.stringify(stock)+" - "+stock?.companyName);
        this.toolTipMsg = stock?.companyName;
        return `${stock?.companyName}`;
       } else{
          return "";
       }
    }

  addStockPath(){
    this.router.navigate(['/add-stock']);
  }

  deleteStock(){
    this.router.navigate(['/delete-stock']);
  }
}
