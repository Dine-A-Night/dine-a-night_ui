import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {
    Reservation,
    ReservationState,
    Reservations,
} from 'src/app/models/reservation.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { ReservationService } from 'src/app/services/reservation.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { ReservationViewModel } from 'src/app/view-models/reservation-view.model';
import {
    ColDef,
    FirstDataRenderedEvent,
    GridApi,
    GridOptions,
    GridReadyEvent,
    RowClickedEvent,
    ValueGetterParams,
} from 'ag-grid-community';
import { ImageCellRendererComponent } from 'src/app/components/ag-grid/cell-renderers/image-cell-renderer.component';
import {
    DateCellRendererComponent,
    DateCellRendererParams,
} from 'src/app/components/ag-grid/cell-renderers/date-cell-renderer.component';
import { CurrencyCellRendererComponent } from 'src/app/components/ag-grid/cell-renderers/currency-cell-renderer.component';
import { isDefNotNull } from 'src/app/utils/helper-functions';

@Component({
    selector: 'restaurant-reservations-page',
    templateUrl: './restaurant-reservations-page.component.html',
    styleUrls: ['./restaurant-reservations-page.component.scss'],
})
export class RestaurantReservationsPageComponent implements OnInit {
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    notificationService = inject(MatSnackBar);

    restaurantService = inject(RestaurantsService);
    reservationService = inject(ReservationService);

    restaurant: Restaurant;

    reservations: ReservationViewModel[];
    filteredReservations: ReservationViewModel[];

    //#region Grid

    gridApi: GridApi;

    columnDefs: ColDef[];
    gridOptions: GridOptions;

    onGridReady(event: GridReadyEvent) {
        this.gridApi = event.api;
    }

    onFirstDataRendered(event: FirstDataRenderedEvent) {
        console.log(event);
    }

    onRowClicked(event: RowClickedEvent<ReservationViewModel>) {
        const reservationId = event.data?._id;

        console.log(event);
    }

    setupGrid() {
        this.gridOptions = {
            defaultColDef: {
                resizable: true,
                sortable: true,
                autoHeight: true,
                filter: true,
                wrapText: true,
            },
            animateRows: true,
            rowClass: [
                'cursor-pointer',
                'hover:bg-orange-200',
                'hover:border-orange-500',
                'hover:border-y-2',
            ],
            autoSizeStrategy: {
                type: 'fitGridWidth',
            },
            overlayNoRowsTemplate: 'No Reservations to Show',
            onRowClicked: this.onRowClicked,
        };

        this.columnDefs = [
            {
                headerName: '#',
                maxWidth: 20,
                valueGetter: (
                    params: ValueGetterParams<ReservationViewModel>,
                ) => {
                    return isDefNotNull(params.node?.rowIndex)
                        ? params.node!.rowIndex! + 1
                        : '';
                },
            },
            {
                headerName: 'Customer',
                field: 'user.firstName',
                minWidth: 150,
                valueGetter: (
                    params: ValueGetterParams<ReservationViewModel>,
                ) => {
                    const user = params.data?.user;

                    return user
                        ? `${user.firstName} ${user.lastName}`
                        : 'Guest';
                },
            },
            {
                headerName: 'Reservation Date',
                field: 'reservationDate',
                minWidth: 220,
                cellRenderer: DateCellRendererComponent,
                cellRendererParams: {
                    dateFormat: 'fullDate',
                } as DateCellRendererParams,
                sort: 'asc',
            },
            {
                headerName: 'Start Time',
                field: 'startDateTime',
                minWidth: 114,
                cellRenderer: DateCellRendererComponent,
                cellRendererParams: {
                    dateFormat: 'shortTime',
                } as DateCellRendererParams,
            },
            {
                headerName: 'End Time',
                field: 'endDateTime',
                minWidth: 114,
                cellRenderer: DateCellRendererComponent,
                cellRendererParams: {
                    dateFormat: 'shortTime',
                } as DateCellRendererParams,
            },
            {
                headerName: 'Total Price',
                field: 'preOrder.totalPrice',
                minWidth: 100,
                valueGetter: (params) => {
                    return params.data.preOrder?.totalPrice || 0;
                },
                cellRenderer: CurrencyCellRendererComponent,
            },
        ];
    }

    selectedReservationState = ReservationState.UPCOMING;
    reservationStateValues = Object.values(ReservationState);

    filterReservations(reservationState: ReservationState) {
        console.log(reservationState);

        if (reservationState === ReservationState.CANCELLED) {
            this.filteredReservations = this.reservations.filter(
                (reservation) => reservation.isCancelled,
            );
        } else if (reservationState === ReservationState.HISTORICAL) {
            this.filteredReservations = this.reservations.filter(
                (reservation) => reservation.isHistorical(),
            );
        } else if (reservationState === ReservationState.UPCOMING) {
            this.filteredReservations = this.reservations.filter(
                (reservation) =>
                    !reservation.isCancelled && !reservation.isHistorical(),
            );
        } else {
            this.filteredReservations = this.reservations;
        }
    }

    //#endregion

    ngOnInit(): void {
        const restaurantId = this.activatedRoute.snapshot.params['id'] ?? null;

        this.fetchRestaurantInfo(restaurantId);
        this.fetchReservations(restaurantId);

        this.setupGrid();
    }

    get restaurantCoverImage() {
        return (
            this.restaurant.coverPhotoUri ||
            RestaurantsService.DEFAULT_COVER_PHOTO_URI
        );
    }

    fetchRestaurantInfo(restaurantId: string) {
        this.restaurantService.getRestaurantById(restaurantId).subscribe({
            next: (restaurant) => {
                this.restaurant = restaurant;
            },
            error: (error: any) => {
                console.error(error);

                this.notificationService.open(
                    'Failed to get restaurant info',
                    'Oops',
                    {
                        panelClass: ['fail-snackbar'],
                    },
                );
            },
        });
    }

    fetchReservations(restaurantId: string) {
        this.reservationService
            .getRestaurantReservations(restaurantId, true)
            .subscribe({
                next: (reservations) => {
                    this.reservations = reservations;

                    this.filterReservations(this.selectedReservationState);
                },
                error: (err) => {
                    console.error(err);

                    this.notificationService.open(
                        'Failed to fetch reservations',
                        'Oops',
                        {
                            panelClass: ['fail-snackbar'],
                        },
                    );
                },
            });
    }
}
