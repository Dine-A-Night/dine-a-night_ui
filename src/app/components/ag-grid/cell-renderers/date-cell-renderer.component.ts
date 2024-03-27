import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
    selector: 'date-cell-renderer',
    template: `<p>{{ date | date: dateFormat }}</p>`,
    styles: [],
})
export class DateCellRendererComponent implements ICellRendererAngularComp {
    date: Date;
    dateFormat: string;

    agInit(params: ICellRendererParams & DateCellRendererParams): void {
        this.date = params.value;
        this.dateFormat = params.dateFormat || 'fullDate';
    }

    refresh(params: ICellRendererParams): boolean {
        return false;
    }
}

export interface DateCellRendererParams {
    dateFormat?: string;
}
