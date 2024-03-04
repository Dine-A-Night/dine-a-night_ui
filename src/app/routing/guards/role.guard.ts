import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProfileUser, UserRole } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

export function roleGuard(roleName: UserRole): CanActivateFn {
    return async () => {
        const userService = inject(UserService);
        const currentUser: ProfileUser = await firstValueFrom(
            userService.currentUser$,
        );

        console.log(currentUser);

        return currentUser.role === roleName;
    };
}
