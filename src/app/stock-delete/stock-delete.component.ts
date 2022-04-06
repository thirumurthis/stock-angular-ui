import { catchError, throwError, Subscription, subscribeOn } from 'rxjs';
import { Signupresponse } from './../signupresponse';
import { ErrorHandlerService } from './../shared/error-handler.service';
import { LoginService } from './../login.service';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-stock-delete',
  templateUrl: './stock-delete.component.html',
  styleUrls: ['./stock-delete.component.css']
})
export class StockDeleteComponent implements OnInit, OnDestroy {

  public sybmol : any = "";
  public validInput : boolean = true;
  public userId : any = "";
  public apiKey : any ="";
  public jwtToken: any = "";
  public signupResponse: Signupresponse = new Signupresponse("","","");

  private subForToken : Subscription = new Subscription();
  private subForDStock : Subscription = new Subscription();

  constructor(protected router : Router, 
              protected loginService: LoginService,
              protected errorHandler : ErrorHandlerService) { 
    let userId = sessionStorage.getItem("userId");
    if(!userId || userId==null){
      this.router.navigate(['/404']);
    }
    this.userId = sessionStorage.getItem("userId");
    if(this.userId){
      this.apiKey = localStorage.getItem(this.userId);
    }
    debugger
    this.getToken({"userName":this.userId,"apiKey":this.apiKey});
  }
  ngOnDestroy(): void {
    this.subForDStock.unsubscribe();
    this.subForToken.unsubscribe();
  }

  ngOnInit(): void {
  }

  getToken(model:any){
    debugger
    this.loginService.getToken(model).pipe(
      catchError(err => {
        //console.log('Handling error locally and rethrowing it...', err);
        this.errorHandler.handleError(err);
        return throwError(() => new Error('Error occurred during submission'));
      })
    ).subscribe(
      response => {
        this.signupResponse = new Signupresponse(response.statusMessage, response.apiKey, response.userId);
        this.signupResponse.setsStatusAndToken(response.status,response.jwtToken);
        this.jwtToken = response.jwtToken;
      })
  }

  onSubmit(){
    let model = {"userName":this.userId,"apiKey":this.apiKey,"jwtToken":this.jwtToken,"symbol":this.sybmol};
    this.loginService.deleteStock(model).pipe(
      catchError(err => {
        //console.log('Handling error locally and rethrowing it...', err);
        this.errorHandler.handleError(err);
        return throwError(() => new Error('Error occurred during submission'));
      }))
      .subscribe(
         response => {
          console.log(" MESSAGE FROM the add stock flow:- "+response);
          if(response.status){
              this.router.navigate(['stock-info'],{state:{msg:response.status}})
          }else{
            this.router.navigate(['alert'])
          }
      })
  }

  backToStockInfo(){
    this.router.navigate(['/stock-info']);
  }

}
