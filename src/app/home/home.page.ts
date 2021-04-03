import { Component, OnInit } from '@angular/core';
import { GeolocationOptions, Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;
declare var google;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  // public map: any;
  constructor() {}

  ngOnInit(): void {
    this.mapInit();
  }

  async mapInit(){
    const coordinates = await Geolocation.getCurrentPosition();
    const myLatLng = { lat: coordinates.coords.latitude, lng: coordinates.coords.longitude };

    const map = new google.maps.Map(document.getElementById('container') as HTMLElement, {
      center: myLatLng,
      zoom: 15,
     });

    // tslint:disable-next-line: no-unused-expression
    new google.maps.Marker({
      position: myLatLng,
      map,
      title: 'Current Location',
    });

  }

  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current', coordinates);
  }

  watchPosition() {
    const wait = Geolocation.watchPosition({}, (position, err) => {
    });
  }


}
