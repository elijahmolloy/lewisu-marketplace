import { TokenDto } from './auth-token.dto';

export class AuthTokensDto {
	constructor(partial: Partial<AuthTokensDto>) {
		Object.assign(this, partial);
	}

	access: TokenDto;

	refresh: TokenDto;
}
