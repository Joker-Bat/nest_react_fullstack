import { IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @IsString()
  @ApiProperty()
  make: string;

  @IsString()
  @ApiProperty()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(new Date().getFullYear())
  @ApiProperty()
  year: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  @ApiProperty()
  mileage: number;

  @IsNumber()
  @ApiProperty()
  lng: number;

  @IsNumber()
  @ApiProperty()
  lat: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  @ApiProperty()
  price: number;
}
