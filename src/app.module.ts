import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TokensModule } from './tokens/tokens.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGODB_CONNECTION_URL),
		AuthModule,
		UsersModule,
		TokensModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
