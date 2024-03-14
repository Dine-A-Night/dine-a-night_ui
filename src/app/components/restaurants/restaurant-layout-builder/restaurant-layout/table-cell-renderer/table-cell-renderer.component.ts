import { TableTypeEvalues } from './../../../../../models/table.model';

import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    inject,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Table, TablePosition, TableType } from 'src/app/models/table.model';
import { ReservationService } from 'src/app/services/reservation.service';

@Component({
    selector: 'table-cell-renderer',
    templateUrl: './table-cell-renderer.component.html',
    styleUrls: ['./table-cell-renderer.component.scss'],
})
export class TableCellRendererComponent implements OnInit {
    @Input() table: Table | null;
    @Input() editMode: boolean = false;

    @Input() isEdgeCell = false;

    tableTypes$: Observable<TableType[]>;
    TableTypeEvalues = TableTypeEvalues;

    // Services
    private sanitizer = inject(DomSanitizer);
    private reservationService = inject(ReservationService);

    ngOnInit(): void {
        this.tableTypes$ = this.reservationService.getTableTypes();
    }

    getSanitizerBypassedHtml(rawHtml: string) {
        return rawHtml ? this.sanitizer.bypassSecurityTrustHtml(rawHtml) : null;
    }

    sanitizeSvg(svgHtml: string, width: number, height: number): SafeHtml {
        // Remove existing width and height attributes
        let modifiedSvgHtml = svgHtml.replace(
            /width="[^"]*"/i,
            `width="${width}"`,
        );
        modifiedSvgHtml = modifiedSvgHtml.replace(
            /height="[^"]*"/i,
            `height="${height}"`,
        );

        // Set display property to inline
        modifiedSvgHtml = modifiedSvgHtml.replace(
            '<svg',
            '<svg style="display:inline"',
        );

        // Sanitize modified SVG HTML
        return this.sanitizer.bypassSecurityTrustHtml(modifiedSvgHtml);
    }

    //#region  Layout FormBuilder
    @Output() tableAdded = new EventEmitter<TableType>();

    onTableAdded(tableType: TableType) {
        this.tableAdded.emit(tableType);
    }

    //#endregion

    //#region Make Reservations
    @Output() tableSelected = new EventEmitter<boolean>();

    onTableCellSelected() {
        this.tableSelected.emit(true);
    }

    //#endregion
}
