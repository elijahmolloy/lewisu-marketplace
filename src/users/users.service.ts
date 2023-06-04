import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<User>
	) {}

	public async create(createUserDto: CreateUserDto): Promise<User> {
		throw new NotImplementedException();
	}

	public async findAll(): Promise<User[]> {
		throw new NotImplementedException();
	}

	public async findOne(id: string): Promise<User> {
		throw new NotImplementedException();
	}

	public async findOneByEmail(email: string): Promise<User> {
		throw new NotImplementedException();
	}

	public async update(
		id: string,
		updateUserDto: UpdateUserDto
	): Promise<User> {
		throw new NotImplementedException();
	}

	public async remove(id: string): Promise<User> {
		throw new NotImplementedException();
	}

	private async isEmailTaken(
		email: string,
		excludeUserId: string = undefined
	): Promise<boolean> {
		const user = await this.userModel.findOne({
			email,
			_id: { $ne: excludeUserId }
		});

		return !!user;
	}
}
