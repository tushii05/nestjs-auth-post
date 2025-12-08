import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/utils/pagination-query.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(@Query() query: PaginationQueryDto) {
    return this.userService.findAll({
      ...query,
      searchableFields: ['username'],
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }
}
