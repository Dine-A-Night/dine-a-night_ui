import { Component, Input } from '@angular/core';
import { MenuItem } from 'src/app/models/menu-item';

@Component({
    selector: 'preorder-form',
    templateUrl: './preorder-form.component.html',
    styleUrls: ['./preorder-form.component.scss'],
})
export class PreorderFormComponent {
    @Input() menuItems: MenuItem[] = [];
}
