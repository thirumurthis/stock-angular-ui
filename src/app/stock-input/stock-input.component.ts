import { StockInfo } from './../data/stock-info';
import { Signupresponse } from './../signupresponse';
import { throwError, catchError } from 'rxjs';
import { ErrorHandlerService } from './../shared/error-handler.service';
import { LoginService } from './../login.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock-input',
  templateUrl: './stock-input.component.html',
  styleUrls: ['./stock-input.component.css']
})
export class StockInputComponent implements OnInit {

  validInput : boolean = true;
  public sybmol : string = "";
  public stockCount: number = 0.0;
  public avgStockPrice : number = 0.0;
  public userId : any = "";
  public apiKey : any ="";
  public jwtToken: any = "";
  public stockAddEvent: boolean=true;
  public signupResponse: Signupresponse = new Signupresponse("","","");

  constructor(private router: Router,
              private loginService : LoginService, 
              private errorHandler : ErrorHandlerService ) { 

    let userId = sessionStorage.getItem("userId");
    if(!userId || userId==null){
      this.router.navigate(['/404']);
    }
    this.userId = sessionStorage.getItem("userId");
    if(this.userId){
      this.apiKey = localStorage.getItem(this.userId);
    }
    this.getToken({"userName":this.userId,"apiKey":this.apiKey});
  }

  ngOnInit(): void {

    console.log("init- invoked the stock route")
    if(!this.jwtToken || this.jwtToken ===''){
      this.jwtToken = sessionStorage.getItem("jwt");
    } 
    //this.getStockDetails({"userName":this.userId,"apiKey":this.apiKey,"jwtToken":this.jwtToken});
  }

  onSubmit(){

    if(!this.sybmol || this.sybmol =='' || !this.avgStockPrice || this.avgStockPrice == 0.0
      || !this.stockCount || this.stockCount ==0.0){
      this.validInput= false;
      return;
    }
    let model = {"userName":this.userId,"apiKey":this.apiKey,"jwtToken":this.jwtToken,"symbol":this.sybmol,"stockCount":this.stockCount,"avgStockPrice":this.avgStockPrice};
    if(this.stockAddEvent){
      this.loginService.addStock(model).pipe(
      catchError(err => {
        //console.log('Handling error locally and rethrowing it...', err);
        this.errorHandler.handleError(err);
        return throwError(() => new Error('Error occurred during submission'));
      }))
      .subscribe(
         response => {
        console.log(" MESSAGE FROM the add stock flow:- "+response);
        if(response.status === "Successfully added stock"
        || response.status === "Stock info already exists in DB."){
          console.log("to invoke the stock-info flow")
          this.router.navigate(['stock-info'],{state:{msg:response.status}})
        }else{
          this.router.navigate(['alert'])
        }
      })
    }else{
      this.loginService.updateStock(model)
      .pipe(
        catchError(err => {
          //console.log('Handling error locally and rethrowing it...', err);
          this.errorHandler.handleError(err);
          return throwError(() => new Error('Error occurred during submission'));
        }))
        .subscribe(
           response => {
            this.router.navigate(['stock-info'],{state:{msg:response.status}})
        })  
      }
  }

  getToken(model:any){
    this.loginService.getToken(model).pipe(
      catchError(err => {
        //console.log('Handling error locally and rethrowing it...', err);
        this.errorHandler.handleError(err);
        return throwError(() => new Error('Error occurred during submission'));
      })
    ).subscribe(
      response => {
        console.log(response);
        this.signupResponse = new Signupresponse(response.statusMessage, response.apiKey, response.userId);
        this.signupResponse.setsStatusAndToken(response.status,response.jwtToken);
        console.log(response.jwtToken);
      })
  }

  executeStockEvent(stockEvent:any){
    if(stockEvent === "add"){
      this.stockAddEvent = true;
    }
    if(stockEvent === "update"){
      this.stockAddEvent = false;
    }
  }
  /*
  getApiDetails(model: any){
    this.loginService.getApiKey(model).pipe(
          catchError(err => {
            //console.log('Handling error locally and rethrowing it...', err);
            this.errorHandler.handleError(err);
            return throwError(() => new Error('Error occurred during submission'));
          })
        ).subscribe(
          response => {
            console.log(response);
            this.signupResponse = new Signupresponse(response.statusMessage, response.apiKey, response.userId);
            this.signupResponse.setsStatusAndToken(response.status,response.jwtToken);
            console.log(response.jwtToken);
          })
  }
*/
  /*
  addStock(model:any){
    this.loginService.addStock(model).pipe()
    .subscribe(
      (response : any)  => {
        console.log(" MESSAGE FROM the add stock flow:- "+response);
        if(response.status === "Successfully added stock"
        || response.status === "Stock info already exists in DB."){
          console.log("to invoke the stock-info flow")
          this.router.navigate(['stock-info'])
        }else{
          this.router.navigate(['alert'])
        }
      }
    )
  }
  */
}
