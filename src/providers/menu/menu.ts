import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MenuInfo } from '../../interfaces/menu';
import { AccountProvider } from '../../providers/account/account'
import { ApiProvider } from '../api/api';
/*
  Generated class for the MenuProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MenuProvider {
  url: string

  constructor(public http: HttpClient, private accountPvdr: AccountProvider, private apiPvdr: ApiProvider) {
    this.url = `${apiPvdr.api}/stores`;
  }

  getMenus(storeId: String) {
    let api = `${this.url}/${storeId}/menu`;

    return new Promise(resolve => {
      this.http.get(api).subscribe((data: any) => {
        resolve(data.menus)
      })
    })
  }

  addMenus(storeId: String, newMenu: MenuInfo) {
    console.log(storeId)
    console.log(newMenu)
    let api = `${this.url}/${storeId}/menu`;
    return new Promise((resolve, reject) => {
      this.http.post(api, newMenu).subscribe((res: any) => {
        resolve(res)
      })
    })
  }

  updateMenus(updatedMenu: MenuInfo) {
    let api = `${this.url}/menu/${updatedMenu.menuId}`;
    return new Promise((resolve) => {
      this.http.post(api, updatedMenu).subscribe((res: any) => {
        resolve(res)
      })
    })
  }

  deleteMenus(menuId: string) {
    let api = `${this.url}/menu/${menuId}`;
    return new Promise((resolve, reject) => {
      this.http.delete(api).subscribe((res) => {
        resolve(true)
      })

    })
  }

}
