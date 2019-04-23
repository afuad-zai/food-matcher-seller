import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { PipesModule } from '../pipes/pipes.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AccountProvider } from '../providers/account/account';
import { OrderProvider } from '../providers/order/order';
import { MenuProvider } from '../providers/menu/menu';
import { CameraProvider } from '../providers/camera/camera';

import { FileTransfer } from '@ionic-native/file-transfer';
import { LocationProvider } from '../providers/location/location';
import { QrcodeProvider } from '../providers/qrcode/qrcode';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';



@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    PipesModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AccountProvider,
    OrderProvider,
    MenuProvider,
    CameraProvider,
    FileTransfer,
    LocationProvider,
    QrcodeProvider,
    BarcodeScanner
  ]
})
export class AppModule {}
