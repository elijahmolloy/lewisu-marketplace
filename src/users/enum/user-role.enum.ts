import { SetMetadata } from '@nestjs/common';

export enum UserRole {
	USER = 'user',
	ADMIN = 'admin'
}

export const UserRoles = (...userRoles: UserRole[]) =>
	SetMetadata('userRoles', userRoles);
