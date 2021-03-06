import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MailerService {
  constructor(private http: HttpClient) { }

  sendMail(body: IReportMail) {
    const baseUrl = 'https://pharmachain-verificator.herokuapp.com/';
    // const baseUrl = 'http://localhost:4200/';
    return this.http.post(`${baseUrl}sendreport`, body);
  }
}
