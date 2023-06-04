import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TokensModule } from './tokens/tokens.module';

@Module({
	imports: [ConfigModule.forRoot(), AuthModule, UsersModule, TokensModule],
	controllers: [],
	providers: []
})
export class AppModule {}
