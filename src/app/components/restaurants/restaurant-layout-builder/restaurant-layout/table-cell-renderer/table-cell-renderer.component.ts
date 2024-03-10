import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Table, TablePosition } from 'src/app/models/table.model';

@Component({
    selector: 'table-cell-renderer',
    templateUrl: './table-cell-renderer.component.html',
    styleUrls: ['./table-cell-renderer.component.scss'],
})
export class TableCellRendererComponent {
    @Input() table: Table;
    @Input() editMode: boolean = false;

    @Output() tableSelected = new EventEmitter<boolean>();

    private sanitizer = inject(DomSanitizer);

    getSanitizerBypassedHtml(rawHtml: string) {
        return rawHtml ? this.sanitizer.bypassSecurityTrustHtml(rawHtml) : null;
    }

    onTableCellSelected() {
        this.tableSelected.emit(true);
    }

    get svgButton() {
        return this
            .getSanitizerBypassedHtml(`<svg width="33" height="42" viewBox="0 0 33 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M30.6977 42C27.3255 42 27.4904 37.3304 30.6427 37.3304C33.7949 37.3304 33.7583 42 30.6977 42ZM23.0416 26.8104H8.83818C1.96557 26.8104 2.50163 21.0399 2.50163 21.0399L0 19.8947C0 16.4191 4.77876 15.558 5.37438 19.8947L5.60347 21.87H26.6795L27.1377 19.8947C28.054 15.4559 32.3379 16.4191 32.3379 19.8947L30.0471 21.0266C30.0471 21.0266 30.8305 26.8104 23.0416 26.8104ZM7.427 20.059L5.32398 5.65948C5.32398 1.487 9.47963 0 16.1415 0C22.8033 0 26.7253 1.38491 26.7253 5.9702L25.0438 19.624L7.427 20.059ZM3.02395 37.3304C6.17619 37.3304 6.15786 42 3.07893 42C-0.293231 42 -0.142035 37.3304 3.02395 37.3304ZM13.8689 30.9562L14.1897 27.747L17.9467 28.0399L18.4049 30.9341C27.2797 31.5155 30.3174 35.617 30.3174 35.617L27.8249 36.1985C27.8249 36.1985 25.7586 34.3164 18.3774 34.0457L17.7176 35.5992L15.2435 35.4927L14.5928 34.059C7.39493 34.3786 5.59889 36.3938 5.59889 36.3938L2.96439 35.5992C2.96439 35.5992 5.30566 31.5999 13.8689 30.9562ZM16.8242 37.3304C19.9764 37.3304 19.9581 42 16.8791 42C13.507 42 13.6582 37.3304 16.8242 37.3304Z" fill="black"/>
      </svg>`);
    }
}
