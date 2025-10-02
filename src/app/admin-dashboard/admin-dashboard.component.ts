import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})


export class AdminDashboardComponent  {
  constructor(private router: Router) { }
  userData = JSON.parse(localStorage.getItem("too_auth_user")!);
  // ngOnInit(): void {
  //   if (this.userData == null) {
  //     this.router.navigate(['login'])
  //   }
  //   if (this.userData != null) {
  //     this.router.navigate(['admin-dashboard'])
  //   }
  // }


  _make_LocalStorage_empty() {
    localStorage.removeItem("too_auth_user");
    this.router.navigate(['']);
  }
}
