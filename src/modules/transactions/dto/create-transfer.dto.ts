import {
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateTransferDto {
  @IsNumberString()
  amount!: string;

  @IsString()
  sourceAccountId!: string;

  @IsString()
  destinationAccountId!: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsDateString()
  transactionDate!: string;
}
