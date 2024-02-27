import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'images-grid',
    templateUrl: './images-grid.component.html',
    styleUrls: ['./images-grid.component.scss'],
})
export class ImagesGridComponent implements OnInit {
    @Input() imageUrls: string[] = [];

    ngOnInit(): void {
        console.log(this.imageUrls);
    }
}
