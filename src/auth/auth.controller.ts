import { Controller, NotImplementedException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	public async register() {
		throw new NotImplementedException();
	}

	@Post('login')
	public async login() {
		throw new NotImplementedException();
	}

	@Post('logout')
	public async logout() {
		throw new NotImplementedException();
	}

	@Post('refresh-tokens')
	public async refreshTokens() {
		throw new NotImplementedException();
	}

	@Post('forgot-password')
	public async forgotPassword() {
		throw new NotImplementedException();
	}

	@Post('reset-password')
	public async resetPassword() {
		throw new NotImplementedException();
	}

	@Post('send-verification-email')
	public async sendVerificationEmail() {
		throw new NotImplementedException();
	}

	@Post('verify-email')
	public async verifyEmail() {
		throw new NotImplementedException();
	}
}
