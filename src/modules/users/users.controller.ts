import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Req,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileInterceptorDecorator } from 'src/common/decorators/file-interceptor.decorator'
import { Request } from 'express'

@Controller('users')
export class UsersController {
	constructor(private _userService: UsersService) {}

	@Get('')
	getAllUsers(@Req() req: Request) {
		// console.log(req['user'])
		return this._userService.getAllUsers()
	}

	@Get(':id')
	getUserById(@Param('id', ParseIntPipe) userId: number) {
		return this._userService.getUserById(userId)
	}

	@Post('')
	@FileInterceptorDecorator()
	createUser(
		@Body() userData: CreateUserDto,
		@UploadedFile() file: Express.Multer.File
	) {
		return this._userService.createUser(userData, file)
	}

	@Put(':id')
	@UseInterceptors(
		FileInterceptor('file', {
			fileFilter: (req, file, cb) => {
				if (!file.originalname.match(/\.+(jpg|jpeg|png)$/i)) {
					return cb(new BadRequestException('Image does not valid'), false)
				}
				return cb(null, true)
			}
		})
	)
	updateUser(
		@Param('id', ParseIntPipe) userId: number,
		@Body() userData: UpdateUserDto,
		@UploadedFile() file: Express.Multer.File
	) {
		return this._userService.updateUser(userId, userData, file)
	}

	@Delete(':id')
	deleteUser(@Param('id', ParseIntPipe) userId: number) {
		return this._userService.deleteUser(userId)
	}
}
