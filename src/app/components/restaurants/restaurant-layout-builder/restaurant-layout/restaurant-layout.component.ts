import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Table, Tables } from 'src/app/models/table.model';

@Component({
    selector: 'restaurant-layout',
    templateUrl: './restaurant-layout.component.html',
    styleUrls: ['./restaurant-layout.component.scss'],
})
export class RestaurantLayoutComponent implements OnChanges {
    @Input() restaurant: Restaurant;

    restaurantLayout: RestaurantLayout;
    layoutRows: number = 5;
    layoutColumns: number = 5;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['restaurant'] && this.restaurant) {
            this.layoutRows = this.restaurant.layout?.length ?? this.layoutRows;
            this.layoutColumns =
                this.restaurant.layout?.width ?? this.layoutColumns;

            this.setupGrid();
        }
    }

    private setupGrid() {
        this.restaurantLayout = this.createEmptyLayout(
            this.layoutRows,
            this.layoutColumns,
        );

        this.populateExistingTables();
        console.log(this.restaurantLayout);
    }

    private createEmptyLayout(rows: number, columns: number): RestaurantLayout {
        const layout: RestaurantLayout = [];
        for (let i = 0; i < rows; i++) {
            const row: (Table | null)[] = [];
            for (let j = 0; j < columns; j++) {
                row.push(null);
            }
            layout.push(row);
        }
        return layout;
    }

    private populateExistingTables() {
        // Fetch tables belonging to the restaurant and populate the existing array
        for (let table of this.tables) {
            this.restaurantLayout[table.position.xCoord][
                table.position.yCoord
            ] = table;
        }
    }

    onLayoutDiemensionsChanged() {
        this.setupGrid();
    }

    drop(event: CdkDragDrop<(Table | null)[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );

            transferArrayItem(
                event.container.data,
                event.previousContainer.data,
                event.currentIndex - 1,
                event.previousIndex,
            );
        }

        console.log(this.restaurantLayout);
    }

    tables: Tables = [
        {
            _id: '1',
            restaurantId: '1',
            position: { xCoord: 1, yCoord: 1 },
            tableType: {
                name: 'Small Table',
                description: 'A small table for 2 people',
                capacity: 2,
            },
        },
        {
            _id: '2',
            restaurantId: '1',
            position: { xCoord: 2, yCoord: 1 },
            tableType: {
                name: 'Medium Table',
                description: 'A medium table for 4 people',
                capacity: 4,
            },
        },
        {
            _id: '3',
            restaurantId: '1',
            position: { xCoord: 3, yCoord: 1 },
            tableType: {
                name: 'Large Table',
                description: 'A large table for 6 people',
                capacity: 6,
            },
        },
        {
            _id: '4',
            restaurantId: '1',
            position: { xCoord: 1, yCoord: 2 },
            tableType: {
                name: 'Small Table',
                description: 'A small table for 2 people',
                capacity: 2,
            },
        },
        {
            _id: '5',
            restaurantId: '1',
            position: { xCoord: 2, yCoord: 2 },
            tableType: {
                name: 'Medium Table',
                description: 'A medium table for 4 people',
                capacity: 4,
            },
        },
        {
            _id: '6',
            restaurantId: '1',
            position: { xCoord: 3, yCoord: 2 },
            tableType: {
                name: 'Large Table',
                description: 'A large table for 6 people',
                capacity: 6,
            },
        },
        // Add more sample tables as needed
    ];
}

type RestaurantLayout = (Table | null)[][];
