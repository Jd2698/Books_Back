import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LoansService {
  constructor(private _prismaService: PrismaService) {}

  async getAllLoans(): Promise<any> {
    return await this._prismaService.prestamo.findMany();
  }

  async getLoan(loanId: number): Promise<any> {
    return await this._prismaService.prestamo.findFirst({
      where: {
        id: loanId,
      },
    });
  }

  async createLoan(loanData: any): Promise<any> {
    const userCreated = await this._prismaService.prestamo.create({
      data: loanData,
    });

    return userCreated;
  }
}
