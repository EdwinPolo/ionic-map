import { User } from './../shared/User';
import { Component, OnInit } from '@angular/core';
import { GeolocationOptions, Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';

const { Geolocation } = Plugins;

declare var google;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  // public map: any;

  private user1: User;
  private user2: User;

  constructor(
    private apiService: UserService,
    private router: Router
  ) {}

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

    this.user1 = {lat: coordinates.coords.latitude, lng: coordinates.coords.longitude, name: 'Edwin'};

    this.apiService.getUser('user2').valueChanges().subscribe({
      next: (res: any) => {
        this.user2 = {lat: res.lat as number, lng: res.lng as number, name: res.name as string};
      },
      error: (err: any) => {
        console.log('Error trying to get user info', err);
      },
    });


  }


  updateCurrentLocation() {
    this.apiService.updateUser('user1', {lat: this.user1.lat, lng: this.user1.lng, name: this.user1.name }).then(res => {
      this.router.navigate(['/home']);
    })
      .catch(error => console.log(error));
  }

  // async getCurrentPosition() {
  //   const coordinates = await Geolocation.getCurrentPosition();
  //   console.log('Current', coordinates);
  // }

  // watchPosition() {
  //   const wait = Geolocation.watchPosition({}, (position, err) => {
  //   });
  // }


}
