import { ApiProperty } from '@nestjs/swagger';
import {
	IsString,
	IsNotEmpty,
	IsEmail,
	IsStrongPassword
} from 'class-validator';

export class RegisterRequestDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'Elijah'
	})
	firstName: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'Molloy'
	})
	lastName: string;

	@IsString()
	@IsEmail()
	@ApiProperty({
		description: 'Email address for new account',
		example: 'testemail@gmail.com'
	})
	email: string;

	@IsString()
	@IsStrongPassword()
	@ApiProperty({
		description:
			'Lowercase + Uppercase characters, Number, Symbol, and at least 8 characters',
		example: 'password!sS3cur3'
	})
	password: string;
}
