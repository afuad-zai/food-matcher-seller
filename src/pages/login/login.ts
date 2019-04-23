import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AccountProvider } from '../../providers/account/account';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  email: string;
  password: string;
  password2: string;
  opt: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private accountPvdr: AccountProvider, private toastCtrl: ToastController) {
    this.email = "test@foodmatcher.com";
    this.password = "test";
    this.password2 = "test";
    this.opt = 'signin';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  doSignin() {
    this.accountPvdr.login(this.email, this.password).then(() => {
      this.displayToast("You have signed in.");
    }).catch((status) => {
      this.displayToast(status);
    })
  }

  doSignup() {
    if (this.password != this.password2) {
      this.displayToast('Re-entered password is incorrect.')
    } else {
      this.accountPvdr.signup(this.email, this.password).then((status) => {
        return this.accountPvdr.login(this.email, this.password)
      }).then(() => {
        this.displayToast("You have signed up and logged in.");
        this.navCtrl.setRoot('HomePage');
      }).catch((err) => {
        this.displayToast(err);
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
