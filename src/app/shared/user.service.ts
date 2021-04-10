import { Injectable } from '@angular/core';
import { User } from './User';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userList: AngularFireList<any>;
  userRef: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase) {
    this.userList = db.list('/users');
    this.userRef = db.object('/users/user1');
  }

  // Create
  createUser(user: User) {
    return this.userList.push({
      name: user.name,
      lat: user.lat,
      lng: user.lng
    });
  }

  // Get single object
  getUser(id: string) {
    this.userRef = this.db.object('/users/' + id);
    return this.userRef;
  }

  // Get List
  getUserList() {
    this.userList = this.db.list('/users');
    return this.userList;
  }

  // Update
  updateUser(id, user: User) {
    this.userRef = this.db.object('/users/' + id);
    return this.userRef.update({
      name: user.name,
      lat: user.lat,
      lng: user.lng
    });
  }

  // Update
  updateUserName(id, newName: string) {
    this.userRef = this.db.object('/users/' + id);
    return this.userRef.update({
      name: newName,
    });
  }

  // Delete
  deleteUser(id: string) {
    this.userRef = this.db.object('/user/' + id);
    this.userRef.remove();
  }
}
