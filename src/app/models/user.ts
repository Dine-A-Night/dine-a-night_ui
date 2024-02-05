export class ProfileUser {
    uid?: string;
    email?: string;
    firstName: string;
    lastName: string;
    phone: string;
    profilePictureUrl?: string;
    role: UserRole;

    constructor(user: ProfileUser) {
        this.uid = user.uid ?? '';
        this.email = user.email ?? '';
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.phone = user.phone;
        this.role = user.role;
        this.profilePictureUrl = user.profilePictureUrl ?? '';
    }
}

export enum UserRole {
    ADMIN = 'Admin',
    CUSTOMER = 'Customer',
}
