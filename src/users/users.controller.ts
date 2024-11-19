import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
export class UsersController {
	constructor(private _userService: UsersService) {}

	@Get()
	getAllUsers() {
		return this._userService.getAllUsers()
	}

	@Get(':id')
	getUserById(@Param('id', ParseIntPipe) userId: number) {
		return this._userService.getUserById(userId)
	}

	@Post('')
	createUser(@Body() userData: CreateUserDto) {
		return this._userService.createUser(userData)
	}

	@Put(':id')
	updateUser(
		@Param('id', ParseIntPipe) userId: number,
		@Body() userData: UpdateUserDto
	) {
		return this._userService.updateUser(userId, userData)
	}

	@Delete(':id')
	deleteUser(@Param('id', ParseIntPipe) userId: number) {
		return this._userService.deleteUser(userId)
	}
}
