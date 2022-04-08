import { LoginService } from './../login.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService :LoginService,
              private router: Router){} // injecting the loginservice
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean { // we remove the default returns and keep only true

      if(!this.loginService.isLoggedIn()){
        this.router.navigate(['login']);
        return false;
      }
    return this.loginService.isLoggedIn();
  }
  

  private getTokenFromSessionStorage(){
    let userId = this.getUserIdFromSessionStorage();
    if(userId){
      let token = sessionStorage.getItem("jwt");
      if(token){
        return true;
      }
    }
    return false;
  }
  private getUserIdFromSessionStorage() : string|null{
    let userId = sessionStorage.getItem("userId")
    return userId;
  }

}
