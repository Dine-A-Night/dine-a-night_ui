export class Review {
    _id?: string | null;
    user: User;
    restaurantId: string;
    rating: number;
    message: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;

    constructor(options: Review) {
        this._id = options._id ?? null;
        this.user = options.user;
        this.restaurantId = options.restaurantId;
        this.rating = options.rating;
        this.message = options.message;
        this.createdAt = options.createdAt ?? null;
        this.updatedAt = options.updatedAt ?? null;
    }
}

export type Reviews = Review[];

type User = {
    uid: string;
    displayName: string;
    profilePictureUrl: string;
};
