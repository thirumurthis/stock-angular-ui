import { Router } from '@angular/router';
import { AlertserviceService } from './../alertservice.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit,OnDestroy {

  public message :any ={};
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
   }

   backToHome(){
     this.router.navigate(['/login']);
   }
}
