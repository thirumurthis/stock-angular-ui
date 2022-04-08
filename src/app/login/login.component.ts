import { ErrorHandlerService } from './../shared/error-handler.service';
import { AlertserviceService } from './../alertservice.service';
import { catchError, ignoreElements, throwError, Subscription } from 'rxjs';
import { Signupresponse } from './../signupresponse';
import { LoginService } from './../login.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginValid: boolean = true;
  public username: string = '';
  public password: string = '';
  public message: any = {};
  private api: boolean = false;
  public singupResponse: Signupresponse = new Signupresponse("", "", "");
  private login: boolean = false;
  private signup: boolean = false;
  private apiKey : any ="";
  private userId : any ="";
  private subForLogin : Subscription = new Subscription();
  private subForSignup : Subscription = new Subscription();
  private subForApi : Subscription = new Subscription();

  model: any = {};
  constructor(private router: Router, private loginService: LoginService, private errorHandler: ErrorHandlerService) {
    sessionStorage.removeItem('userId');
    sessionStorage.clear();
  }
   ngOnDestroy(): void {
     //throw new Error('Method not implemented.');
   }
   
  onSubmit() {
    //debugger;

    this.model = { "userName": this.username, "password": this.password };
    if (this.signup) {
      this.subForSignup = this.loginService.signup(this.model)
        .pipe(
          catchError(err => {
            //console.log('Handling error locally and rethrowing it...', err);
            this.errorHandler.handleError(err);
            return throwError(() => new Error('Error occurred during submission'));
          })
        ).subscribe(
          response => {
            //console.log(response);
            this.singupResponse = new Signupresponse(response.statusMessage, response.apiKey, response.userId);
            if (response.statusMessage != "") {
              this.router.navigate(['/home'], { state: { msg: this.singupResponse } });
            } else {
              this.loginValid = false;
              console.log("Error connecting to application")
            }
          })
    } else if (this.api) {
      //debugger
      //console.log("invoked to get apikey")
      this.subForApi = this.loginService.getApiKey(this.model)
        .pipe(
          catchError(err => {
            //console.log('Handling error locally and rethrowing it...', err);
            this.errorHandler.handleError(err);
            return throwError(() => new Error('Error occurred during submission'));
          })
        ).subscribe(
          response => {
            //console.log(response);
            this.singupResponse = new Signupresponse(response.statusMessage, response.apiKey, response.userId);
            this.singupResponse.setsStatusAndToken(response.status, response.jwtToken);
            //console.log(response.jwtToken);
            if (response.statusMessage != "") {
              this.router.navigate(['/home'], { state: { msg: this.singupResponse } });
            } else {
              this.loginValid = false;
              console.log("Error connecting to application")
            }
          })
    } else if (this.login) {
      //debugger
      //console.log("invoked to get apikey")
     this.subForLogin = this.loginService.getApiKey(this.model)
        .pipe(
          catchError(err => {
            //console.log('Handling error locally and rethrowing it...', err);
            this.errorHandler.handleError(err);
            return throwError(() => new Error('Error occurred during submission'));
          })
        ).subscribe(
          response => {
            //console.log(response);
            this.singupResponse = new Signupresponse(response.statusMessage, response.apiKey, response.userId);
            this.singupResponse.setsStatusAndToken(response.status, response.jwtToken);
            //console.log(response.jwtToken);
            if (response.jwtToken != null) {
              this.loginValid = true;
              this.checkAndSetSessionAndLocalStorage(this.singupResponse);
              sessionStorage.setItem("jwt",this.singupResponse.jwtToken);
              debugger
              this.router.navigate(['/stock-info']);
            }else{
              this.loginValid = false;
            }
          })
    }
  }
  ngOnInit(): void {
  }

  public requestType(type: string) {
    if (type === 'apikey') {
      this.api = true;
    }
    if (type === 'login') {
      this.login = true;
    }
    if (type === 'signup') {
      this.signup = true;
    }
  }

  private checkAndSetSessionAndLocalStorage(responseInfo : Signupresponse) : string|null {
    //console.log("in check method:= "+responseInfo)
    if(responseInfo == null){
      return null;
    }
    //debugger
    this.singupResponse = responseInfo;
    this.apiKey = this.singupResponse.apiKey;
    this.userId = this.singupResponse.userId;
    //console.log("in check method u "+this.userId+" and api "+this.apiKey);
    if(sessionStorage.getItem("userId") == null){
    //  console.log("came to this part");
      sessionStorage.setItem("userId",this.userId);
      localStorage.setItem(this.userId,this.apiKey);
    }
    if(sessionStorage.getItem("jwt")==null){
      sessionStorage.setItem("jwt",this.singupResponse.jwtToken);
    }
    return this.userId;
  }

  private getUserIdFromSessionStorage() : string|null{
    let userId = sessionStorage.getItem("userId")
    return userId;
  }

  private getAPIKeyFromLocalStorage() : string| null {
    let userIdFromSession = this.getUserIdFromSessionStorage();
    if(userIdFromSession == null) return null;
    return localStorage.getItem(userIdFromSession);
  }

}
