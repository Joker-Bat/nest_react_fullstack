import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateReportDto {
    @IsString()
    make: string;

    @IsString()
    model: string;

    @IsNumber()
    @Min(1930)
    @Max(new Date().getFullYear())
    year: number;

    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;

    @IsNumber()
    lng: number;

    @IsNumber()
    lat: number;

    @IsNumber()
    @Min(0)
    @Max(1000000)
    price: number;
}
