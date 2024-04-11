import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Reservation } from 'src/app/models/reservation.model';
import { ProfileUser } from 'src/app/models/user.model';

@Component({
    selector: 'create-reservation-summary',
    templateUrl: './create-reservation-summary.component.html',
    styleUrls: ['./create-reservation-summary.component.scss'],
})
export class CreateReservationSummaryComponent {
    @Input() reservation: Reservation;
    @Input() user: ProfileUser;

    @Input() specialRequests: string;
    @Output() specialRequestsChange = new EventEmitter<string>();

    onSpecialRequestsChanged() {
        this.specialRequestsChange.emit(this.specialRequests);
    }

    get selectedTableInfo() {
        const table = this.reservation.tables[0];

        return table
            ? `${table.tableType.name} (Maximum ${table.tableType.capacity} people)`
            : 'No Table Selected';
    }
}
