import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MailerService {
  constructor(private http: HttpClient) { }

  sendMail(body) {
    const baseUrl = 'https://pharmachain-verificator.herokuapp.com';
    return this.http.post(`${baseUrl}/sendreport`, body);
  }
}
