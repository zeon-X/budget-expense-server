import {
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateExpenseDto {
  @IsNumberString()
  amount!: string;

  @IsString()
  accountId!: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsDateString()
  transactionDate!: string;
}
