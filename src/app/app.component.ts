import { HttpLoaderService } from './http-loader.service';
import { AppService } from './app.service';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  data: BehaviorSubject<ISupplyChain> = new BehaviorSubject<ISupplyChain>({} as ISupplyChain);
  year: number = new Date().getFullYear();
  isVerifing: BehaviorSubject<boolean> = this.httpLoaderService.isLoading;

  constructor(
    private service: AppService,
    private httpLoaderService: HttpLoaderService) { }

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
}
