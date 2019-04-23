import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, AlertController, ToastController } from 'ionic-angular';
import { StoreInfo } from '../../interfaces/store';
import { AccountProvider } from '../../providers/account/account';
import { LocationProvider } from '../../providers/location/location';
import { CameraProvider } from '../../providers/camera/camera';

/**
 * Generated class for the StorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-store',
  templateUrl: 'store.html',
})
export class StorePage {

  @ViewChild('navbar') navBar: Navbar;

  storeInfo: StoreInfo;
  location: string;
  changes: boolean;
  image: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private accountPvdr: AccountProvider, private locationPvdr: LocationProvider,
    private alertCtrl: AlertController, private toastCtrl: ToastController, private cameraPvdr: CameraProvider) {
    this.init();
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = () => this.backButtonClick();
  }

  init() {
    this.storeInfo = {
      name: this.accountPvdr.name,
      id: this.accountPvdr.storeId,
      openTime: this.accountPvdr.openTime,
      closeTime: this.accountPvdr.closeTime,
      imageUrl: this.accountPvdr.image,
      location: this.accountPvdr.location
    }

    console.log(this.storeInfo)

    this.changes = false;
    this.image = this.accountPvdr.image;
  }

  updateStore() {
    this.accountPvdr.name = this.storeInfo.name;
    this.accountPvdr.image = this.storeInfo.imageUrl;
    this.accountPvdr.location = this.storeInfo.location;
    this.accountPvdr.openTime = this.storeInfo.openTime;
    this.accountPvdr.closeTime = this.storeInfo.closeTime;

    this.alertCtrl.create({
      title: 'Update Info',
      message: 'Do you wish to update your store information?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.accountPvdr.updateProfile().then((res) => {
              this.displayToast("Update store information success!");
              this.navCtrl.pop();
            }).catch((err) => {
              this.displayToast("Failed to update store information!");
            })
          }
        }
      ]
    }).present();

  }

  getPhoto() {
    this.cameraPvdr.getPhoto().then(image => {
      this.accountPvdr.uploadProfileImage(image.path).then((res) => {
        this.image = image.webPath;
        let tempImagePath: any = res;
        this.storeInfo.imageUrl = tempImagePath;
      })
    })
    console.log("changed image")

  }

  getLocation() {
    this.locationPvdr.getLocation().then(() => {
      let location = this.locationPvdr.getCurrentLocation();
      this.storeInfo.location = location;

      this.setLocationDisplay();
    })
  }

  setLocationDisplay() {
    this.location = `${this.storeInfo.location.lat}, ${this.storeInfo.location.lon}`;
  }

  valueChanged() {
    this.changes = !this.changes;
  }

  backButtonClick() {
    if (this.changes) {
      this.changes = false;
      this.showAlert();
    } else {
      this.navCtrl.pop();
    }
  }

  displayToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    }).present();
  }

  showAlert() {
    this.alertCtrl.create({
      title: 'Unsaved Data',
      message: 'You have unsaved changes. Are you sure you wish to leave?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    }).present();
  }

}
