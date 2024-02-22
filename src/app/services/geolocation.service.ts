import { Injectable } from '@angular/core';
import { RestaurantLocation } from '../models/restaurant';

@Injectable({
    providedIn: 'root',
})
export class GeolocationService {
    private openStreetMapUrl =
        'https://nominatim.openstreetmap.org/search?format=json';

    constructor() {}

    async getCoordinatesByAddress(address: RestaurantLocation): Promise<any> {
        let url = new URL(this.openStreetMapUrl);

        if (address.city.length) url.searchParams.append('city', address.city);
        if (address.streetAddress.length)
            url.searchParams.append('street', address.streetAddress);
        if (address.province.length)
            url.searchParams.append('state', address.province);
        if (address.country.length)
            url.searchParams.append('country', address.country);
        if (address.postal.length)
            url.searchParams.append('postal', address.postal);

        const result = await (await fetch(url)).json();

        return result[0] ?? null;
    }
}
