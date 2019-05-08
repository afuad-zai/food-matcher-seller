import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostRating } from '../../interfaces/rating';
import { AccountProvider } from '../account/account';
import { ApiProvider } from '../api/api';

/*
  Generated class for the RatingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RatingProvider {
  url: string
  constructor(public http: HttpClient, public accountPvdr: AccountProvider, private apiPvdr:ApiProvider) {
    this.url = `${apiPvdr.api}/stores`;
  }

  postRating(rating: PostRating) {
    let api = `${this.url}/${this.accountPvdr.storeId}/rating`;
    return new Promise((resolve, reject) => {
      this.http.post(api, rating)
        .subscribe((data: any) => {
          console.log(data)
          if (data.success) {
            resolve(data)
          } else {
            reject(data)
          }
        })
    })
  }

  getBriefRating(userId: String) {
    let api = `${this.url}/${userId}/rating-brief`;
    return new Promise((resolve, reject) => {
      this.http.get(api)
        .subscribe((data: any) => {
          if (data.err) {
            reject(data.err)
          } else {
            resolve(data)

          }
        })
    })
  }


}
