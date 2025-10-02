import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../environment/environment';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})


export class SendotpService {
  _isLogged: boolean = false
  HOST = environment.host;
  constructor(private http: HttpClient) { }
  // ----------------------------------------------
  // ------------------ Send otp-------------------
  // ----------------------------------------------
  global_cell = ''
  url = `${this.HOST}/api/user/send-otp/`
  public getOTP(number: any) {
    // console.log(number)
    this.global_cell = number
    return this.http.put(this.url, { mobile: number });
  }

  // -----------------------------------------------
  // ------------------ Verify otp------------------
  // -----------------------------------------------
  verify_otp_url = `${this.HOST}/api/user/verify-otp/`
  public verifyOTP(otp: any) {
    this._isLogged = true
    return this.http.put(this.verify_otp_url, { mobile: this.global_cell, otp: otp });
  }


  // ---------------------------------------------------
  // ------------------ tcode search with query parms---
  // ---------------------------------------------------
  search_t_code_url = ''
  public getAllTcode(search: any) {
    return this.http.get(`${this.HOST}/api/itemcode/search/${search}`);
  }

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  setLoggedInStatus(isLoggedIn: boolean) {
    this.isLoggedInSubject.next(isLoggedIn);
  }
}
