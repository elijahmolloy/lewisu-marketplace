import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableVersioning({
		type: VersioningType.URI
	});

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true
		})
	);

	const config = new DocumentBuilder()
		.setTitle('LewisU Marketplace API')
		.setVersion('0.0.1')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger', app, document);

	await app.listen(3000);
}

bootstrap();
