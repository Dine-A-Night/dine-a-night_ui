import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMenuItemDialogComponent } from './add-menu-item-dialog.component';

describe('AddMenuItemDialogComponent', () => {
    let component: AddMenuItemDialogComponent;
    let fixture: ComponentFixture<AddMenuItemDialogComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AddMenuItemDialogComponent],
        });
        fixture = TestBed.createComponent(AddMenuItemDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
