import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
    selector: 'image-cell-renderer',
    template: `<img
        class="w-36 h-24"
        src="{{ imageSrc }}"
        alt="Image" />`,
    styles: [],
})
export class ImageCellRendererComponent implements ICellRendererAngularComp {
    imageSrc: string = '';

    agInit(params: ICellRendererParams): void {
        this.imageSrc = params.value;
    }

    refresh(params: ICellRendererParams<any, any, any>): boolean {
        return false;
    }
}
