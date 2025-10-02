import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2'
import { SendotpService } from '../auth/sendotp.service';
import { Subscription, interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-otp-screen',
  templateUrl: './otp-screen.component.html',
  styleUrls: ['./otp-screen.component.css']
})


export class OtpScreenComponent implements OnInit {
  mobile_no!: any

  userData = JSON.stringify(sessionStorage.getItem("too_auth_user")!);
  constructor(private verifyOTPservie: SendotpService,
    private router: Router, private route: ActivatedRoute,
    private sendOTP: SendotpService) {
  }

  timer: number = 180; // Timer duration in seconds
  timerSubscription!: Subscription;
  isTimerRunning: boolean = false;

  startTimer() {
    if (!this.isTimerRunning) {
      this.isTimerRunning = true;
      this.timerSubscription = interval(1000).subscribe(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          this.stopTimer();
        }
      });
    }
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.isTimerRunning = false;
    this.timer = 0; // Reset timer...
  }

  resendOtp() {
    this.sendOTP.getOTP(this.mobile_no).subscribe((res: any) => {

      try {
        if (res.error == true) {
          Swal.fire({
            title: `${res.msg}`,
            icon: 'error',
            confirmButtonText: 'Ok'
          })
          this.router.navigate(['otp'])
        }

        if (res.error == false) {
          Swal.fire({
            title: `${res.msg}`,
            icon: 'success',
            confirmButtonText: 'Ok'
          })
          this.router.navigate(['admin-dashboard'])
        }

      }
      catch {
        alert("Some error has occured! Contact admin")
      }
    })

  }


  ngOnInit(): void {
    // this.route.paramMap.subscribe(params => {
    //   this.mobile_no = params.get('mobileNumber');
    // });
    
    const navigation = window.history.state;
    if (navigation?.mobileNumber) {
      this.mobile_no = navigation.mobileNumber;
    }
    this.startTimer();
  }


  errBgColor = { marginTop: "10px", color: "red", fontWeight: 300, padding: '5px', borderRadius: "5px" }

  otpForm = new FormGroup({
    otp_digit_1: new FormControl('', [Validators.required,
    Validators.pattern("^[0-9]*$"),
    Validators.minLength(1), Validators.maxLength(1)]),

    otp_digit_2: new FormControl('', [Validators.required,
    Validators.pattern("^[0-9]*$"),
    Validators.minLength(1), Validators.maxLength(1)]),

    otp_digit_3: new FormControl('', [Validators.required,
    Validators.pattern("^[0-9]*$"),
    Validators.minLength(1), Validators.maxLength(1)]),


    otp_digit_4: new FormControl('', [Validators.required,
    Validators.pattern("^[0-9]*$"),
    Validators.minLength(1), Validators.maxLength(1)]),
  })





  verifyOTP() {
    const otp = `${this.otpForm.value.otp_digit_1}${this.otpForm.value.otp_digit_2}${this.otpForm.value.otp_digit_3}${this.otpForm.value.otp_digit_4}`
    this.verifyOTPservie.verifyOTP(otp).subscribe((res: any) => {
      this.verifyOTPservie.setLoggedInStatus(true)
      try {
        if (res.error == true) {
          Swal.fire({
            title: `${res.msg}`,
            icon: 'error',
            confirmButtonText: 'Ok'
          })
          this.router.navigate(['otp']);
        }
        else {
          localStorage.setItem("too_auth_user", JSON.stringify(res.data));
          this.router.navigate(['admin-dashboard']);
        }
      }
      catch {
        alert("error! Contact admin")
      }
    })
  }


  get otp_digit_1() {
    return this.otpForm.get('otp_digit_1')
  }

  get otp_digit_2() {
    return this.otpForm.get('otp_digit_2')
  }

  get otp_digit_3() {
    return this.otpForm.get('otp_digit_3')
  }

  get otp_digit_4() {
    return this.otpForm.get('otp_digit_4')
  }





  onInput(event: any, nextInputId: any) {
    const maxLength = event.target.maxLength;
    const currentLength = event.target.maxLength;
    if (currentLength === maxLength) {
      const nextInput = document.getElementById(nextInputId);
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

















  goBackToPrevPage() {
    window.history.back();
  }





}
