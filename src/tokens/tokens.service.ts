import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { Token } from './entities/token.entity';
import { TokenType } from './enum/token-type.enum';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class TokensService {
	private readonly jwtSecret: string;
	private readonly accessExpirationMinutes: number;
	private readonly refreshExpirationDays: number;
	private readonly resetPasswordExpirationMinutes: number;
	private readonly verifyEmailExpirationMinutes: number;

	constructor(
		configService: ConfigService,
		@InjectModel(Token.name) private readonly tokenModel: Model<Token>,
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) {
		this.jwtSecret = configService.get('JWT_SECRET');
		this.accessExpirationMinutes = configService.get(
			'JWT_ACCESS_EXPIRATION_MINUTES'
		);
		this.refreshExpirationDays = configService.get(
			'JWT_REFRESH_EXPIRATION_DAYS'
		);
		this.resetPasswordExpirationMinutes = configService.get(
			'JWT_RESET_PASSWORD_EXPIRATION_MINUTES'
		);
		this.verifyEmailExpirationMinutes = configService.get(
			'JWT_VERIFY_EMAIL_EXPIRATION_MINUTES'
		);
	}

	async generateToken(
		userId: string,
		expires: moment.Moment,
		type: TokenType,
		secret = this.jwtSecret
	): Promise<string> {
		const payload = {
			sub: userId,
			iat: moment().unix(),
			exp: expires.unix(),
			type
		};

		return await this.jwtService.signAsync(payload, {
			secret
		});
	}

	async saveToken(
		token: string,
		userId: string,
		expires: moment.Moment,
		type: TokenType,
		blacklisted = false
	): Promise<Token> {
		return await this.tokenModel.create({
			token,
			user: userId,
			expires: expires.toDate(),
			type,
			blacklisted
		});
	}

	async verifyToken(token: string, type: TokenType): Promise<Token> {
		const payload = this.jwtService.verify(token, {
			secret: this.jwtSecret
		});
		const tokenDocument = await this.tokenModel.findOne({
			token,
			type,
			user: payload.sub,
			blacklisted: false
		});

		if (!tokenDocument) {
			throw new NotFoundException('Token not found');
		}

		return tokenDocument;
	}

	async generateAuthTokens(user: User): Promise<AuthTokensDto> {
		const accessTokenExpires = moment().add(
			this.accessExpirationMinutes,
			'minutes'
		);
		const accessToken = await this.generateToken(
			user.id,
			accessTokenExpires,
			TokenType.ACCESS
		);

		const refreshTokenExpires = moment().add(
			this.refreshExpirationDays,
			'days'
		);
		const refreshToken = await this.generateToken(
			user.id,
			refreshTokenExpires,
			TokenType.REFRESH
		);
		await this.saveToken(
			refreshToken,
			user.id,
			refreshTokenExpires,
			TokenType.REFRESH
		);

		return new AuthTokensDto({
			access: new TokenDto({
				token: accessToken,
				expires: accessTokenExpires.toDate()
			}),
			refresh: new TokenDto({
				token: refreshToken,
				expires: refreshTokenExpires.toDate()
			})
		});
	}

	async generateResetPasswordToken(email: string): Promise<Token> {
		const user = await this.usersService.findOneByEmail(email);
		if (!user) {
			throw new BadRequestException('No users found with this email');
		}

		const expires = moment().add(
			this.resetPasswordExpirationMinutes,
			'minutes'
		);
		const resetPasswordToken = await this.generateToken(
			user.id,
			expires,
			TokenType.RESET_PASSWORD
		);

		return await this.saveToken(
			resetPasswordToken,
			user.id,
			expires,
			TokenType.RESET_PASSWORD
		);
	}

	async generateVerifyEmailToken(user: User): Promise<Token> {
		const expires = moment().add(
			this.verifyEmailExpirationMinutes,
			'minutes'
		);
		const verifyEmailToken = await this.generateToken(
			user.id,
			expires,
			TokenType.VERIFY_EMAIL
		);

		return await this.saveToken(
			verifyEmailToken,
			user.id,
			expires,
			TokenType.VERIFY_EMAIL
		);
	}

	async deleteOneByTokenAndType(
		token: string,
		type: TokenType
	): Promise<Token> {
		const tokenDocument = await this.tokenModel.findOneAndDelete({
			token,
			type
		});
		if (!tokenDocument) {
			throw new NotFoundException('Token not found');
		}

		return tokenDocument;
	}

	async delete(id: number) {
		await this.tokenModel.findByIdAndDelete(id);
	}

	async deleteManyByUserIdAndType(userId: string, type: TokenType) {
		return await this.tokenModel.deleteMany({ user: userId, type });
	}
}
