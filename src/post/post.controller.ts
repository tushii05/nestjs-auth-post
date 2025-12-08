import { Controller, Post, Get, Body, UseInterceptors, UploadedFile, Logger, Query, } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiQuery, } from '@nestjs/swagger';

import { PostService } from './post.service';
import { FileService } from '../file/file.service';
import { FileUploadInterceptor } from '../file/file.interceptor';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginationQueryDto } from 'src/common/utils/pagination-query.dto';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('post')
export class PostController {
  private readonly logger = new Logger(PostController.name);

  constructor(
    private postService: PostService,
    private fileService: FileService,
  ) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePostDto })
  @UseInterceptors(FileUploadInterceptor('banner'))
  async create(
    @Body() dto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let bannerPath: string | null = null;

    if (file) {
      bannerPath = await this.fileService.saveFile(file, 'banners');
    }

    return this.postService.create({
      ...dto,
      banner: bannerPath,
    });
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(@Query() query: PaginationQueryDto) {
    return this.postService.findAll({
      ...query,
      searchableFields: ['name', 'description'],
    });
  }
}
