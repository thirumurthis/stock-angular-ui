import { StockInfo } from './../data/stock-info';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorHandlerService } from './../shared/error-handler.service';
import { catchError, throwError, Observable, map, Subscription } from 'rxjs';
import { Signupresponse } from './../signupresponse';
import { LoginService } from './../login.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { StockDetails } from '../data/stock-details';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-stock-result',
  templateUrl: './stock-result.component.html',
  styleUrls: ['./stock-result.component.css']
})
export class StockResultComponent implements OnInit, OnDestroy {

  public apiKey : any ="";
  public userId : any ="";
  public jwtToken : any ="";
  public signupResponse: Signupresponse = new Signupresponse("","","");
  public msg: any = "";
  private tokenSub : Subscription = new Subscription();
  private apiSub : Subscription = new Subscription();
  private stockSub : Subscription = new Subscription();

  displayedColumns:string[] = ["symbol","companyName","currentPrice","currentInvestedAmount","actualInvestedAmount","difference","profitOrLoss","lastAccessed"]

  displayHeader: string[] = ["Symbol","Company Name","Current Price","Current Invested Amount","Actual Invested Amount","Difference","Profit/Loss","Last Accessed"]
  public dataSource: MatTableDataSource<StockDetails> = new MatTableDataSource();
  public stocks : StockInfo = new StockInfo();

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
  ngOnDestroy(): void {
    this.tokenSub.unsubscribe();
    this.apiSub.unsubscribe();
    this.stockSub.unsubscribe();
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort = new MatSort();

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
    this.getStockDetails({"userName":this.userId,"apiKey":this.apiKey,"jwtToken":this.jwtToken});
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
        this.dataSource.sort = this.sort;
        //debugger
      }
    )
  }

  addStockPath(){
    this.router.navigate(['/add-stock']);
  }

  deleteStock(){
    this.router.navigate(['/delete-stock']);
  }
}
