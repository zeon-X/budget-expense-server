import { AccountType } from "@prisma/client";
import { IsEnum, IsOptional, IsString, Length } from "class-validator";

export class CreateAccountDto {
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsEnum(AccountType)
  type!: AccountType;

  @IsOptional()
  @IsString()
  @Length(3, 10)
  currency?: string;
}
