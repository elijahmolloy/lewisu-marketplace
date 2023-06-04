export class UserDto {
	constructor(partial: Partial<UserDto>) {
		Object.assign(this, partial);
	}

	id: string;

	firstName: string;

	lastName: string;

	email: string;

	isEmailVerified: boolean;
}
