import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { StoreInfo } from '../../interfaces/store';
import { MenuController } from 'ionic-angular';
import moment from 'moment';
/*
  Generated class for the AccountProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AccountProvider {
  private _url: string;
  private _store: StoreInfo;
  private _loggedIn: boolean;

  constructor(public http: HttpClient, private transfer: FileTransfer,
    private menuCtrl: MenuController) {
    this._url = "http://35.247.136.6:3000/stores"
    this.init();
  }

  init() {
    this._store = {
      name: 'Seller',
      id: 'VgM0IK41dAbirRNxxyHB',
      closeTime: '',
      imageUrl: '',
      location: {
        lat: 0,
        lon: 0
      },
      openTime: '',
      categories: []
    }
  }

  loginStatus() {
    // return true if logged
    return this._loggedIn;
  }

  login(username, password) {
    let api = `${this._url}/${username}/${password}`;

    return new Promise((resolve, reject) => {
      this.http.get(api).subscribe((res: any) => {
        if (res.err) {
          if (res.err == "Password incorrect.") {
            reject("Incorrect password.")
          } else {
            if (res.err == "Email is not found.") {
              reject("Account does not exist.")
            }
          }
        } else {
          let newStore = res.storeInfo
          this._store = {
            id: newStore.id,
            name: newStore.name,
            imageUrl: newStore.imageUrl,
            openTime: newStore.openTime,
            closeTime: newStore.closeTime,
            location: {
              lat: newStore.location._latitude,
              lon: newStore.location._longitude
            },
            categories: newStore.categories
          }

          //console.log(this._store)

          this._loggedIn = true;
          this.menuCtrl.enable(this._loggedIn, 'myMenu');

          resolve(true)
        }
      })
    })
  }

  logout() {
    return new Promise((resolve, reject) => {
      this.init();
      this._loggedIn = false;
      this.menuCtrl.enable(this._loggedIn, 'myMenu');
      resolve(true)
    })
  }

  signup(username, password) {
    let api = `${this._url}/${username}/${password}`;

    return new Promise((resolve, reject) => {
      this.http.post(api, {}).subscribe((res: any) => {
        if (res.err) {
          reject("Email is already registered")
        } else {
          resolve("Sign up successful.");
        }
      })
    })
  }

  updateProfile() {
    let api = `${this._url}/${this._store.id}/store`;

    return new Promise((resolve, reject) => {

      let storeInfo = {
        name: this._store.name,
        imageURL: this._store.imageUrl,
        closeTime: this._store.closeTime,
        openTime: this._store.openTime,
        location: {
          latitude: this._store.location.lat,
          longitude: this._store.location.lon
        },
        categories: this._store.categories
      }

      this.http.post(api, storeInfo).subscribe((res: any) => {
        if (res.err) {
          reject(res.err)
        } else {
          resolve(res.status)
        }
      })
    })
  }

  get name(): string {
    return this._store.name;
  }
  set name(name: string) {
    this._store.name = name;
  }

  get image(): string {
    return this._store.imageUrl;
  }

  set image(imageUrl: string) {
    this._store.imageUrl = imageUrl;
  }

  get storeId(): string {
    return this._store.id;
  }

  get location(): { lat: number, lon: number } {
    return this._store.location;
  }

  set location(location: { lat: number, lon: number }) {
    this._store.location = location;
  }

  set openTime(openTime: string) {
    this._store.openTime = openTime;
  }

  get openTime(): string {
    return this._store.openTime;
  }

  set closeTime(closeTime: string) {
    this._store.closeTime = closeTime;
  }

  get closeTime(): string {
    return this._store.closeTime;
  }

  get categories(): string[] {
    return this._store.categories;
  }

  set categories(categories: string[]) {
    this._store.categories = categories;
  }

  uploadProfileImage(imgSrc: string) {
    // Destination URL
    let url = "http://35.247.136.6:3000/uploadfile";

    // File for Upload
    var targetPath = imgSrc;

    var options: FileUploadOptions = {
      fileKey: 'image',
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      params: {
        desc: "desc"
      }
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    // Use the FileTransfer to upload the image
    return fileTransfer.upload(targetPath, url, options);

  }

}
