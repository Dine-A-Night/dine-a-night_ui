import { Component, Input, OnInit } from '@angular/core';
import { MenuItemsService } from '../../services/menu-items.service';
import { MenuItem } from '../../models/menu-item';
import { MatDialog } from '@angular/material/dialog';
import { AddMenuItemDialogComponent } from './menu-item/add-menu-item-dialog/add-menu-item-dialog.component';
import { Subject, debounceTime } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Restaurant } from 'src/app/models/restaurant';
import { ProfileUser } from 'src/app/models/user';

@Component({
    selector: 'menu-items',
    templateUrl: './menu-items.component.html',
    styleUrls: ['./menu-items.component.scss'],
})
export class MenuItemsComponent implements OnInit {
    @Input() restaurant: Restaurant;
    menuItems: MenuItem[] = [];
    filteredMenuItems: MenuItem[] = [];
    searchTerm: string = '';
    showEditControls = false;

    searchTextUpdated: Subject<any> = new Subject<any>();

    constructor(
        private menuItemsService: MenuItemsService,
        private dialog: MatDialog,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.fetchMenuItems();

        this.searchTextUpdated.pipe(debounceTime(300)).subscribe((newText) => {
            this.filterMenuItems();
        });

        this.userService.currentUser$.subscribe((user: ProfileUser) => {
            this.showEditControls = user.uid === this.restaurant.ownerId;
        });
    }

    fetchMenuItems(): void {
        this.menuItemsService.getMenuItems(this.restaurant._id).subscribe({
            next: (data: any) => {
                this.menuItems = data.menu;
                this.filteredMenuItems = [...this.menuItems];
            },
            error: (error) => {
                console.error('Error fetching menu items:', error);
            },
        });
    }

    // Function to filter menu items based on search term
    filterMenuItems(): void {
        this.filteredMenuItems = this.menuItems.filter((menuItem) =>
            menuItem.name
                ?.toLowerCase()
                .includes(this.searchTerm.toLowerCase()),
        );
    }

    openAddMenuItemDialog(): void {
        const dialogRef = this.dialog.open(AddMenuItemDialogComponent, {
            data: {
                restaurantId: this.restaurant._id, // Pass the restaurantId to the dialog
            },
        });
        dialogRef.afterClosed().subscribe((newItem) => {
            if (newItem) {
                this.menuItems.push(newItem);
                this.filterMenuItems();
            }
        });
    }

    onMenuItemDeleted(itemId: string) {
        this.menuItems = this.menuItems.filter((item) => item._id !== itemId);

        this.filterMenuItems();
    }
}
