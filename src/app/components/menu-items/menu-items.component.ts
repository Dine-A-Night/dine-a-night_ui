import { Component, Input, OnInit } from '@angular/core';
import { MenuItemsService } from '../../services/menu-items.service';
import { MenuItem } from '../../models/menu-item';
import { MatDialog } from '@angular/material/dialog';
import { AddMenuItemDialogComponent } from '../menu-item/add-menu-item-dialog/add-menu-item-dialog.component';

@Component({
    selector: 'menu-items',
    templateUrl: './menu-items.component.html',
    styleUrls: ['./menu-items.component.scss'],
})
export class MenuItemsComponent implements OnInit {
    @Input() restaurantId: string;
    menuItems: MenuItem[] = [];

    constructor(
        private menuItemsService: MenuItemsService,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.menuItemsService.getMenuItems(this.restaurantId).subscribe(
            (data) => {
                this.menuItems = data;
            },
            (error) => {
                console.error('Error fetching menu items:', error);
            },
        );
    }

    openAddMenuItemDialog(): void {
        const dialogRef = this.dialog.open(AddMenuItemDialogComponent);

        // You can optionally handle the result when the dialog is closed
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
        });
    }
}
