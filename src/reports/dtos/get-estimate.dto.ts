import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetEstimateDto {
  @IsString()
  @ApiProperty()
  make: string;

  @IsString()
  @ApiProperty()
  model: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(new Date().getFullYear())
  @ApiProperty()
  year: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1000000)
  @ApiProperty()
  mileage: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  @ApiProperty()
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  @ApiProperty()
  lat: number;
}
