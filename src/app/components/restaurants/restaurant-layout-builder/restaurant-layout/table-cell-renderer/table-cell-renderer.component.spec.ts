import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCellRendererComponent } from './table-cell-renderer.component';

describe('TableCellRendererComponent', () => {
    let component: TableCellRendererComponent;
    let fixture: ComponentFixture<TableCellRendererComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TableCellRendererComponent],
        });
        fixture = TestBed.createComponent(TableCellRendererComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
