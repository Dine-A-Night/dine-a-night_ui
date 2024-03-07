export class MenuItem {
    _id?: string;
    restaurantId?: string;
    name?: string;
    description?: string;
    unitPrice?: number;
    imageUri?: string;

    constructor(options: Partial<MenuItem> = {}) {
        this._id = options._id;
        this.restaurantId = options.restaurantId;
        this.name = options.name;
        this.description = options.description;
        this.unitPrice = options.unitPrice;
        this.imageUri = options.imageUri;
    }
}
