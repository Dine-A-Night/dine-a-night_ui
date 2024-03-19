interface TableData {
    _id?: string;
    restaurantId: string;
    position: TablePosition;
    tableType: TableType;
}

export class Table {
    _id?: string | null;
    restaurantId: string;
    position: TablePosition;
    tableType: TableType;

    constructor(data: TableData) {
        this._id = data?._id ?? null;
        this.restaurantId = data?.restaurantId ?? null;
        this.position = data?.position ?? null;
        this.tableType = data?.tableType ?? null;
    }
}

export type Tables = Table[];

export interface TablePosition {
    xCoord: number;
    yCoord: number;
}

export interface TableType {
    _id?: string;
    name: string;
    description: string;
    capacity: number;
    svgHtml: string;
    evalue: TableTypeEvalues;
}

export enum TableTypeEvalues {
    FRONT_DESK = 0,
    ENTRY = 1,
    SINGLE = 2,
    DOUBLE = 3,
    GROUP = 4,
    PARTY = 5,
}
