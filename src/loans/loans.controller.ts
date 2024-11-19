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
import { UpdateStatusLoan } from './dto/update-status-loan.dto';

@Controller('loans')
export class LoansController {
  constructor(private _loanSerivce: LoansService) {}

  @Get()
  getAllLoans() {
    return this._loanSerivce.getAllLoans();
  }

  @Get(':id')
  getLoanById(@Param('id', ParseIntPipe) loanId: number) {
    return this._loanSerivce.getLoanById(loanId);
  }
  
  @Post('')
  createLoan(@Body() loanData: CreateLoanDto) {
    return this._loanSerivce.createLoan(loanData);
  }
  
  @Put(':id')
  updateStatusById(@Param('id', ParseIntPipe) loanId: number, @Body() loanData: UpdateStatusLoan) {
    return this._loanSerivce.updateStatusById(loanId, loanData);
  }
  
  @Delete(':id')
  deleteLoan(@Param('id', ParseIntPipe) loanId: number) {
    return this._loanSerivce.deleteLoan(loanId);
  }
}
