import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';

@Controller('loans')
export class LoansController {
  constructor(private _loanSerivce: LoansService) {}

  @Get()
  getAllUsers() {
    return this._loanSerivce.getAllLoans();
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) loanId: number) {
    return this._loanSerivce.getLoan(loanId);
  }

  @Post('')
  createLoan(@Body() loanData: CreateLoanDto) {
    return this._loanSerivce.createLoan(loanData);
  }
}
