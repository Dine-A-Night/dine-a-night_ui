export class User {
    email?: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;

    constructor(user: User) {
        this.email = user.email ?? '';
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.phone = user.phone;
        this.role = user.role;
    }
}

export enum UserRole {
    ADMIN = 'Admin',
    CUSTOMER = 'Customer',
}
