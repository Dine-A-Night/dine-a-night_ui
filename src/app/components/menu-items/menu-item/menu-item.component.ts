import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuItem } from 'src/app/models/menu-item';
import { MenuItemsService } from 'src/app/services/menu-items.service';
import { ConfirmDialogComponent } from '../../reusables/confirm-dialog/confirm-dialog.component';
import { AddMenuItemDialogComponent } from './add-menu-item-dialog/add-menu-item-dialog.component';

@Component({
    selector: 'menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent {
    @Input() menuItem: MenuItem;
    @Input() showDelete: boolean;
    @Output() itemDeleted = new EventEmitter<string>();

    menuItemsService = inject(MenuItemsService);
    notificationService = inject(MatSnackBar);
    dialog = inject(MatDialog);

    deleteMenuItem(): void {
        const menuItemId = this.menuItem._id;

        this.dialog
            .open(ConfirmDialogComponent, {
                data: {
                    title: 'Confirm Delete',
                    message: 'Are you sure you want to delete this menu item?',
                },
            })
            .afterClosed()
            .subscribe((response: boolean) => {
                if (response) {
                    if (!menuItemId) {
                        console.error('Invalid menu item ID:', menuItemId);
                        return;
                    }

                    this.menuItemsService.deleteMenuItem(menuItemId).subscribe({
                        next: (data: any) => {
                            this.notificationService.open(
                                'Item successfully deleted.',
                                'Ok',
                                {
                                    duration: 3000,
                                },
                            );
                            this.itemDeleted.emit(menuItemId);
                        },
                        error: (error) => {
                            this.notificationService.open(
                                'Failed to delete the item',
                                'Oops',
                            );
                            console.error('Error deleting menu item:', error);
                        },
                    });
                }
            });
    }

    openEditDialog(): void {
        const dialogRef = this.dialog.open(AddMenuItemDialogComponent, {
            width: '420px',
            data: {
                isEdit: true,
                menuItem: this.menuItem,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {});
    }

    get itemImage() {
        return (
            this.menuItem.imageUri || MenuItemsService.DEFAULT_MENU_ITEM_IMAGE
        );
    }
}
