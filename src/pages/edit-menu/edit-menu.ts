import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Navbar } from 'ionic-angular';
import { MenuProvider } from '../../providers/menu/menu';
import { AccountProvider } from '../../providers/account/account';
import { CameraProvider } from '../../providers/camera/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuInfo } from '../../interfaces/menu';

/**
 * Generated class for the EditMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-menu',
  templateUrl: 'edit-menu.html',
})
export class EditMenuPage {

  @ViewChild('navbar') navBar: Navbar;

  menuForm: FormGroup;
  imageURL: any;
  changes: boolean;
  menuInfo: MenuInfo;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private accountPvdr: AccountProvider, private menuPvdr: MenuProvider,
    private toastCtrl: ToastController, private cameraPvdr: CameraProvider,
    private formBuilder: FormBuilder, private alertCtrl: AlertController) {
    this.menuInfo = this.navParams.get('menuInfo')

    this.imageURL = this.menuInfo.imageURL;
    this.menuForm = this.formBuilder.group({
      name: [this.menuInfo.name, Validators.required],
      imageURL: [this.menuInfo.imageURL, Validators.required],
      preparation_time: [this.menuInfo.preparation_time, Validators.required],
      price: [this.menuInfo.price.toFixed(2), Validators.required],
      available: [this.menuInfo.available, Validators.required]
    });

  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = () => this.backButtonClick();
  }

  getPhoto() {
    this.cameraPvdr.getPhoto().then(image => {
      this.accountPvdr.uploadProfileImage(image.path).then((res) => {
        this.menuForm.controls['imageURL'].setValue(res);
        this.imageURL = image.webPath;
      })
    })
    console.log("changed image")

  }

  addMenu() {
    let newPrice = parseFloat(this.menuForm.controls['price'].value.toString()).toFixed(2);

    let newMenu: MenuInfo = {
      menuId: this.menuInfo.menuId,
      imageURL: this.menuForm.controls['imageURL'].value,
      available: this.menuForm.controls['available'].value,
      name: this.menuForm.controls['name'].value,
      preparation_time: this.menuForm.controls['preparation_time'].value,
      price: parseFloat(newPrice),
      storeId: this.accountPvdr.storeId
    }

    this.alertCtrl.create({
      title: 'Edit Menu',
      message: 'Are you sure you wish to update this menu?',
      buttons: [
        {
          text: 'Yes',
          role: 'cancel',
          handler: () => {
            this.menuPvdr.updateMenus(newMenu).then((res) => {
              this.displayToast("Update menu success!");
              this.navCtrl.pop();
            }).catch((err) => {
              this.displayToast("Failed to update menu!");
            })
          }
        },
        {
          text: 'No',
          handler: () => {

          }
        }
      ]
    }).present();

  }

  valueChanged() {
    this.changes = true;
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
      title: 'Unsaved data',
      message: 'You have unsaved changes. Are you sure you wish to leave?',
      buttons: [
        {
          text: 'No',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          role: 'cancel',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    }).present();
  }

}
