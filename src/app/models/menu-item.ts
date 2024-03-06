export interface MenuItem {
    _id?: string; // Optional if you include the _id in your responses
    restaurantId: string; // Assuming restaurantId is a string in your frontend
    name: string;
    description: string;
    unitPrice: number;
    imageUri?: string;
}
