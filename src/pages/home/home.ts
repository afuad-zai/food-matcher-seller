import { Component } from '@angular/core';
import { NavController, IonicPage, ToastController, AlertController } from 'ionic-angular';
import { Order } from '../../interfaces/order';
import { OrderProvider } from '../../providers/order/order'
import { QrcodeProvider } from '../../providers/qrcode/qrcode'

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  totalPrice: number[];
  orderList: Order[];

  constructor(public navCtrl: NavController, private orderPvdr: OrderProvider, private qrProvider: QrcodeProvider, private toastCtrl: ToastController, private alertCtrl: AlertController) {
    this.orderList = [];
    this.totalPrice = [];
  }

  ionViewWillEnter() {
    this.getNewOrder()
  }

  getNewOrder() {
    this.orderList = [];
    this.totalPrice = [];
    this.orderPvdr.getNewOrder().then((orderList: Order[]) => {
      this.orderList = orderList;
      this.orderList.forEach(order => {
        let total = 0;
        order.menus.forEach(menu => {
          total = total + menu.price;
        })
        this.totalPrice.push(total);
      })
    })
  }

  completeOrder(order: Order) {

    this.qrProvider.generate(order.orderId).then((qrcode) => {
      this.getNewOrder();
    }).catch((err) => {
      this.displayToast('Something went wrong. Please try again.')
    })
  }

  deleteItem(order: Order) {
    this.alertCtrl.create({
      title: 'Cancel Order',
      message: 'Are you sure you want to cancel this order?',
      buttons: [
        {
          text: "No",
          role: 'cancel'
        },
        {
          text: "Yes",
          handler: data => {
            this.orderPvdr.cancelOrder(order).then((message: string) => {
              this.displayToast(message);
              this.getNewOrder();
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
