import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
    selector: 'currency-cell-renderer',
    template: `
        <p>
            {{
                currencyValue
                    | currency: currencyCode : currencyDisplay : digitsInfo
            }}
        </p>
    `,
    styles: [],
})
export class CurrencyCellRendererComponent implements ICellRendererAngularComp {
    currencyValue: number = 0;

    currencyCode: string = 'CAD';
    currencyDisplay: CurrencyDisplay = 'symbol-narrow';
    digitsInfo: string = '1.2-2';

    agInit(params: ICellRendererParams & CurrencyCellRendererParams): void {
        this.currencyValue = params.value;
    }
    refresh(params: ICellRendererParams): boolean {
        return false;
    }
}

export interface CurrencyCellRendererParams {
    currencyCode: string; // CAD, USD
    display: CurrencyDisplay;
    digitsInfo: string;
}

export type CurrencyDisplay = 'code' | 'symbol' | 'symbol-narrow' | boolean;
