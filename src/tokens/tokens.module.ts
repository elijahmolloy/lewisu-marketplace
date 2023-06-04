import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { Token, TokenSchema } from './entities/token.entity';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
		ConfigModule,
		UsersModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET
		})
	],
	providers: [TokensService],
	exports: [TokensService]
})
export class TokensModule {}
