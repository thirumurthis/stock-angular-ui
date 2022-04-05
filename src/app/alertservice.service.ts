import { NavigationStart, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertserviceService {

   private subject = new Subject<any>();
   private keepAfterNavigationChange : boolean = false;
  constructor(private router: Router) {
    //cleare route on route change event
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart){
        if(this.keepAfterNavigationChange){
          this.keepAfterNavigationChange = false;
        }else{
          //clear alert
          this.subject.next("")
        }

      }
    })
   }

   success(message: string, keepAfterNavigationChange =false){
     this.keepAfterNavigationChange = keepAfterNavigationChange;
     this.subject.next({type :'success', text: message});
   }

   error(message: string, keepAfterNavigationChange =false){
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({type :'error', text: message});
  }

  getMessage(): Observable<any>{
    return this.subject.asObservable();
  }
}
