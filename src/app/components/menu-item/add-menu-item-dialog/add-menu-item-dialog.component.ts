import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-add-menu-item-dialog',
    templateUrl: './add-menu-item-dialog.component.html',
    styleUrls: ['./add-menu-item-dialog.component.scss'],
})
export class AddMenuItemDialogComponent implements OnInit {
    menuItem: any = {
        name: '',
        price: 0,
        // Add more properties here for other fields in your menu item
    };

    constructor(public dialogRef: MatDialogRef<AddMenuItemDialogComponent>) {}

    ngOnInit(): void {}

    onCancel(): void {
        this.dialogRef.close();
    }

    onCreate(): void {
        // Perform action to create menu item (e.g., send data to server)
        console.log('Creating menu item:', this.menuItem);
        // After creating the menu item, close the dialog
        this.dialogRef.close();
    }
}
