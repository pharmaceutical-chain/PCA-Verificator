import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  isNotFound: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  getSupplyChain(retailerId: string, batchId: string): Observable<ISupplyChain> {
    const url = `https://pharmaceuticalchainserver.azurewebsites.net/api/SupplyChains/${retailerId}/${batchId}`;
    return this.http.get(url).pipe(
      map(res => {
        let supplyChain: ISupplyChain = null;
        const transfers: Array<ITransfer> = [];

        if (res['totalTransfers'] > 0) {
          const mfg = this.convertToLocalDate(new Date(res['transferChains'][0][0]['medicineBatch']['manufactureDate']));
          const exp = this.convertToLocalDate(new Date(res['transferChains'][0][0]['medicineBatch']['expiryDate']));
          res['transferChains'][0].forEach((item, index) => {
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

            // endnode is the end of the supply chain without doing transfer batch
            if (index === res['transferChains'][0].length - 1) {
              const endnode: ITransfer = {
                type: item['to']['type'],
                tenantName: item['to']['name'],
                tenantCA: item['to']['contractAddress'],
                tenantPhone: item['to']['phoneNumber'],
              };
              transfers.push(endnode);
            }
          });
          supplyChain = {
            batchCA: res['transferChains'][0][0]['medicineBatch']['contractAddress'],
            medicine: res['transferChains'][0][0]['medicineBatch']['medicine']['commercialName'],
            batchNumber: res['transferChains'][0][0]['medicineBatch']['batchNumber'],
            mfg: mfg.toLocaleDateString(),
            exp: exp.toLocaleDateString(),
            // tslint:disable-next-line: max-line-length
            classification: `${res['transferChains'][0][0]['medicineBatch']['medicine']['isPrescriptionMedicine'] ? '' : 'non-'}Prescription medicine`,
            price: res['transferChains'][0][0]['medicineBatch']['medicine']['declaredPrice'],
            unit: res['transferChains'][0][0]['medicineBatch']['unit'],
            madeIn: res['transferChains'][0][0]['medicineBatch']['manufacturer']['primaryAddress'],
            madeBy: res['transferChains'][0][0]['medicineBatch']['manufacturer']['name'],
            supplyChain: transfers
          };
        }

        return supplyChain;
      }),
      catchError(this.handleError<ISupplyChain>('getSupplyChain', {} as ISupplyChain))
    );
  }

  convertToLocalDate(date: Date): Date {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') !== -1) {
      if (ua.indexOf('chrome') > -1) {
        // Chrome
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      }
    }
    return date;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.isNotFound.next(true);
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
