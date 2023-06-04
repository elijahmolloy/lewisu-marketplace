import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../enum/user-role.enum';
import { Document, HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document {
	constructor(partial: Partial<User>) {
		super();
		Object.assign(this, partial);
	}

	@Prop({ required: true, trim: true })
	firstName: string;

	@Prop({ required: true, trim: true })
	lastName: string;

	@Prop({
		immutable: true,
		required: true,
		trim: true,
		unique: true,
		index: true,
		lowercase: true
	})
	email: string;

	@Prop({ required: true, trim: true })
	password: string;

	@Prop({ enum: UserRole, default: UserRole.USER })
	role: UserRole;

	@Prop({ default: false })
	isEmailVerified: boolean;

	async isPasswordMatch(password: string): Promise<boolean> {
		return await bcrypt.compare(password, this.password);
	}
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', async function (next) {
	// Hash password if it has been updated
	if (this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 12);
	}

	// Reset isEmailVerified if email has been updated
	if (this.isModified('email')) {
		this.isEmailVerified = false;
	}

	next();
});

UserSchema.loadClass(User);
