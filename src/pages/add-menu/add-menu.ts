import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Navbar } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuInfo } from '../../interfaces/menu';
import { MenuProvider } from '../../providers/menu/menu';
import { AccountProvider } from '../../providers/account/account';
import { CameraProvider } from '../../providers/camera/camera';
/**
 * Generated class for the AddMenuPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-menu',
  templateUrl: 'add-menu.html',
})
export class AddMenuPage {
  @ViewChild('navbar') navBar: Navbar;

  menuForm: FormGroup;
  imageURL: any;
  changes: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private accountPvdr: AccountProvider, private menuPvdr: MenuProvider,
    private toastCtrl: ToastController, private cameraPvdr: CameraProvider,
    private formBuilder: FormBuilder, private alertCtrl: AlertController) {
    this.imageURL = './assets/imgs/placeholder_food.png';
    this.menuForm = this.formBuilder.group({
      name: ['', Validators.required],
      imageURL: ['', Validators.required],
      preparation_time: ['00:00:00', Validators.required],
      price: ['', Validators.required],
      available: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = () => this.backButtonClick();
  }

  getPhoto() {
    this.cameraPvdr.getPhoto().then(image => {
      this.accountPvdr.uploadProfileImage(image.path).then((res) => {
        this.menuForm.controls['imageURL'].setValue(res.response.toString());
        this.imageURL = image.webPath;
      })
    })
    console.log("changed image")
    // this.imageURL = "http://35.247.136.6:3000/photos/image-1555864503116.jpeg"
    // this.menuForm.controls['imageURL'].setValue(this.imageURL);

  }

  addMenu() {
    let newPrice = parseFloat(this.menuForm.controls['price'].value.toString()).toFixed(2);
    
    let newMenu: MenuInfo = {
      menuId: "",
      imageURL: this.menuForm.controls['imageURL'].value,
      available: !this.menuForm.controls['available'].value,
      name: this.menuForm.controls['name'].value,
      preparation_time: this.menuForm.controls['preparation_time'].value,
      price: parseFloat(newPrice),
      storeId: this.accountPvdr.storeId
    }

    this.alertCtrl.create({
      title: 'Add Menu',
      message: 'Do you want to add this menu?',
      buttons: [
        {
          text: 'Yes',
          
          handler: () => {
            this.menuPvdr.addMenus(this.accountPvdr.storeId, newMenu).then((res) => {
              this.displayToast("Add menu success!");
              this.navCtrl.pop();
            }).catch((err) => {
              this.displayToast("Failed to add menu!");
            })
          }
        },
        {
          role: 'cancel',
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
