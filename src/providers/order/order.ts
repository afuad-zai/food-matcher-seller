import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountProvider } from '../account/account';
import { Order } from '../../interfaces/order';
/*
  Generated class for the OrderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrderProvider {
  url: string;

  constructor(public http: HttpClient, private accountPvdr: AccountProvider) {
    this.url = "http://35.247.136.6:3000/stores";
  }

  getNewOrder() {
    let api = `${this.url}/${this.accountPvdr.storeId}/order`;
    return new Promise((resolve, reject) => {
      this.http.get(api)
        .subscribe((data: any) => {
          console.log(data.orders)
          resolve(data.orders)
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
