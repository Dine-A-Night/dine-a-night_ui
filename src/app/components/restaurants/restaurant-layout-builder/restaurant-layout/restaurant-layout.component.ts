import { SpinnerType } from './../../../reusables/loading-spinner/loading-spinner.component';
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    inject,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Restaurant } from 'src/app/models/restaurant.model';
import {
    Table,
    TablePosition,
    TableType,
    Tables,
} from 'src/app/models/table.model';
import { ReservationService } from 'src/app/services/reservation.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';

@Component({
    selector: 'restaurant-layout',
    templateUrl: './restaurant-layout.component.html',
    styleUrls: ['./restaurant-layout.component.scss'],
})
export class RestaurantLayoutComponent implements OnInit, OnChanges {
    @Input() restaurant: Restaurant;
    @Input() unavailableTableIds: string[];
    @Input() editMode: boolean = false;
    @Input() selectionDisabled: boolean = false;

    @Output() tablesUpdated = new EventEmitter<Tables>();

    tables: Tables = [];
    SpinnerType = SpinnerType;

    restaurantLayout: RestaurantLayout;
    layoutRows: number = 5;
    layoutColumns: number = 5;

    tableTypes: TableType[];

    selectedTablePosition: TablePosition | null;

    @Input() selectedTable: Table | null;
    @Output() selectedTableChange = new EventEmitter<Table | null>();

    // Services
    private reservationService = inject(ReservationService);
    private restaurantService = inject(RestaurantsService);
    private notificationService = inject(MatSnackBar);

    ngOnInit(): void {
        this.getTableTypes();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['restaurant'] && this.restaurant) {
            if (this.restaurant.layout) {
                this.layoutRows = this.restaurant.layout.length;
                this.layoutColumns = this.restaurant.layout.width;
            } else {
                this.restaurant.layout = {
                    length: this.layoutRows,
                    width: this.layoutColumns,
                };
            }

            this.fetchExistingTables();
        }

        if (changes['selectedTable']) {
            this.selectedTablePosition = this.selectedTable?.position ?? null;
        }
    }

    isTableUnavailable(tableId?: string | null) {
        return this.unavailableTableIds?.includes(tableId ?? '');
    }

    private getTableTypes() {
        this.reservationService.getTableTypes().subscribe({
            next: (tableTypes) => {
                this.tableTypes = tableTypes;
            },
            error: (err) => {
                console.error(err);
            },
        });
    }

    private fetchExistingTables() {
        this.restaurantService.getAllTables(this.restaurant._id).subscribe({
            next: (tables) => {
                this.tables = tables;

                this.setupGrid();
            },
            error: (err: any) => {
                console.error(err);

                this.notificationService.open(
                    'Failed to fetch existing tables',
                    'Oops',
                    {
                        panelClass: ['fail-snackbar'],
                    },
                );
            },
        });
    }

    private get tablesInLayout(): Tables {
        return this.restaurantLayout
            .flat()
            .filter(
                (table) => table && this.checkTableInBounds(table),
            ) as Tables;
    }

    private checkTableInBounds(table: Table) {
        return (
            table.position.xCoord < this.layoutColumns &&
            table.position.yCoord < this.layoutRows
        );
    }

    private setupGrid() {
        this.restaurantLayout = this.createEmptyLayout(
            this.layoutRows,
            this.layoutColumns,
        );

        this.populateExistingTables();
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
            if (this.checkTableInBounds(table)) {
                this.restaurantLayout[table.position.yCoord][
                    table.position.xCoord
                ] = table;
            }
        }
    }

    private recalculatePositions() {
        for (let yCoord = 0; yCoord < this.restaurantLayout.length; ++yCoord) {
            for (
                let xCoord = 0;
                xCoord < this.restaurantLayout[yCoord].length;
                ++xCoord
            ) {
                let table = this.restaurantLayout[yCoord][xCoord];

                if (table) {
                    table.position = {
                        xCoord,
                        yCoord,
                    };
                }
            }
        }
    }

    isTableSelected(xCoord: number, yCoord: number) {
        return (
            xCoord === this.selectedTablePosition?.xCoord &&
            yCoord === this.selectedTablePosition?.yCoord
        );
    }

    getTableAt(positon: TablePosition) {
        const { xCoord, yCoord } = positon;

        return this.tables.find(
            (table) =>
                table.position.xCoord === xCoord &&
                table.position.yCoord === yCoord,
        );
    }

    onLayoutDimensionsChanged() {
        this.setupGrid();

        // Update Model
        this.restaurant.layout = {
            length: this.layoutRows,
            width: this.layoutColumns,
        };
        this.tablesUpdated.emit(this.tablesInLayout);
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
                event.currentIndex - 1 >= 0
                    ? event.currentIndex - 1
                    : event.currentIndex + 1,
                event.previousIndex,
            );
        }

        this.recalculatePositions();
        this.tablesUpdated.emit(this.tablesInLayout);
    }

    onTableSelected(xCoord: number, yCoord: number) {
        this.selectedTablePosition = !this.isTableSelected(xCoord, yCoord)
            ? {
                  xCoord,
                  yCoord,
              }
            : null;

        const position = this.selectedTablePosition;
        this.selectedTableChange.emit(
            position ? this.getTableAt(position) : null,
        );
    }

    onTableAddedToCell(tableType: TableType, xCoord: number, yCoord: number) {
        const newTable = new Table({
            position: {
                xCoord,
                yCoord,
            },
            restaurantId: this.restaurant._id,
            tableType,
        });

        this.tables.push(newTable);
        this.restaurantLayout[yCoord][xCoord] = newTable;

        this.tablesUpdated.emit(this.tablesInLayout);
    }

    onTableRemovedFromCell(tableId: string, position: TablePosition) {
        const { xCoord, yCoord } = position;

        if (this.tables.find((table) => table._id === tableId)) {
            this.tables.splice(
                this.tables.findIndex((table) => table._id === tableId),
                1,
            );
        }

        this.restaurantLayout[yCoord][xCoord] = null;

        this.tablesUpdated.emit(this.tablesInLayout);
    }

    isEdgeCell(xCoord: number, yCoord: number) {
        return (
            xCoord === 0 ||
            yCoord === 0 ||
            xCoord === this.layoutColumns - 1 ||
            yCoord === this.layoutRows - 1
        );
    }
}

type RestaurantLayout = (Table | null)[][];
