import { MailerService } from './Services/mailer.service';
import { HttpLoaderService } from './Services/http-loader.service';
import { AppService } from './Services/app.service';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  data: BehaviorSubject<ISupplyChain> = new BehaviorSubject<ISupplyChain>({} as ISupplyChain);
  endnodeData: BehaviorSubject<ITransfer> = new BehaviorSubject<ITransfer>({} as ITransfer);

  year: number = new Date().getFullYear();
  isVerifing: BehaviorSubject<boolean> = this.httpLoaderService.isVerifing;
  isSendingReport: BehaviorSubject<boolean> = this.httpLoaderService.isSending;
  isSendingSuccess: boolean;
  reportForm = this.fb.group({
    userContact: [''],
    content: ['']
  });
  isNotFound = this.service.isNotFound;

  guidSegments: Array<string>;
  retailerId: string;
  batchId: string;

  constructor(
    private service: AppService,
    private httpLoaderService: HttpLoaderService,
    private mailer: MailerService,
    private fb: FormBuilder) { }

  ngOnInit() {
    const activeRoute = window.location.href;
    this.guidSegments = activeRoute.split('/').filter(s => s !== '' && s.length === 36);
    this.retailerId = this.guidSegments[0];
    this.batchId = this.guidSegments[this.guidSegments.length - 1];
    this.service.getSupplyChain(this.retailerId, this.batchId).subscribe(res => {
      if (res) {
        this.endnodeData.next(res.supplyChain[res.supplyChain.length - 1]);
        res.supplyChain.pop();
        setTimeout(() => {
          this.data.next(res);
        }, 2000);
      } else {
        this.isNotFound.next(true);
      }
    });
  }

  onClickContracAddress(address: string) {
    const url = `https://ropsten.etherscan.io/address/${address}#readContract`;
    window.open(url, '_blank');
  }

  onClickSendReport() {
    this.reportForm.get('userContact').setValidators([Validators.required, this.isValidUserContact]);
    this.reportForm.get('userContact').updateValueAndValidity();
    this.reportForm.get('content').setValidators(Validators.required);
    this.reportForm.get('content').updateValueAndValidity();

    if (this.reportForm.valid) {
      const mailContent: IReportMail = {
        retailerId: this.retailerId,
        batchId: this.batchId,
        userContact: this.reportForm.get('userContact').value,
        isEmail: this.validateEmail(this.reportForm.get('userContact').value),
        reportContent: this.reportForm.get('content').value,
        reportYear: this.year
      };
      this.mailer.sendMail(mailContent).subscribe(res => {
        if (res['messageId']) {
          this.reportForm.get('content').clearValidators();
          this.reportForm.get('content').setValue('');
          this.isSendingSuccess = true;
          setTimeout(() => {
            this.isSendingSuccess = false;
          }, 2000);
        }
      });
    }
  }

  validateEmail(email: string) {
    // tslint:disable-next-line: max-line-length
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  }

  validatePhoneNumber(phone: string) {
    const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return regex.test(String(phone).toLowerCase());
  }

  isValidUserContact(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isValid: boolean = this.validateEmail(control.value) || this.validatePhoneNumber(control.value);
      return isValid ? null : { invalidContact: { value: control.value } };
    };
  }
}
