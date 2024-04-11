import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { Restaurant } from 'src/app/models/restaurant.model';
import { ProfileUser, UserRole } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { MenuItem } from '../../models/menu-item';
import { MenuItemsService } from '../../services/menu-items.service';
import { AddMenuItemDialogComponent } from './menu-item/add-menu-item-dialog/add-menu-item-dialog.component';

@Component({
    selector: 'menu-items',
    templateUrl: './menu-items.component.html',
    styleUrls: ['./menu-items.component.scss'],
})
export class MenuItemsComponent implements OnInit, OnDestroy {
    @Input() restaurant: Restaurant;
    menuItems: MenuItem[] = [];
    filteredMenuItems: MenuItem[] = [];
    searchTerm: string = '';
    showEditControls = false;

    searchTextUpdated: Subject<any> = new Subject<any>();

    userSubscription: Subscription;

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

        this.userSubscription = this.userService.currentUser$.subscribe(
            (user: ProfileUser) => {
                this.showEditControls =
                    user?.role === UserRole.ADMIN &&
                    user?.uid === this.restaurant.ownerId;
            },
        );
    }

    ngOnDestroy(): void {
        this.userSubscription?.unsubscribe();
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
        this.filteredMenuItems = this.menuItems.filter((menuItem) => {
            const searchContent = `${menuItem.name} ${menuItem.description}`;

            return searchContent
                ?.toLowerCase()
                .includes(this.searchTerm.toLowerCase());
        });
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
