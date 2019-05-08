import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { Order } from '../../interfaces/order'
import { OrderProvider } from '../../providers/order/order';
import { MenuProvider } from '../../providers/menu/menu';

import moment from 'moment';
import { AccountProvider } from '../../providers/account/account';
import { MenuInfo } from '../../interfaces/menu';
/**
 * Generated class for the AnalyticPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-analytic',
  templateUrl: 'analytic.html',
})
export class AnalyticPage {

  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas2') doughnutCanvas2;

  doughnutChart: any;
  barChart: any;
  labelDesc: string;
  labels: string[];
  timeFrequencyLabel: string[]
  orderStatus: number[];
  timeFrequency: number[];
  toggled: boolean;
  showChart: boolean;
  menuList: MenuInfo[];
  menuNames: string[];
  menuQuantity: number[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private orderPvdr: OrderProvider, private menuPvdr: MenuProvider,
    private toastCtrl: ToastController, public accountPvdr: AccountProvider) {
    this.labels = ['Completed', 'Incomplete', 'Cancelled'];
    this.timeFrequencyLabel = [];

    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        this.timeFrequencyLabel.push(`0${i}:00`)
      } else {
        this.timeFrequencyLabel.push(`${i}:00`)
      }
    }

    this.toggled = false;
    this.showChart = false;
  }

  ionViewDidLoad() {
    this.getData(1);
  }

  changeGraph() {
    this.toggled = !this.toggled;
    if (this.toggled) {
      this.getData(7);
    }
    else {
      this.getData(1);
    }
  }


  getData(days: number) {
    this.orderStatus = [0, 0, 0];
    this.timeFrequency = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.menuNames = [];
    this.menuQuantity = [];
    let tempList = [];

    this.menuPvdr.getMenus(this.accountPvdr.storeId).then((menulist: MenuInfo[]) => {
      tempList = menulist;
      menulist.forEach((menu) => {
        this.menuNames.push(menu.name)
        this.menuQuantity.push(0)
      })
    }).then(() => {

      this.orderPvdr.getAnalytic(days).then((orders: any[]) => {
        orders.forEach((order) => {
          console.log(order.menus)
          if (order.status == "Completed") {
            for (var key in order.menus) {
              console.log(key)
              tempList.forEach((menu: MenuInfo, i) => {
                if (menu.menuId == key) {
                  this.menuQuantity[i] = this.menuQuantity[i] + order.menus[key];
                }
              })
            }
            console.log(this.menuQuantity)
          }


          // Get completion status
          for (let i = 0; i < 3; i++) {
            if (order.status == this.labels[i]) {
              this.orderStatus[i] = this.orderStatus[i] + 1;
              break;
            }
          }

          // Time-frequency
          let date = moment(order.timestamp).format('HH.mm');
          let newDate = Math.ceil(parseFloat(date))
          if (newDate == 24) {
            newDate = 0;
          }
          this.timeFrequency[newDate] += 1;

        })
        this.showChart = true;
        this.generateChart();
        this.generatePeakHourChart();
        this.generateMenuFrequency();
      }).catch(() => { this.displayToast("No data!") })

    }).catch((err) => {
      this.showChart = false;
      this.displayToast("No data!")
    })
  }

  generateChart() {
    let colorPool = this.poolColors(this.labels.length)
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Order Status',
          data: this.orderStatus,
          backgroundColor: colorPool,
          hoverBackgroundColor: colorPool
        }]
      }

    });
  }

  generateMenuFrequency() {
    let colorPool = this.poolColors(this.menuNames.length)
    this.doughnutChart = new Chart(this.doughnutCanvas2.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.menuNames,
        datasets: [{
          label: 'Quantity',
          data: this.menuQuantity,
          backgroundColor: colorPool,
          hoverBackgroundColor: colorPool
        }]
      }

    });
  }

  generatePeakHourChart() {
    let colorPool = this.poolColors(this.timeFrequencyLabel.length)
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.timeFrequencyLabel,
        datasets: [{
          label: '# of Order',
          data: this.timeFrequency,
          backgroundColor: colorPool,
          borderColor: colorPool,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }

    });

  }

  dynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgba(" + r + "," + g + "," + b + ", 0.5)";
  }

  poolColors(a) {
    var pool = [];
    for (let i = 0; i < a; i++) {
      pool.push(this.dynamicColors());
    }
    return pool;
  }

  displayToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    }).present();
  }
}
