import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Controller('reports')
@ApiTags('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }

  @Post()
  @Roles(Role.User, Role.Admin)
  @ApiCookieAuth()
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @Roles(Role.Admin)
  @ApiCookieAuth()
  approveReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ApproveReportDto,
  ) {
    return this.reportsService.changeApproval(id, body.approved);
  }

  @Get('/list')
  @Roles(Role.User, Role.Admin)
  @ApiCookieAuth()
  getList() {
    return this.reportsService.getAllReports();
  }
}
