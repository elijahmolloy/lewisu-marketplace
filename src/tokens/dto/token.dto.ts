export class TokenDto {
	constructor(partial: Partial<TokenDto>) {
		Object.assign(this, partial);
	}

	token: string;

	expires: Date;
}
