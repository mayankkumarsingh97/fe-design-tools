import { Component, AfterViewInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SendotpService } from '../auth/sendotp.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  userData = JSON.stringify(localStorage.getItem("too_auth_user")!);

  ngAfterViewInit(): void { }
  message = ""
  isMessage = false
  constructor(private router: Router, private formBuilder: FormBuilder, private sendOTP: SendotpService) { }
  errBgColor = { marginTop: "10px", color: "red", fontWeight: 300, padding: '5px', borderRadius: "5px" }

  // -----------*** -------------
  // Login form validation
  // -----------*** -------------
  loginForm = new FormGroup({
    phone_number: new FormControl('', [Validators.required,
    Validators.pattern("^[0-9]*$"),
    Validators.minLength(10), Validators.maxLength(10)])
  })

  loginUser() {
    this.sendOTP.getOTP(this.loginForm.value.phone_number).subscribe((res: any) => {
      try {
        if (res.error == true) {
          Swal.fire({
            title: `${res.msg}`,
            icon: 'error',
            confirmButtonText: 'Ok'
          })
          this.router.navigate(['login'])
        }

        if (res.error == false) {
          const navigationExtras: NavigationExtras = {
            queryParams: {
              mobileNumber: this.loginForm.value.phone_number
            }
          }
          this.router.navigate(['otp'], navigationExtras)
        }
      }
      catch {
        alert("Some error has occured! Contact admin")
      }
    })
  }

  get phone_number() {
    return this.loginForm.get('phone_number')
  }


  goBackToPrevPage() {
    window.history.back();
  }
}
