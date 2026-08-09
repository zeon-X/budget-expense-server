import { AccountType } from "@prisma/client";
import { IsEnum, IsOptional, IsString, Length } from "class-validator";

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsEnum(AccountType)
  type?: AccountType;

  @IsOptional()
  @IsString()
  @Length(3, 10)
  currency?: string;
}
