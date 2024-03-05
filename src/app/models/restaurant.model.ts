import { ProfileUser } from './user.model';

export type Restaurants = Restaurant[];

export class Restaurant {
    _id: string;
    ownerId: string;
    name: string;
    description?: string;
    location: RestaurantLocation;
    coverPhotoUri: string;
    photoUris?: string[];
    staffMembers: ProfileUser[];
    layout: {
        length: number;
        width: number;
    };
    cuisines: Cuisine[];
    reviews?: any[]; // any for now

    constructor(data: any) {
        this._id = data?._id ?? null;
        this.ownerId = data?.ownerId ?? null;
        this.name = data?.name ?? null;
        this.description = data?.description ?? null;
        this.location = data?.location ?? null;
        this.coverPhotoUri = data?.coverPhotoUri ?? null;
        this.photoUris = data?.photoUris ?? [];
        this.staffMembers = data?.staffMembers ?? [];
        this.layout = data?.layout ?? null;
        this.cuisines = data?.cuisines ?? [];
        this.reviews = data?.reviews ?? [];
    }
}

export interface Cuisine {
    id: string;
    _id: string;
    name: string;
    imageUrl: string;
}

export interface RestaurantLocation {
    streetAddress: string;
    city: string;
    province: string;
    country: string;
    postal: string;
    coordinates: Coordinates;
}

export interface Coordinates {
    lat: number;
    lng: number;
}