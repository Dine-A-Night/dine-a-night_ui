import { Component, OnDestroy, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ColDef,
    FirstDataRenderedEvent,
    GridApi,
    GridOptions,
    GridReadyEvent,
    RowClickedEvent,
    ValueGetterParams,
} from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { CurrencyCellRendererComponent } from 'src/app/components/ag-grid/cell-renderers/currency-cell-renderer.component';
import {
    DateCellRendererComponent,
    DateCellRendererParams,
} from 'src/app/components/ag-grid/cell-renderers/date-cell-renderer.component';
import { ImageCellRendererComponent } from 'src/app/components/ag-grid/cell-renderers/image-cell-renderer.component';
import { ReservationState } from 'src/app/models/reservation.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { ProfileUser } from 'src/app/models/user.model';
import { ReservationService } from 'src/app/services/reservation.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { UserService } from 'src/app/services/user.service';
import { ReservationViewModel } from 'src/app/view-models/reservation-view.model';

@Component({
    selector: 'customer-reservations-page',
    templateUrl: './customer-reservations-page.component.html',
    styleUrls: ['./customer-reservations-page.component.scss'],
})
export class CustomerReservationsPageComponent implements OnDestroy {
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    notificationService = inject(MatSnackBar);

    userService = inject(UserService);
    reservationService = inject(ReservationService);

    currentUser;
    reservations: ReservationViewModel[];
    filteredReservations: ReservationViewModel[];

    selectedReservationState = ReservationState.UPCOMING;

    get reservationStateValues() {
        return Object.values(ReservationState);
    }

    currentUserSubscription: Subscription;

    ngOnInit(): void {
        this.userService.currentUser$.subscribe((user: ProfileUser) => {
            this.currentUser = user;

            this.fetchUserReservations(user.uid ?? '');
        });

        this.setupGrid();
    }

    ngOnDestroy(): void {
        this.currentUserSubscription?.unsubscribe();
    }

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
                headerName: '',
                cellRenderer: ImageCellRendererComponent,
                minWidth: 160,
                maxWidth: 160,
                valueGetter: (
                    params: ValueGetterParams<ReservationViewModel>,
                ) => {
                    return (
                        params.data?.restaurant.coverPhotoUri ||
                        RestaurantsService.DEFAULT_COVER_PHOTO_URI
                    );
                },
            },
            {
                headerName: 'Restaurant',
                field: 'restaurant.name',
                minWidth: 150,
            },
            {
                headerName: 'Reservation Date',
                field: 'reservationDate',
                minWidth: 220,
                cellRenderer: DateCellRendererComponent,
                cellRendererParams: {
                    dateFormat: 'fullDate',
                } as DateCellRendererParams,
                sort: 'desc',
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

    filterReservations(reservationState: ReservationState) {
        // this.filteredReservations = this.reservations.filter(reservation => )
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

    fetchUserReservations(userId: string) {
        this.reservationService.getUserReservations(userId, true).subscribe({
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

    getRestaurantCoverPhoto(restaurant: Restaurant) {
        return (
            restaurant.coverPhotoUri ||
            RestaurantsService.DEFAULT_COVER_PHOTO_URI
        );
    }
}
