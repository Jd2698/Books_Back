import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateLoanDto } from './create-loan.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateStatusLoan extends PartialType(CreateLoanDto) {
  @IsNotEmpty()
  @IsIn([0, 1], {
    message: 'Value must be 0 or 1',
  })
  entregado: number;
}
