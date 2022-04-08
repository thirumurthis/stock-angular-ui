import { StockInfo } from './data/stock-info';
import { ErrorHandlerService } from './shared/error-handler.service';
import { Router, NavigationStart } from '@angular/router';
import { Signupresponse } from './signupresponse';
import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {catchError,throwError, Subject, Observable} from  'rxjs';
import { UserInfo } from './user-info';
import { AlertserviceService } from './alertservice.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    Authorization: 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url : string ="";
  token : string ="";
  header: any;

  constructor(private http: HttpClient,private router: Router,private errorHandler: ErrorHandlerService) { 
    this.url = environment.url;
    const headerSetting : {[name: string]:string | string[]} = {};
    this.header = new HttpHeaders(headerSetting);
    }

  signup(model:any): Observable<Signupresponse>{
    //console.log(model);
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Signupresponse>(this.url+'stock-app/signup',model,httpOptions).pipe(
      catchError(err => {
        this.errorHandler.handleError(err);
        return throwError(()=>new Error('Error occurred during submission'))
      })
    );
  }

  getApiKey(model: any): Observable<Signupresponse>{
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Signupresponse>(this.url+'stock-app/apikey',model,httpOptions).pipe(
      catchError(err => {
        this.errorHandler.handleError(err);
        return throwError(()=>new Error("Couldn't login error occurred during submission"))
      })
  )}

  getStockInfo(model : any): Observable<StockInfo>{
    //const headers = new HttpHeaders();
    //headers.append('Content-Type', 'application/json');
    //headers.append('Accept', 'application/json');
    //headers.append('Authorization', 'Bearer '+model.jwtToken);
    //headers.append('Access-Control-Allow-Origin', 'http://localhost:8080');
    //headers.append('Access-Control-Allow-Credentials', 'true');
    //const httpOptions = { headers: headers };
    const httpOptions = { headers : new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ model.jwtToken
    })}
    //console.log("print header info:- "+httpOptions)
    debugger
    return this.http.post<StockInfo>(this.url+'stock/v1/stock-info',model,httpOptions).pipe(
      catchError(err => {
        this.errorHandler.handleError(err);
        return throwError(()=>new Error("Couldn't get stock info error occurred during submission"))
      })
  )
  } 

  getToken(model : any) : Observable<Signupresponse>{
    debugger
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Signupresponse>(this.url+'stock-app/token',model,httpOptions).pipe(
      catchError(err => {
        this.errorHandler.handleError(err);
        return throwError(()=>new Error("Couldn't get stock info error occurred during submission"))
      })
    )
  }

  addStock(model:any):Observable<any>{
    const httpOptions = { headers : new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ model.jwtToken
    })}
    let stockRequest = {"symbol":model.symbol,"stockCount":model.stockCount,"avgStockPrice":model.avgStockPrice};
    return this.http.post<any>(this.url+'stock/v1/add',stockRequest,httpOptions).pipe(
      catchError(err => {
        this.errorHandler.handleError(err);
        return throwError(()=>new Error("Couldn't add stock info error occurred during submission"))
      })
    )
  }

  deleteStock(model:any):Observable<any>{
    const httpOptions = { headers : new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ model.jwtToken
    })}
    let symbol = model.symbol;
    return this.http.delete<any>(this.url+'stock/v1/delete/'+symbol+'/force',httpOptions).pipe(
      catchError(err => {
        this.errorHandler.handleError(err);
        return throwError(()=>new Error("Couldn't delete stock info error occurred during submission"))
      })
    )
  }

  updateStock(model:any):Observable<any>{
    const httpOptions = { headers : new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ model.jwtToken
    })}
    let stockRequest = [{"symbol":model.symbol,"stockCount":model.stockCount,"avgStockPrice":model.avgStockPrice}];
    return this.http.put<any>(this.url+'stock/v1/update/stocks',stockRequest,httpOptions).pipe(
      catchError(err => {
        this.errorHandler.handleError(err);
        return throwError(()=>new Error("Couldn't delete stock info error occurred during submission"))
      })
    )
  }

  isLoggedIn():boolean{
    let token = this.getValueFromSessionStorage("jwt");
    if(token){
      return true;
    }
    return false;
  }

  logout(){
    let userId = this.getValueFromSessionStorage("userId");
    if(userId)
        localStorage.removeItem(userId);
  }
  private getValueFromSessionStorage(key: string) : string|null{
    let userId = sessionStorage.getItem("userId")
    return userId;
  }

}
