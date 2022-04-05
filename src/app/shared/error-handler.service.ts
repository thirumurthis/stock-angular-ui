import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  private errorMessage : string="";

  constructor(private router: Router) { }

  public handleError = (error: HttpErrorResponse) => {
    console.log(error);
    if(error.status === 500){
      this.handle500Error(error);
    }else if(error.status === 404){
      this.handle404Error(error);
    }else if (error.status === 401){
      this.handle404Error(error);
    }else {
      this.handleOtherError(error);
    }
  }

  private handle500Error = (error: HttpErrorResponse)=>{
    this.createErrorMessage(error);
    this.router.navigate(['/404']);
  }
  private handle404Error = (error: HttpErrorResponse)=>{
    this.createErrorMessage(error);
    this.router.navigate(['/404']);
  }

  private handleOtherError = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    console.log("ERROR MESSAGE VALUE:- "+JSON.stringify(this.errorMessage));
    this.router.navigate(['/alert']);
  }

  private createErrorMessage(error: HttpErrorResponse){
    this.errorMessage = error.error ? error.error : error.statusText;
  }
}
