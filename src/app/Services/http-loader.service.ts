import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpLoaderService {
  isVerifing = new BehaviorSubject<boolean>(false);
  isSending = new BehaviorSubject<boolean>(false);


  verify() {
    this.isVerifing.next(true);
  }

  endVerify() {
    this.isVerifing.next(false);
  }

  send() {
    this.isSending.next(true);
  }

  endSend() {
    this.isSending.next(false);
  }
}
