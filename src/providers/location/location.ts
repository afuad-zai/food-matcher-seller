import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';
const { Geolocation, Network } = Plugins;

/*
  Generated class for the LocationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationProvider {

  latitude: any;
  longitude: any;

  constructor() {}

  public getCurrentLocation() {
    return { lat: this.latitude, lon: this.longitude };
  }

  getLocation() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition().then((position) => {

        console.log(position);

        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        resolve(true);

      }, (err) => {

        reject('Could not initialise map');

      });
    })

  }



}
