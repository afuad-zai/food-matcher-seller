import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ItemSliding, AlertController, ToastController } from 'ionic-angular';
import { AccountProvider } from '../../providers/account/account';
import { MenuProvider } from '../../providers/menu/menu';

import { MenuInfo } from '../../interfaces/menu'

/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  private menuList: MenuInfo[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private accountPvdr: AccountProvider, private menuPvdr: MenuProvider,
    private alertCtrl: AlertController, private toastCtrl: ToastController) {
    this.menuList = []
  }

  ionViewWillEnter() {
    this.menuPvdr.getMenus(this.accountPvdr.storeId).then((menulist: MenuInfo[]) => {
      this.menuList = menulist;
      console.log(menulist)
    });
  }

  closeSliding(slidingItem: ItemSliding) {
    console.log("close slider")
    slidingItem.close();
  }

  addMenu() {
    this.navCtrl.push('AddMenuPage');
  }

  editMenu(item: MenuInfo) {
    this.navCtrl.push('EditMenuPage', { menuInfo: item });
  }

  addIngredient() {

  }

  deleteItem(item: MenuInfo, index) {
    console.log("deleted")
    this.alertCtrl.create({
      title: 'Delete Menu',
      message: 'Are you sure you want to delete this?',
      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        },
        {
          text: "Delete",
          handler: data => {
            this.menuPvdr.deleteMenus(item.menuId).then(() => {
              this.displayToast(`Menu ${item.name} deleted.`);
              this.menuList.splice(index, 1);
            })
          }
        }
      ]
    }).present();
  }

  displayToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    }).present();
  }

}
