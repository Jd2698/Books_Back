import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { unlink } from 'fs/promises';
import { PrismaService } from '../../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private _prismaService: PrismaService) {}

  async getAllUsers(): Promise<CreateUserDto[]> {
    return await this._prismaService.usuario.findMany();
  }

  async getUserById(userId: number): Promise<CreateUserDto> {
    const user = await this._prismaService.usuario.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createUser(
    userData: CreateUserDto,
    file: Express.Multer.File,
  ): Promise<any> {
    try {
      file
        ? (userData.imagen = file.filename)
        : (userData.imagen = 'users/default.jpg');

      const userCreated = await this._prismaService.usuario.create({
        data: userData,
      });

      return { ...userCreated, fileName: userData.imagen };
    } catch (error) {
      if (error.code && error.code == 'P2002') {
        throw new ConflictException('Field email already is in use');
      }

      throw new InternalServerErrorException();
    }
  }

  async updateUser(
    userId: number,
    userData: UpdateUserDto,
    file: Express.Multer.File,
  ): Promise<UpdateUserDto> {
    try {
      if (file) {
        // eliminar si no es la default
        userData.imagen != 'users/default.jpg'
          ? await this.deleteImage(userData.imagen)
          : '';

        userData.imagen = file.filename;
      }

      const updatedUser = await this._prismaService.usuario.update({
        where: { id: userId },
        data: userData,
      });

      return updatedUser;
    } catch (error) {
      if (error.code == 'P2025') {
        throw new NotFoundException('User not found');
      }

      throw new InternalServerErrorException();
    }
  }

  async deleteUser(userId: number): Promise<CreateUserDto> {
    try {
      const deletedUser = await this._prismaService.usuario.delete({
        where: { id: userId },
      });

      if (deletedUser.imagen != 'users/default.jpg') {
        this.deleteImage(deletedUser.imagen);
      }

      return deletedUser;
    } catch (error) {
      if (error.code == 'P2025') {
        throw new NotFoundException('User not found');
      }

      throw new InternalServerErrorException();
    }
  }

  async deleteImage(imagePath: string) {
    const filePath = `images/${imagePath}`;
    try {
      unlink(filePath);
    } catch (error) {
      throw new NotFoundException('Image not found');
    }
  }
}
