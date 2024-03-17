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
import { Restaurant } from 'src/app/models/restaurant.model';
import {
    Table,
    TablePosition,
    TableType,
    Tables,
} from 'src/app/models/table.model';
import { ReservationService } from 'src/app/services/reservation.service';
import { isDefNotNull } from 'src/app/utils/helper-functions';

@Component({
    selector: 'restaurant-layout',
    templateUrl: './restaurant-layout.component.html',
    styleUrls: ['./restaurant-layout.component.scss'],
})
export class RestaurantLayoutComponent implements OnInit, OnChanges {
    @Input() restaurant: Restaurant;
    @Input() editMode: boolean = false;

    @Output() tablesUpdated = new EventEmitter<Tables>();

    restaurantLayout: RestaurantLayout;
    layoutRows: number = 5;
    layoutColumns: number = 5;

    tableTypes: TableType[];

    selectedTable: TablePosition | null;

    // Services
    private reservationService = inject(ReservationService);

    ngOnInit(): void {
        this.getTableTypes();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['restaurant'] && this.restaurant) {
            this.layoutRows = this.restaurant.layout?.length ?? this.layoutRows;
            this.layoutColumns =
                this.restaurant.layout?.width ?? this.layoutColumns;

            this.setupGrid();
        }
    }

    private getTableTypes() {
        this.reservationService.getTableTypes().subscribe({
            next: (tableTypes) => {
                this.tableTypes = [...tableTypes] as TableType[];

                console.log(tableTypes);
            },
            error: (err) => {
                console.error(err);
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
            xCoord === this.selectedTable?.xCoord &&
            yCoord === this.selectedTable?.yCoord
        );
    }

    onLayoutDimensionsChanged() {
        this.setupGrid();

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
        console.log(this.restaurantLayout);
    }

    onTableSelected(xCoord: number, yCoord: number) {
        this.selectedTable = !this.isTableSelected(xCoord, yCoord)
            ? {
                  xCoord,
                  yCoord,
              }
            : null;
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

    tables: Tables = [
        {
            _id: '1',
            restaurantId: '1',
            position: { xCoord: 1, yCoord: 1 },
            tableType: {
                name: 'Small Table',
                description: 'A small table for 2 people',
                capacity: 2,
                svgHtml: `<svg width="33" height="42" viewBox="0 0 33 42" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M30.6977 42C27.3255 42 27.4904 37.3304 30.6427 37.3304C33.7949 37.3304 33.7583 42 30.6977 42ZM23.0416 26.8104H8.83818C1.96557 26.8104 2.50163 21.0399 2.50163 21.0399L0 19.8947C0 16.4191 4.77876 15.558 5.37438 19.8947L5.60347 21.87H26.6795L27.1377 19.8947C28.054 15.4559 32.3379 16.4191 32.3379 19.8947L30.0471 21.0266C30.0471 21.0266 30.8305 26.8104 23.0416 26.8104ZM7.427 20.059L5.32398 5.65948C5.32398 1.487 9.47963 0 16.1415 0C22.8033 0 26.7253 1.38491 26.7253 5.9702L25.0438 19.624L7.427 20.059ZM3.02395 37.3304C6.17619 37.3304 6.15786 42 3.07893 42C-0.293231 42 -0.142035 37.3304 3.02395 37.3304ZM13.8689 30.9562L14.1897 27.747L17.9467 28.0399L18.4049 30.9341C27.2797 31.5155 30.3174 35.617 30.3174 35.617L27.8249 36.1985C27.8249 36.1985 25.7586 34.3164 18.3774 34.0457L17.7176 35.5992L15.2435 35.4927L14.5928 34.059C7.39493 34.3786 5.59889 36.3938 5.59889 36.3938L2.96439 35.5992C2.96439 35.5992 5.30566 31.5999 13.8689 30.9562ZM16.8242 37.3304C19.9764 37.3304 19.9581 42 16.8791 42C13.507 42 13.6582 37.3304 16.8242 37.3304Z" fill="black"/>
</svg>`,
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
                svgHtml: `<svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M51.9404 36.6327L56.5869 36.6803L56.6424 41.3069L50.9104 41.2481L51.9404 36.6327ZM44.0219 56.4865C44.0219 56.4865 40.2748 56.7688 41.1002 52.1691C41.7053 48.8083 42.7014 43.8718 43.5599 39.6881L40.7024 39.5876C40.1455 43.4537 39.1066 50.3672 38.8203 53.2265C38.3634 57.6756 34.7707 56.4273 34.7707 56.4273L35.1193 41.1634L25.6796 41.0666L23.4511 56.6082C23.4511 56.6082 19.5714 57.0732 19.609 52.5961C19.6264 50.5238 19.8126 47.7168 20.0113 45.296L20.117 43.9491C20.3028 41.8072 20.4682 40.2293 20.4682 40.2293L20.4419 40.2291L21.0268 33.0378C21.078 32.479 21.058 31.9148 20.9675 31.3626C18.9043 30.9851 18.3587 29.7443 18.5283 28.2912C16.436 27.6224 13.8848 29.1403 14.0613 33.103L15.6319 33.4457C16.0532 29.4891 19.0157 30.2083 18.7372 33.3884L18.5243 39.9956L12.1382 39.1463C12.1382 39.1463 12.201 49.7647 12.2723 53.1444C12.3312 56.1142 8.92247 56.0792 8.92247 56.0792C8.92247 56.0792 7.2773 46.5194 6.275 40.9686L0.144458 40.9058L0.413828 36.3123L5.60565 36.3655C5.65822 33.8541 7.20887 32.8189 9.79153 31.925L7.0655 29.9077C4.93453 22.6113 9.38576 16.5523 9.38576 16.5523L12.107 15.3926L14.9047 19.489L20.24 14.9593L23.3745 16.4226C23.3745 16.4226 26.9025 20.3662 26.3067 28.8519L24.5578 31.0193L26.453 35.7894L26.3581 36.4654L30.3228 36.5061L33.2243 28.8813C31.8232 27.7149 30.0106 24.9825 30.0106 24.9825C30.3398 21.3813 32.5975 14.8366 32.5975 14.8366L35.1871 13.7467L40.6292 16.4748L42.2205 14.3414C44.0657 17.5789 45.1551 19.621 43.7262 22.4033C47.2988 24.1561 48.1002 28.6537 46.5907 32.2844C48.801 33.2631 50.0318 35.3364 49.2524 38.2085C48.0342 42.7507 44.0429 56.4868 44.0429 56.4868L44.0219 56.4865ZM39.706 12.1125L33.1604 10.2639C33.2666 8.45844 33.4567 6.66055 33.7302 4.87771C35.0442 -1.0828 42.3145 -0.586646 42.6446 5.06411C39.9553 5.5413 39.5627 6.70713 39.706 12.1125ZM20.2722 9.25288C19.4292 15.3251 11.9288 16.0083 11.5034 9.21049C9.7939 8.55163 8.58621 7.47034 8.59888 5.96213L11.9853 4.91607L13.3653 1.0881L18.4181 1.46651L19.7504 5.1857L22.9146 6.23954C22.9026 7.67056 21.8243 8.66902 20.272 9.27664L20.2722 9.25288Z" fill="black"/>
</svg>`,
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
                svgHtml: `<svg width="47" height="42" viewBox="0 0 47 42" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M46.5396 17.8701C46.1864 18.9215 43.5088 29.3227 43.5088 29.3227L43.5406 41.5385H42.2901L41.1279 29.9497L36.9632 29.9224L37.1398 41.8851C37.1398 41.8851 34.2856 42.8119 33.9606 39.4007C33.7522 37.22 33.0068 32.5353 32.5723 29.8951H30.301C30.5482 30.9738 31.7457 36.2231 32.1626 38.5868C32.7878 42.1188 29.8241 41.8695 29.8241 41.8695C29.8241 41.8695 27.1853 33.4349 26.1327 29.9808C25.3238 27.3406 26.4117 25.1132 28.6866 24.2331L30.2798 23.6178L30.1809 21.6162L25.5604 23.9527C23.6529 24.9029 22.3212 23.8164 22.4448 22.3951L27.4362 18.1505L28.0225 12.5702C28.9176 11.7018 29.9846 11.0763 31.1382 10.7439L32.477 13.131L36.0094 10.2221C37.0781 10.3047 38.0985 10.7448 38.9343 11.4838C38.9343 11.4838 40.7005 16.6006 41.4741 19.0812C41.9686 20.6388 40.3013 22.9753 39.3546 24.1124C39.5264 25.1696 39.5264 26.2522 39.3546 27.3094H42.0817L43.9892 20.1598L43.2191 20.1209L41.1986 13.5944C41.1986 13.5944 44.0952 13.5632 45.4375 13.5632C47.0765 13.5632 47.3945 15.261 46.5396 17.8701ZM29.0787 4.81313C29.0787 -0.155766 35.5466 0.724305 35.045 5.14802C34.5646 9.41987 29.0787 9.84822 29.0787 4.81313ZM19.739 24.8133C21.5688 25.9815 21.8584 27.033 22.0456 28.7853C22.2293 30.6 23.123 39.1125 23.123 39.1125C23.123 39.1125 24.5113 40.1211 24.3135 41.5463H19.0325L16.913 29.8873H15.1715L16.3867 38.9606C16.3867 38.9606 18.1529 40.4677 17.5594 41.5385L12.335 41.5113L9.75275 29.9419L5.77168 29.9652L4.60951 41.5541H3.43674L3.27425 29.3383C3.27425 29.3383 0.518941 18.9449 0.243411 17.8701C-0.463078 15.1442 0.405903 13.6177 2.36288 12.9791C2.36288 12.9791 1.71644 14.6847 2.11914 16.2229C3.01638 19.6809 4.54593 25.5688 5.00514 27.325H6.13906L6.84555 23.5399C5.33013 23.0493 4.87091 22.1108 3.8571 18.0414C2.88921 14.1473 3.50386 13.0764 7.21292 10.0858C7.2765 10.0624 7.35069 10.0468 7.42133 10.0273L11.4483 12.9246L13.1969 10.0001C14.2994 10.2332 15.3309 10.769 16.1959 11.5577L16.694 13.1154H21.6182L20.6256 19.2253C21.8973 20.1053 21.4239 23.0454 19.3575 23.0454C17.4782 23.0454 16.9413 20.7985 17.7997 18.976H19.1067L19.7531 14.821L13.4406 14.7042L11.6461 23.6334L18.2589 23.8826L19.739 24.8133ZM6.35454 5.16749C6.23443 4.09661 6.27682 0.190811 6.27682 0.190811L12.1972 0C12.1972 0 12.3385 3.20096 12.3385 4.8326C12.3244 9.8638 6.83848 9.41987 6.35454 5.16749Z" fill="black"/>
</svg>`,
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
                svgHtml: `<svg width="33" height="42" viewBox="0 0 33 42" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M30.6977 42C27.3255 42 27.4904 37.3304 30.6427 37.3304C33.7949 37.3304 33.7583 42 30.6977 42ZM23.0416 26.8104H8.83818C1.96557 26.8104 2.50163 21.0399 2.50163 21.0399L0 19.8947C0 16.4191 4.77876 15.558 5.37438 19.8947L5.60347 21.87H26.6795L27.1377 19.8947C28.054 15.4559 32.3379 16.4191 32.3379 19.8947L30.0471 21.0266C30.0471 21.0266 30.8305 26.8104 23.0416 26.8104ZM7.427 20.059L5.32398 5.65948C5.32398 1.487 9.47963 0 16.1415 0C22.8033 0 26.7253 1.38491 26.7253 5.9702L25.0438 19.624L7.427 20.059ZM3.02395 37.3304C6.17619 37.3304 6.15786 42 3.07893 42C-0.293231 42 -0.142035 37.3304 3.02395 37.3304ZM13.8689 30.9562L14.1897 27.747L17.9467 28.0399L18.4049 30.9341C27.2797 31.5155 30.3174 35.617 30.3174 35.617L27.8249 36.1985C27.8249 36.1985 25.7586 34.3164 18.3774 34.0457L17.7176 35.5992L15.2435 35.4927L14.5928 34.059C7.39493 34.3786 5.59889 36.3938 5.59889 36.3938L2.96439 35.5992C2.96439 35.5992 5.30566 31.5999 13.8689 30.9562ZM16.8242 37.3304C19.9764 37.3304 19.9581 42 16.8791 42C13.507 42 13.6582 37.3304 16.8242 37.3304Z" fill="black"/>
</svg>`,
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
                svgHtml: `<svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M51.9404 36.6327L56.5869 36.6803L56.6424 41.3069L50.9104 41.2481L51.9404 36.6327ZM44.0219 56.4865C44.0219 56.4865 40.2748 56.7688 41.1002 52.1691C41.7053 48.8083 42.7014 43.8718 43.5599 39.6881L40.7024 39.5876C40.1455 43.4537 39.1066 50.3672 38.8203 53.2265C38.3634 57.6756 34.7707 56.4273 34.7707 56.4273L35.1193 41.1634L25.6796 41.0666L23.4511 56.6082C23.4511 56.6082 19.5714 57.0732 19.609 52.5961C19.6264 50.5238 19.8126 47.7168 20.0113 45.296L20.117 43.9491C20.3028 41.8072 20.4682 40.2293 20.4682 40.2293L20.4419 40.2291L21.0268 33.0378C21.078 32.479 21.058 31.9148 20.9675 31.3626C18.9043 30.9851 18.3587 29.7443 18.5283 28.2912C16.436 27.6224 13.8848 29.1403 14.0613 33.103L15.6319 33.4457C16.0532 29.4891 19.0157 30.2083 18.7372 33.3884L18.5243 39.9956L12.1382 39.1463C12.1382 39.1463 12.201 49.7647 12.2723 53.1444C12.3312 56.1142 8.92247 56.0792 8.92247 56.0792C8.92247 56.0792 7.2773 46.5194 6.275 40.9686L0.144458 40.9058L0.413828 36.3123L5.60565 36.3655C5.65822 33.8541 7.20887 32.8189 9.79153 31.925L7.0655 29.9077C4.93453 22.6113 9.38576 16.5523 9.38576 16.5523L12.107 15.3926L14.9047 19.489L20.24 14.9593L23.3745 16.4226C23.3745 16.4226 26.9025 20.3662 26.3067 28.8519L24.5578 31.0193L26.453 35.7894L26.3581 36.4654L30.3228 36.5061L33.2243 28.8813C31.8232 27.7149 30.0106 24.9825 30.0106 24.9825C30.3398 21.3813 32.5975 14.8366 32.5975 14.8366L35.1871 13.7467L40.6292 16.4748L42.2205 14.3414C44.0657 17.5789 45.1551 19.621 43.7262 22.4033C47.2988 24.1561 48.1002 28.6537 46.5907 32.2844C48.801 33.2631 50.0318 35.3364 49.2524 38.2085C48.0342 42.7507 44.0429 56.4868 44.0429 56.4868L44.0219 56.4865ZM39.706 12.1125L33.1604 10.2639C33.2666 8.45844 33.4567 6.66055 33.7302 4.87771C35.0442 -1.0828 42.3145 -0.586646 42.6446 5.06411C39.9553 5.5413 39.5627 6.70713 39.706 12.1125ZM20.2722 9.25288C19.4292 15.3251 11.9288 16.0083 11.5034 9.21049C9.7939 8.55163 8.58621 7.47034 8.59888 5.96213L11.9853 4.91607L13.3653 1.0881L18.4181 1.46651L19.7504 5.1857L22.9146 6.23954C22.9026 7.67056 21.8243 8.66902 20.272 9.27664L20.2722 9.25288Z" fill="black"/>
</svg>`,
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
                svgHtml: `<svg width="47" height="42" viewBox="0 0 47 42" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M46.5396 17.8701C46.1864 18.9215 43.5088 29.3227 43.5088 29.3227L43.5406 41.5385H42.2901L41.1279 29.9497L36.9632 29.9224L37.1398 41.8851C37.1398 41.8851 34.2856 42.8119 33.9606 39.4007C33.7522 37.22 33.0068 32.5353 32.5723 29.8951H30.301C30.5482 30.9738 31.7457 36.2231 32.1626 38.5868C32.7878 42.1188 29.8241 41.8695 29.8241 41.8695C29.8241 41.8695 27.1853 33.4349 26.1327 29.9808C25.3238 27.3406 26.4117 25.1132 28.6866 24.2331L30.2798 23.6178L30.1809 21.6162L25.5604 23.9527C23.6529 24.9029 22.3212 23.8164 22.4448 22.3951L27.4362 18.1505L28.0225 12.5702C28.9176 11.7018 29.9846 11.0763 31.1382 10.7439L32.477 13.131L36.0094 10.2221C37.0781 10.3047 38.0985 10.7448 38.9343 11.4838C38.9343 11.4838 40.7005 16.6006 41.4741 19.0812C41.9686 20.6388 40.3013 22.9753 39.3546 24.1124C39.5264 25.1696 39.5264 26.2522 39.3546 27.3094H42.0817L43.9892 20.1598L43.2191 20.1209L41.1986 13.5944C41.1986 13.5944 44.0952 13.5632 45.4375 13.5632C47.0765 13.5632 47.3945 15.261 46.5396 17.8701ZM29.0787 4.81313C29.0787 -0.155766 35.5466 0.724305 35.045 5.14802C34.5646 9.41987 29.0787 9.84822 29.0787 4.81313ZM19.739 24.8133C21.5688 25.9815 21.8584 27.033 22.0456 28.7853C22.2293 30.6 23.123 39.1125 23.123 39.1125C23.123 39.1125 24.5113 40.1211 24.3135 41.5463H19.0325L16.913 29.8873H15.1715L16.3867 38.9606C16.3867 38.9606 18.1529 40.4677 17.5594 41.5385L12.335 41.5113L9.75275 29.9419L5.77168 29.9652L4.60951 41.5541H3.43674L3.27425 29.3383C3.27425 29.3383 0.518941 18.9449 0.243411 17.8701C-0.463078 15.1442 0.405903 13.6177 2.36288 12.9791C2.36288 12.9791 1.71644 14.6847 2.11914 16.2229C3.01638 19.6809 4.54593 25.5688 5.00514 27.325H6.13906L6.84555 23.5399C5.33013 23.0493 4.87091 22.1108 3.8571 18.0414C2.88921 14.1473 3.50386 13.0764 7.21292 10.0858C7.2765 10.0624 7.35069 10.0468 7.42133 10.0273L11.4483 12.9246L13.1969 10.0001C14.2994 10.2332 15.3309 10.769 16.1959 11.5577L16.694 13.1154H21.6182L20.6256 19.2253C21.8973 20.1053 21.4239 23.0454 19.3575 23.0454C17.4782 23.0454 16.9413 20.7985 17.7997 18.976H19.1067L19.7531 14.821L13.4406 14.7042L11.6461 23.6334L18.2589 23.8826L19.739 24.8133ZM6.35454 5.16749C6.23443 4.09661 6.27682 0.190811 6.27682 0.190811L12.1972 0C12.1972 0 12.3385 3.20096 12.3385 4.8326C12.3244 9.8638 6.83848 9.41987 6.35454 5.16749Z" fill="black"/>
</svg>`,
            },
        },
        // Add more sample tables as needed
    ];
}

type RestaurantLayout = (Table | null)[][];
