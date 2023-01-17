import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApproveReportDto {
  @IsBoolean()
  @ApiProperty()
  approved: boolean;
}
