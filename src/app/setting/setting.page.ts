import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  
  nombreAmigo = '';
  name = '';
  latAmigo = 0;
  lonAmigo = 0;

  constructor(
    private apiService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  friendInfo() {
    this.apiService.getUser('user2').valueChanges().subscribe({
      next: (res: any) => {
        this.nombreAmigo = res.name as string;
        this.latAmigo = res.lng as number;
        this.lonAmigo = res.lat as number;
      },
      error: (err: any) => {
        console.log('Error trying to get user info', err);
      },
    });
  }

  updateName() {
    if (this.name === '') {
      return;
    }
    this.apiService.updateUserName('user1', this.name).then(res => {
      this.router.navigate(['/setting']);
    })
      .catch(error => console.log(error));
  }


}
