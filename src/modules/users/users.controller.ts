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
import {
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiQuery
} from '@nestjs/swagger'

@Controller('users')
export class UsersController {
	constructor(private _userService: UsersService) {}

	@ApiQuery({ name: 'role', required: false, example: 'client' })
	@ApiOkResponse({ description: 'Lista de usuarios', type: [UpdateUserDto] })
	@ApiOperation({ summary: 'Obtener todos los usuarios' })
	@UseGuards(new AdminGuard(roles.Admin))
	@Get('')
	getAllUsers() {
		return this._userService.getAllUsers()
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obtener un usuario por ID' })
	@UseGuards(new AdminGuard(roles.Admin))
	getUserById(@Param('id', ParseIntPipe) userId: number) {
		return this._userService.getUserById(userId)
	}

	@Post('')
	@ApiOperation({ summary: 'Crear un usuario' })
	@ApiCreatedResponse({
		description: 'Usuario creado exitosamente',
		type: CreateUserDto
	})
	@FileInterceptorDecorator()
	createUser(
		@Req() req: Request,
		@Body() userData: CreateUserDto,
		@UploadedFile() file: Express.Multer.File
	) {
		const userSession = req['user'] as {
			sub: number
			email: string
			rol: string
		}
		return this._userService.createUser(userSession, userData, file)
	}

	@Put(':id')
	@ApiOperation({ summary: 'Actualizar un usuario' })
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
		const userSession = req['user'] as {
			sub: number
			email: string
			rol: string
		}
		return this._userService.updateUser(userSession, userId, userData, file)
	}

	@Delete(':id')
	deleteUser(@Req() req: Request, @Param('id', ParseIntPipe) userId: number) {
		const userSession = req['user'] as {
			sub: number
			email: string
			rol: string
		}
		return this._userService.deleteUser(userSession, userId)
	}
}
