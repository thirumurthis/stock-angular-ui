import { AuthGuard } from './gaurd/auth.guard';
import { StockDeleteComponent } from './stock-delete/stock-delete.component';
import { StockInputComponent } from './stock-input/stock-input.component';
import { StockResultComponent } from './stock-result/stock-result.component';
import { InfoComponent } from './info/info.component';
import { NotFoundComponent } from './error-pages/not-found/not-found.component';
import { AlertComponent } from './alert/alert.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo:'/login',pathMatch: 'full'},
  {path: 'home',component: HomeComponent}, //Note no need for path to start with /
  {path: 'alert',component: AlertComponent},
  {path: 'info',component: InfoComponent},
  {path: 'stock-info',component: StockResultComponent, canActivate:[AuthGuard]},
  {path: 'add-stock',component: StockInputComponent},
  {path: 'delete-stock',component: StockDeleteComponent},
  {path: '404',component: NotFoundComponent}, 
  { path: '**', redirectTo: '/404', pathMatch: 'full'}, // in redirect it is required to use /
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
