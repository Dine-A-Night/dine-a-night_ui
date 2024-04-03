import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'reservation-duration-form',
    templateUrl: './reservation-duration-form.component.html',
    styleUrls: ['./reservation-duration-form.component.scss'],
})
export class ReservationDurationFormComponent {
    @Input() reservationDurationForm: FormGroup;

    @Input() startAt: Date = new Date(Date.now());
}
