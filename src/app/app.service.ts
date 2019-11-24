import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  getSupplyChain(batchId: string): Observable<ISupplyChain> {
    const url = `https://pharmaceuticalchainserver.azurewebsites.net/api/SupplyChains/${batchId}`;
    return this.http.get(url).pipe(
      map(res => {
        let supplyChain: ISupplyChain = null;
        const transfers: Array<ITransfer> = [];
        if (res['totalTransfers'] > 0) {
          const mfg = this.convertToLocalDate(new Date(res['transfers'][0]['medicineBatch']['manufactureDate']));
          const exp = this.convertToLocalDate(new Date(res['transfers'][0]['medicineBatch']['expiryDate']));

          res['transfers'].forEach((item) => {
            const time = this.convertToLocalDate(new Date(item['dateCreated']));
            const node: ITransfer = {
              type: item['from']['type'],
              tenantName: item['from']['name'],
              tenantCA: item['from']['contractAddress'],
              tenantPhone: item['from']['phoneNumber'],
              transferTime: time.toLocaleString(),
              transferCA: item['contractAddress'],
              transferQuantity: item['quantity'],
              transferUnit: item['medicineBatch']['unit']
            };
            transfers.push(node);
          });
          supplyChain = {
            batchCA: res['transfers'][0]['medicineBatch']['contractAddress'],
            medicine: res['transfers'][0]['medicineBatch']['medicine']['commercialName'],
            batchNumber: res['transfers'][0]['medicineBatch']['batchNumber'],
            mfg: mfg.toLocaleDateString(),
            exp: exp.toLocaleDateString(),
            // tslint:disable-next-line: max-line-length
            classification: `${res['transfers'][0]['medicineBatch']['medicine']['isPrescriptionMedicine'] ? '' : 'non-'}Prescription medicine`,
            price: res['transfers'][0]['medicineBatch']['medicine']['declaredPrice'],
            unit: res['transfers'][0]['medicineBatch']['unit'],
            madeIn: res['transfers'][0]['medicineBatch']['manufacturer']['primaryAddress'],
            madeBy: res['transfers'][0]['medicineBatch']['manufacturer']['name'],
            supplyChain: transfers
          };
        }

        return supplyChain;
      })
    );
  }

  convertToLocalDate(date: Date): Date {
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date;
  }
}
