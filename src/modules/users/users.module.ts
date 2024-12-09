import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { PrismaService } from 'src/prisma.service'
import { UsersRolesService } from './users_roles.service'

@Module({
	providers: [UsersService, UsersRolesService, PrismaService],
	controllers: [UsersController]
})
export class UsersModule {}
