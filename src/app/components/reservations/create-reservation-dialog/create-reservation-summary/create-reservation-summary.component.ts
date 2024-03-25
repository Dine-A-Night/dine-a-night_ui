import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import { Reservation } from 'src/app/models/reservation.model';
import { ProfileUser } from 'src/app/models/user.model';
import { ReservationService } from 'src/app/services/reservation.service';

@Component({
    selector: 'create-reservation-summary',
    templateUrl: './create-reservation-summary.component.html',
    styleUrls: ['./create-reservation-summary.component.scss'],
})
export class CreateReservationSummaryComponent implements OnChanges {
    @Input() reservation: Reservation;
    @Input() user: ProfileUser;

    @Input() specialRequests: string;
    @Output() specialRequestsChange = new EventEmitter<string>();

    onSpecialRequestsChanged() {
        this.specialRequestsChange.emit(this.specialRequests);
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(this.reservation);
    }

    get selectedTableInfo() {
        const table = this.reservation.tables[0];

        return table
            ? `${table.tableType.name} (Maximum ${table.tableType.capacity} people)`
            : 'No Table Selected';
    }
}
