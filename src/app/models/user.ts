export class ProfileUser {
    uid?: string;
    email?: string;
    displayName?: string;
    firstName: string;
    lastName: string;
    phone: string;
    profilePictureUrl?: string;
    role: UserRole;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(user: ProfileUser) {
        this.uid = user.uid ?? '';
        this.email = user.email ?? '';
        this.displayName = user.displayName;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.phone = user.phone;
        this.role = user.role;
        this.profilePictureUrl = user.profilePictureUrl ?? '';
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}

export enum UserRole {
    ADMIN = 'Admin',
    CUSTOMER = 'Customer',
}

export class ProfileUserSlim {
    uid?: string;
    email?: string;
    displayName?: string;

    constructor(user: ProfileUser) {
        this.uid = user.uid ?? '';
        this.email = user.email ?? '';
        this.displayName = user.displayName;
    }
}
