import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('users')
export class UsersController {
  constructor(private _userService: UsersService) {}

  @Get('')
  getAllUsers() {
    return this._userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) userId: number) {
    return this._userService.getUserById(userId);
  }

  @Post('')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, cb) => {
          const timestamp = new Date().toISOString().replace(/[-T:.]/g, '');
          const extension = file.mimetype.split('/')[1];
          cb(null, `users/${timestamp}.${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.+(jpg|jpeg|png)$/i)) {
          return cb(new Error('Image does not valid'), false);
        }
        return cb(null, true);
      },
    }),
  )
  createUser(
    @Body() userData: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this._userService.createUser(userData, file);
    // return { filename: file.filename };
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() userData: UpdateUserDto,
  ) {
    return this._userService.updateUser(userId, userData);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) userId: number) {
    return this._userService.deleteUser(userId);
  }
}
