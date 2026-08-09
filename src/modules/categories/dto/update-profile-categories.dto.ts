import {
    IsArray,
    IsMongoId,
    IsOptional
} from 'class-validator';

export class UpdateProfileCategoriesDto {
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  enabled?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  disabled?: string[];
}