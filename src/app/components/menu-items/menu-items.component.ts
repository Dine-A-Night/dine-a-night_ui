import { Component, Input, OnInit } from '@angular/core';
import { MenuItemsService } from '../../services/menu-items.service';
import { MenuItem } from '../../models/menu-item';
import { MatDialog } from '@angular/material/dialog';
import { AddMenuItemDialogComponent } from './menu-item/add-menu-item-dialog/add-menu-item-dialog.component';

@Component({
    selector: 'menu-items',
    templateUrl: './menu-items.component.html',
    styleUrls: ['./menu-items.component.scss'],
})
export class MenuItemsComponent implements OnInit {
    @Input() restaurantId: string;
    menuItems: MenuItem[] = [];
    filteredMenuItems: MenuItem[] = [];
    searchTerm: string = '';
    isAdmin: boolean = false; // Variable to track if the user is an admin

    constructor(
        private menuItemsService: MenuItemsService,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.fetchMenuItems();
    }

    fetchMenuItems(): void {
        this.menuItemsService.getMenuItems(this.restaurantId).subscribe(
            (data: any) => {
                if (data.status === 'ok' && Array.isArray(data.menu)) {
                    this.menuItems = data.menu;
                    this.filteredMenuItems = this.menuItems; // Initialize filteredMenuItems
                } else {
                    console.error('Unexpected data format:', data);
                }
            },
            (error) => {
                console.error('Error fetching menu items:', error);
            },
        );
    }

    // Function to filter menu items based on search term
    filterMenuItems(): void {
        this.filteredMenuItems = this.menuItems.filter((menuItem) =>
            menuItem.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
        );
    }

    openAddMenuItemDialog(): void {
        console.log('Opening Add Menu Item dialog...');
        const dialogRef = this.dialog.open(AddMenuItemDialogComponent, {
            data: {
                restaurantId: this.restaurantId, // Pass the restaurantId to the dialog
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Dialog closed with result:', result);
            if (result) {
                // If result is truthy (i.e., if the user added a new menu item)
                // Fetch the updated menu items from the backend
                this.fetchMenuItems();
            }
        });
    }

    addMenuItem(menuItem: MenuItem): void {
        this.menuItemsService
            .addMenuItem(this.restaurantId, menuItem)
            .subscribe(
                (data: any) => {
                    // Handle success response
                    console.log('Menu item added successfully:', data);
                    this.fetchMenuItems(); // Refresh menu items after adding
                },
                (error) => {
                    // Handle error response
                    console.error('Error adding menu item:', error);
                },
            );
    }

    deleteMenuItem(menuItemId?: string): void {
        if (!menuItemId) {
            console.error('Invalid menu item ID:', menuItemId);
            return;
        }

        this.menuItemsService.deleteMenuItem(menuItemId).subscribe(
            (data: any) => {
                // Handle success response
                console.log('Menu item deleted successfully:', data);
                this.fetchMenuItems(); // Refresh menu items after deletion
            },
            (error) => {
                // Handle error response
                console.error('Error deleting menu item:', error);
            },
        );
    }
}
