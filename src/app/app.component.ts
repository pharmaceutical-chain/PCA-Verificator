import { MailerService } from './Services/mailer.service';
import { HttpLoaderService } from './Services/http-loader.service';
import { AppService } from './Services/app.service';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  data: BehaviorSubject<ISupplyChain> = new BehaviorSubject<ISupplyChain>({} as ISupplyChain);
  year: number = new Date().getFullYear();
  isVerifing: BehaviorSubject<boolean> = this.httpLoaderService.isVerifing;
  isSendingReport: BehaviorSubject<boolean> = this.httpLoaderService.isSending;
  isSendingSuccess: boolean;
  reportForm = this.fb.group({
    content: ['', Validators.required]
  });
  isNotFound = this.service.isNotFound;

  constructor(
    private service: AppService,
    private httpLoaderService: HttpLoaderService,
    private mailer: MailerService,
    private fb: FormBuilder) { }

  ngOnInit() {
    const activeRoute = window.location.href;
    const segments = activeRoute.split('/').filter(s => s !== '' && s.length === 36);
    const batchId = segments[segments.length - 1];
    this.service.getSupplyChain(batchId).subscribe(res => {
      setTimeout(() => {
        this.data.next(res);
      }, 2000);
    });
  }

  onClickContracAddress(address: string) {
    const url = `https://ropsten.etherscan.io/address/${address}#code`;
    window.open(url, '_blank');
  }

  onClickSendReport() {
    if (this.reportForm.get('content').value !== '') {
      const mailContent: IReportMail = {
        reportURL: window.location.href,
        reportContent: this.reportForm.get('content').value,
        reportYear: this.year
      };
      this.mailer.sendMail(mailContent).subscribe(res => {
        if (res['messageId']) {
          this.reportForm.get('content').setValue('');
          this.isSendingSuccess = true;
          setTimeout(() => {
            this.isSendingSuccess = false;
          }, 2000);
        }
      });
    }
  }
}
