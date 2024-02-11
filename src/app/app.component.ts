import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'dine-a-night-ui';

    constructor(private userService: UserService) {}

    ngOnInit(): void {
        // this.router.events.subscribe((event) => {
        //     console.log(event.toString());
        // });
    }

    get userDataAvailable() {
        return this.userService.currentUser() !== undefined;
    }

    get showHeader() {
        return true;
    }
}
