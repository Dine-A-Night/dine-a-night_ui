import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export type ConfirmDialogParams = {
    title?: string;
    message?: string;
};

@Component({
    selector: 'confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
    dialogTitle: string = 'Confirm';
    message: string = 'Are you sure?';

    constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogParams) {
        const { title, message } = data;

        this.dialogTitle = title ?? this.dialogTitle;
        this.message = message ?? this.message;
    }
}
