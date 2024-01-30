import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'dine-a-night-ui';

    constructor(private router: Router) {}

    ngOnInit(): void {
        // this.router.events.subscribe((event) => {
        //     console.log(event.toString());
        // });
    }

    get showHeader() {
        return true; // for now
    }
}
