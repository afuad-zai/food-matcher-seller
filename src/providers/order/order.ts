import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountProvider } from '../account/account';
import { Order } from '../../interfaces/order';
import { ApiProvider } from '../api/api';
/*
  Generated class for the OrderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrderProvider {
  url: string;

  constructor(public http: HttpClient, private accountPvdr: AccountProvider, private apiPvdr: ApiProvider) {
    this.url = `${apiPvdr.api}/stores`;
  }

  getNewOrder() {
    let api = `${this.url}/${this.accountPvdr.storeId}/order`;
    return new Promise((resolve, reject) => {
      this.http.get(api)
        .subscribe((data: any) => {
          if(data.err) {
            reject(data.err)
            return;
          }
          console.log(data.orders)
          resolve(data.orders)
        })
    })
  }

  getOrder() {
    let api = `${this.url}/${this.accountPvdr.storeId}/all-order`;
    return new Promise((resolve, reject) => {
      this.http.get(api)
        .subscribe((data: any) => {
          if (data.err) {
            reject(data.err)
          } else {
            resolve(data.orders)
          }

        })
    })
  }

  getAnalytic(days: number) {
    let api = `${this.url}/${this.accountPvdr.storeId}/analytic/${days}`;
    return new Promise((resolve, reject) => {
      this.http.get(api)
        .subscribe((data: any) => {
          if (data.err) {
            reject([])
          }
          resolve(data.analytic)
        })
    })
  }

  updateOrder(order: any) {
    let api = `${this.url}/${this.accountPvdr.storeId}/order`;
    return new Promise((resolve, reject) => {
      this.http.put(api, order)
        .subscribe((data: any) => {
          if (data.err) {
            reject(data.err)
          }
          resolve(data.status)
        })
    })
  }


}
