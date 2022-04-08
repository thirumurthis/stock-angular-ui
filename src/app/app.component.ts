import { DialogComponent } from './dialog/dialog/dialog.component';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Stock App';

  constructor(private router: Router, private dialog: MatDialog){}
  logout(){

    let userId = sessionStorage.getItem("userId");
    if(userId){
      localStorage.removeItem(userId);
    }
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("jwt");

    this.router.navigate(['login']);
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
