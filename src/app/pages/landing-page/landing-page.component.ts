import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
    selector: 'landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
    playTransition = false;

    ngOnInit(): void {
        this.playTransition = true;
    }
}
