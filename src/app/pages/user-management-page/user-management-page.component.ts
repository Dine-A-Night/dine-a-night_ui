import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'user-management-page',
    templateUrl: './user-management-page.component.html',
    styleUrls: ['./user-management-page.component.scss'],
})
export class UserManagementPageComponent {
    personalDetailsForm = this.fb.group({
        firstName: [null, [Validators.required]],
        lastName: [null, [Validators.required]],
        phone: [
            null,
            [
                Validators.required,
                Validators.pattern(/^\d*$/),
                Validators.maxLength(10),
                Validators.minLength(10),
            ],
        ],
        role: [null, [Validators.required]],
    });

    constructor(private fb: FormBuilder) {}
}
