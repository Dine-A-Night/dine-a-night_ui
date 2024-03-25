import { Component, Input } from '@angular/core';

@Component({
    selector: 'informational-text',
    templateUrl: './informational-text.component.html',
    styleUrls: ['./informational-text.component.scss'],
})
export class InformationalTextComponent {
    @Input() text = '';
}
