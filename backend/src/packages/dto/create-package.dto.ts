import {
    IsString,
    IsNotEmpty,
    IsArray,
    ValidateNested,
    ArrayMinSize,
    IsMongoId,
    IsNumber,
    Min,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  class ServiceQuantityDto {
    @IsMongoId()
    service: string;
  
    @IsNumber()
    @Min(1)
    quantity: number;
  }
  
  export class CreatePackageDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ServiceQuantityDto)
    services: ServiceQuantityDto[];
  }
  