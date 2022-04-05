import { throwError, catchError } from 'rxjs';
import { ErrorHandlerService } from './../shared/error-handler.service';
import { LoginService } from './../login.service';
import { Signupresponse } from './../signupresponse';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public response : any = null;
  public msg : Signupresponse = new Signupresponse("","","");
  public apiKey : any = "";
  public userId : any = "";
  public jwtToken : any = "";

  constructor(private router: Router, protected loginService : LoginService, private errorHandler: ErrorHandlerService ) { 
    //console.log(this.router.getCurrentNavigation()?.extras.state);
    this.response = this.router.getCurrentNavigation()?.extras.state;
    this.msg = this.response.msg
    if(this.response != null ){
      console.log("construct:- "+this.response.msg);
     this.userId = this.checkAndSetSessionAndLocalStorage(this.response.msg)
     console.log("set session storage:- "+this.userId);
     sessionStorage.setItem("userId",this.userId);
    }
    
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
    console.log(this.msg.apiKey);
    //set the user id to session storage
    if(this.userId!=null){
      sessionStorage.setItem("userId",this.userId);
    }
    // get the useid from session storage
    this.userId = this.getUserIdFromSessionStorage();
    this.apiKey = this.getAPIKeyFromLocalStorage();
    // use that to fetch the api key
    console.log(this.userId +", "+this.apiKey);
    this.getToken({"userName":this.userId,"apiKey":this.apiKey});

  }

  private checkAndSetSessionAndLocalStorage(responseInfo : Signupresponse) : string|null {
    console.log("in check method:= "+responseInfo)
    if(responseInfo == null){
      return null;
    }
    debugger
    this.msg = responseInfo;
    this.apiKey = this.msg.apiKey;
    this.userId = this.msg.userId;
    console.log("in check method u "+this.userId+" and api "+this.apiKey);
    if(sessionStorage.getItem("userId") == null){
      console.log("came to this part");
      sessionStorage.setItem("userId",this.userId);
      localStorage.setItem(this.userId,this.apiKey);
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

  getStocks(){
    this.getToken({"userName":this.userId,"apiKey":this.apiKey});
    this.router.navigate(['/stock-info'])  
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
        if(response.jwtToken){
          this.jwtToken = response.jwtToken;
          sessionStorage.setItem('jwt',response.jwtToken);
        } else{
          this.router.navigate(['/alert'])
        }
      })
  }
}
