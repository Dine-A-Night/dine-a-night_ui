import { isDefNotNull } from '../utils/helper-functions';
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
    layout: RestaurantDimensions;
    cuisines: Cuisine[];
    reviewCount: number;
    rating?: number;

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
        this.reviewCount = data?.reviewCount ?? 0;
        this.rating = data?.rating ?? 0;
    }

    hasValidLayout() {
        return isDefNotNull(this.layout);
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
    distance?: number; // Meters
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export type RestaurantDimensions = {
    length: number;
    width: number;
};
