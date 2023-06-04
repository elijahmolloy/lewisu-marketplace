import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { TokenType } from '../enum/token-type.enum';

export type TokenDocument = HydratedDocument<Token>;

@Schema({ timestamps: true })
export class Token extends Document {
	constructor(partial: Partial<Token>) {
		super();
		Object.assign(this, partial);
	}

	@Prop({ required: true, index: true, unique: true })
	token: string;

	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: User.name
	})
	user: User;

	@Prop({ enum: TokenType, required: true })
	type: TokenType;

	@Prop({ required: true })
	expires: Date;

	@Prop({ default: false })
	blacklisted: boolean;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
