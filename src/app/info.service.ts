import { Observable } from 'rxjs';
import { StockInfo } from './data/stock-info';
import { environment } from './../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  url : string = "";
  constructor(private http: HttpClient, private router: Router) { 
    this.url = environment.url;
  }

  getAppInfo(): Observable<StockInfo>{
    // adding a debugger
    //debugger;
    return this.http.get<StockInfo>(this.url+'stock-app/info');
  }

}
