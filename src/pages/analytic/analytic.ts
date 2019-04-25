import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { Order } from '../../interfaces/order'
import { OrderProvider } from '../../providers/order/order';
import { MenuProvider } from '../../providers/menu/menu';

import moment from 'moment';
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


  doughnutChart: any;
  barChart: any;
  labelDesc: string;
  labels: string[];
  timeFrequencyLabel: string[]
  orderStatus: number[];
  timeFrequency: number[];
  toggled: boolean;
  showChart: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private orderPvdr: OrderProvider, private menuPvdr: MenuProvider,
    private toastCtrl: ToastController) {
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
    this.timeFrequency = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.orderPvdr.getAnalytic(days).then((orders: Order[]) => {
      orders.forEach((order) => {
        console.log(order)
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
    }).catch((err) => {
      this.showChart = false;
    })
  }

  generateChart() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Order Status',
          data: this.orderStatus,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(255, 99, 132, 0.2)',
          ],
          hoverBackgroundColor: [
            "#36A2EB",
            "#FFCE56",
            "#FF6384",
          ]
        }]
      }

    });
  }

  generatePeakHourChart() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {

      type: 'bar',
      data: {
        labels: this.timeFrequencyLabel,
        datasets: [{
          label: '# of Order',
          data: this.timeFrequency,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
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

  displayToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    }).present();
  }
}
