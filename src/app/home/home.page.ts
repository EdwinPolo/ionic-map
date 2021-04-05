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

  public map: any;

  private user1: User;
  private user2: User;
 
  constructor(
    private apiService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initMap();
  }

  async initMap(){
    const coordinates = await Geolocation.getCurrentPosition();
    const myLatLng = { lat: coordinates.coords.latitude, lng: coordinates.coords.longitude };

    this.map = new google.maps.Map(document.getElementById('container') as HTMLElement, {
      center: myLatLng,
      zoom: 16,
     });

    // tslint:disable-next-line: no-unused-expression
    new google.maps.Marker({
      position: myLatLng,
      map: this.map,
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
    const rightPanel = document.getElementById('right-panel') as HTMLDivElement;
    const totalDiv = document.getElementById('total') as HTMLDivElement;
    rightPanel.innerHTML = '';
    totalDiv.innerHTML = '';

    this.apiService.updateUser('user1', {lat: this.user1.lat, lng: this.user1.lng, name: this.user1.name }).then(res => {
      this.router.navigate(['/home']);
    })
      .catch(error => console.log(error));

    const myLatLng = { lat: this.user1.lat, lng: this.user1.lng };

    this.map = new google.maps.Map(document.getElementById('container') as HTMLElement, {
      center: myLatLng,
      zoom: 20,
     });

     // tslint:disable-next-line: no-unused-expression
    new google.maps.Marker({
      position: myLatLng,
      map: this.map,
      title: 'Current Location',
    });
  }

  distance() {
    const rightPanel = document.getElementById('right-panel') as HTMLDivElement;
    rightPanel.innerHTML = '';

    const origin1 = new google.maps.LatLng(this.user1.lat, this.user1.lng);
    const destinationA = new google.maps.LatLng(this.user2.lat, this.user2.lng);

    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin1],
        destinations: [destinationA],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      }, this.callback);
  }

  callback(response, status) {
    const markersArray: any[] = [];

    if (status !== 'OK') {
      alert('Error was: ' + status);
    } else {
      const originList = response.originAddresses;
      const destinationList = response.destinationAddresses;
      deleteMarkers(markersArray);

      for (let i = 0; i < originList.length; i++) {
        const results = response.rows[i].elements;

        for (let j = 0; j < results.length; j++) {
          const directionsService = new google.maps.DirectionsService();

          const map = new google.maps.Map(document.getElementById('container') as HTMLElement, {
            zoom: 15,
           });
          const directionsRenderer = new google.maps.DirectionsRenderer({
            draggable: true,
            map,
            panel: document.getElementById('right-panel') as HTMLElement,
            polylineOptions: {
              strokeColor: 'blue'
            },
          });
          directionsRenderer.addListener('directions_changed', () => {
            // tslint:disable-next-line: no-non-null-assertion
            computeTotalDistance(directionsRenderer.getDirections()!);
          });
          // tslint:disable-next-line: no-non-null-assertion

          const origin1 = originList[i] as string;
          const destinationA = destinationList[j] as string;

          displayRoute(
            origin1,
            destinationA,
            directionsService,
            directionsRenderer
          );
        }
      }
    }
  }

  deleteMarkers(markersArray: any) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < markersArray.length; i++) {
      markersArray[i].setMap(null);
    }
    markersArray = [];
  }

}

function computeTotalDistance(result: any) {
  let total = 0;
  const myroute = result.routes[0];

  if (!myroute) {
    return;
  }

  for (let i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i]!.distance!.value;
  }
  total = total / 1000;
  (document.getElementById('total') as HTMLElement).innerHTML = total + ' km';
}

function displayRoute(
  origin: string,
  destination: string,
  service: any,
  display: any) {
  service.route(
    {
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING
    },
    (
      result: any | null,
      status: any
    ) => {
      if (status === 'OK' && result) {
        display.setDirections(result);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    }
  );
}


function deleteMarkers(markersArray: any) {
  for (let i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }
  markersArray = [];
}