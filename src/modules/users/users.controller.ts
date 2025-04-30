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
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileInterceptorDecorator } from 'src/common/decorators/file-interceptor.decorator'
import { Request } from 'express'
import { AdminGuard } from 'src/admin/admin.guard'
import { roles } from 'src/enums/roles.enum'

@Controller('users')
export class UsersController {
	constructor(private _userService: UsersService) {}

	@UseGuards(new AdminGuard(roles.Admin))
	@Get('')
	getAllUsers() {
		return this._userService.getAllUsers()
	}

	@UseGuards(new AdminGuard(roles.Admin))
	@Get(':id')
	getUserById(@Param('id', ParseIntPipe) userId: number) {
		return this._userService.getUserById(userId)
	}

	@Post('')
	@FileInterceptorDecorator()
	createUser(
		@Req() req: Request,
		@Body() userData: CreateUserDto,
		@UploadedFile() file: Express.Multer.File
	) {
		const userSession = req['user'] as  { sub: number; email: string; rol: string }
		return this._userService.createUser(userSession, userData, file)
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
		@Req() req: Request,
		@Param('id', ParseIntPipe) userId: number,
		@Body() userData: UpdateUserDto,
		@UploadedFile() file: Express.Multer.File
	) {
		const userSession = req['user'] as  { sub: number; email: string; rol: string }
		return this._userService.updateUser(userSession, userId, userData, file)
	}

	@Delete(':id')
	deleteUser(@Req() req: Request, @Param('id', ParseIntPipe) userId: number) {
		const userSession = req['user'] as  { sub: number; email: string; rol: string }
		return this._userService.deleteUser(userSession, userId)
	}
}
