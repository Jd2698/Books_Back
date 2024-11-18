import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private _prismaService: PrismaService) {}

  async getAllUsers(): Promise<any> {
    return await this._prismaService.usuario.findMany();
  }

  async getUser(userId: number): Promise<any> {
    return await this._prismaService.usuario.findFirst({
      where: {
        id: userId,
      },
    });
  }

  async createUser(userData: CreateUserDto): Promise<any> {
    const userCreated = await this._prismaService.usuario.create({
      data: userData,
    });

    return userCreated;
  }

  async updateUser(userId: number, userData: UpdateUserDto): Promise<any> {
    const userUpdated = await this._prismaService.usuario.update({
      where: { id: userId },
      data: userData,
    });

    return userUpdated;
  }

  async deleteUser(userId: number): Promise<any> {
    const userDeleted = await this._prismaService.usuario.delete({
      where: { id: userId },
    });

    return userDeleted;
  }
}
