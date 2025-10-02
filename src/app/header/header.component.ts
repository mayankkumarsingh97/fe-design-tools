import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SendotpService } from '../auth/sendotp.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],

})

export class HeaderComponent implements OnDestroy {
  isLoggedIn!: boolean

  private subscription: any
  constructor(private router: Router, private sendOTP: SendotpService,
    private changeDetectorRef: ChangeDetectorRef) { }

  userData = JSON.parse(localStorage.getItem("too_auth_user")!);

  redirectToHome() {
    this.router.navigate(['']);
  }
  _make_LocalStorage_empty() {
    localStorage.removeItem("too_auth_user");
    this.router.navigate([''])
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
