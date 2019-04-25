import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, PopoverController, ItemSliding } from 'ionic-angular';

import { Order } from '../../interfaces/order';

import { OrderProvider } from '../../providers/order/order'
import { QrcodeProvider } from '../../providers/qrcode/qrcode';
/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  totalPrice: number[];
  orderList: Order[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public orderPvdr: OrderProvider,
    private toastCtrl: ToastController, private qrProvider: QrcodeProvider,
    private alertCtrl: AlertController, private popoverCtrl: PopoverController) {
    this.orderList = [];
    this.totalPrice = []
  }

  ionViewDidLoad() {
    console.log("test")
    this.getAllOrder()
  }

  async getAllOrder() {
    this.orderPvdr.getOrder().then((orderList: Order[]) => {
      if (orderList && !orderList.length) {
        return;
      }
      this.orderList = orderList;
      console.log(this.orderList)
      this.orderList.forEach(order => {
        let total = 0;
        order.menus.forEach(menu => {
          total = total + menu.price;
        })
        this.totalPrice.push(total);
      })
    }).catch(err => console.log())
  }

  completeOrder(order: Order) {

    this.qrProvider.generate(order.orderId).then((qrcode) => {
      this.getAllOrder()
    }).catch((err) => {
      this.displayToast('Something went wrong. Please try again.')
    })
  }

  deleteItem(order: Order, index, slidingItem: ItemSliding) {
    this.alertCtrl.create({
      title: 'Cancel Order',
      message: 'Are you sure you want to cancel this order?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.orderPvdr.updateOrder({ orderId: order.orderId, status: "Cancelled" }).then((res) => {
              this.displayToast("Order has been cancelled.")
              this.orderList[index].status = "Cancelled";
              slidingItem.close();
            }).catch((err) => {
              this.displayToast("Something went wrong. Order status has not been updated.")
            })
          }
        }
      ]
    }).present();
  }

  openRating(order: Order, index, slidingItem: ItemSliding) {
    if (order.status == "Incomplete")
      this.displayToast("Please complete your order before reviewing this order.")
    else {
      let popover = this.popoverCtrl.create('PostOrderRatingPage', {
        target: order.userId,
        ratedBy: order.storeId,
        orderId: order.orderId
      })

      popover.present();

      popover.onDidDismiss((data) => {
        if (data) {
          this.orderList[index].storeRating = data.storeRating;
          slidingItem.close();
        }
      })
    }
  }

  displayToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    }).present();
  }

}
