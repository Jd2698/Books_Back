import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { unlink } from 'fs';
import { PrismaService } from 'src/prisma.service';
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

      // console.log(error)
      throw new InternalServerErrorException();
    }
  }

  async updateUser(
    userId: number,
    userData: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    try {
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
        this.deleteImage(deletedUser);
      }

      return deletedUser;
    } catch (error) {
      if (error.code == 'P2025') {
        throw new NotFoundException('User not found');
      }

      throw new InternalServerErrorException();
    }
  }

  async deleteImage(user: CreateUserDto) {
    const filePath = `images/${user.imagen}`;
    try {
      unlink(filePath, (err) => {
        if (err) {
          console.log('Image not found');
        }
      });
    } catch (error) {
      throw new NotFoundException('Image not found');
    }
  }
}
