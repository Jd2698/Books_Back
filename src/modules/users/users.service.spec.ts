import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma.service';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

const mockPrismaService = {
  usuario: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

const mockUserData: CreateUserDto = {
  nombre: 'John Doe',
  email: 'john.doe@example.com',
  telefono: '3176568782',
  imagen: null,
};

const mockFile: Express.Multer.File = {
  filename: 'profile-picture.jpg',
  mimetype: 'image/jpeg',
  size: 1024,
  destination: '/uploads',
  path: '/uploads/profile-picture.jpg',
} as any;

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of users when getAllUsers is called', async () => {
    const mockUsers = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ];
    mockPrismaService.usuario.findMany.mockResolvedValue(mockUsers);
    const result = await service.getAllUsers();

    expect(result).toEqual(mockUsers);
    expect(mockPrismaService.usuario.findMany).toHaveBeenCalledTimes(1);
  });

  it('should return an user when getUserById is called', async () => {
    const userId = 10;
    const mockUser = { id: userId, name: 'John Doe' };

    mockPrismaService.usuario.findFirst.mockResolvedValue(mockUser);
    const result = await service.getUserById(10);

    expect(mockPrismaService.usuario.findFirst).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(result).toEqual(mockUser);
    expect(mockPrismaService.usuario.findFirst).toHaveBeenCalledTimes(1);
  });

  it('should return an exception when getUserById is not found', async () => {
    mockPrismaService.usuario.findFirst.mockResolvedValue(null);
    try {
      await service.getUserById(20);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('User not found');
    }
  });

  it('should successfully create a user with a file', async () => {
    mockPrismaService.usuario.create = jest
      .fn()
      .mockResolvedValue(mockUserData);

    const result = await service.createUser(mockUserData, mockFile);

    expect(mockPrismaService.usuario.create).toHaveBeenCalledWith({
      data: { ...mockUserData },
    });
    expect(result).toEqual({ ...mockUserData, fileName: mockFile.filename });
  });

  it('should successfully create a user without a file', async () => {
    mockPrismaService.usuario.create.mockResolvedValue(mockUserData);
    const result = await service.createUser(mockUserData, null);

    expect(mockPrismaService.usuario.create).toHaveBeenCalledWith({
      data: { ...mockUserData },
    });
    expect(result).toEqual({ ...mockUserData, fileName: 'users/default.jpg' });
  });

  it('should throw ConflictException when a non-P2002 error is thrown', async () => {
    const mockError: any = new Error('Mock Prisma error');
    mockError.code = 'P2002';
    mockPrismaService.usuario.create.mockRejectedValue(mockError);

    try {
      await service.createUser(mockUserData, null);
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.message).toBe('Field email already is in use');
    }
  });

  it('should throw an internalServerErrorException', async () => {
    const mockError: any = new Error('Some other error');
    mockPrismaService.usuario.create.mockRejectedValue(mockError);

    try {
      await service.createUser(mockUserData, null);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Internal Server Error');
    }
  });
});
