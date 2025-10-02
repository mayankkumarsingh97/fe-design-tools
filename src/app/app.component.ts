import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pageTitle = "Tool Drawing Management System"
  userData = JSON.parse(localStorage.getItem("too_auth_user")!);
  constructor(
    private router: Router,
  ) {}

  hasRoute(route: string) {
    return this.router.url.includes(route);
  }
}
