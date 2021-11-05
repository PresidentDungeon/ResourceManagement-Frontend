import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../shared/models/user';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.scss']
})
export class ProfilepageComponent implements OnInit {

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  userID: number;
  user: User = null;

  ngOnInit(): void {
    this.userID = + this.route.snapshot.paramMap.get('id');
    this.getUserByID();
  }

  getUserByID(){
    this.userService.getUserByID(this.userID).subscribe(
      (user) => {
        this.user = user;
      }
    );
  }
}
