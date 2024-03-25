import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from 'src/app/models/menu-item';
import { OrderLine } from 'src/app/models/order.model';

@Component({
    selector: 'preorder-form',
    templateUrl: './preorder-form.component.html',
    styleUrls: ['./preorder-form.component.scss'],
})
export class PreorderFormComponent {
    @Input() menuItems: MenuItem[] = [];
    @Output() orderLineChange = new EventEmitter<OrderLine>();

    onItemQuantityChanged(menuItem: MenuItem, quantity: number) {
        const orderLine = new OrderLine(menuItem, quantity);

        this.orderLineChange.emit(orderLine);
    }
}
