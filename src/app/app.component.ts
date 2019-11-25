import { AppService } from './app.service';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  data: BehaviorSubject<ISupplyChain> = new BehaviorSubject<ISupplyChain>({} as ISupplyChain);
  year = new Date().getFullYear();

  constructor(private service: AppService) { }

  ngOnInit() {
    const activeRoute = window.location.href;
    const segments = activeRoute.split('/').filter(s => s !== '' && s.length === 36);
    const batchId = segments[segments.length - 1];
    this.service.getSupplyChain(batchId).subscribe(res => {
      this.data.next(res);
    });
  }

  onClickContracAddress(address: string) {
    const url = `https://ropsten.etherscan.io/address/${address}#code`;
    window.open(url, '_blank');
  }
}
