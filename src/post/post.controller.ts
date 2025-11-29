import {
  Controller,
  Post as P,
  Get,
  Body,
  UseInterceptors,
  UploadedFile,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

import { PostService } from './post.service';
import { FileService } from '../file/file.service';
import { FileUploadInterceptor } from '../file/file.interceptor';
import { CreatePostDto } from './dto/create-post.dto';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('post')
export class PostController {
  private readonly logger = new Logger(PostController.name);

  constructor(
    private postService: PostService,
    private fileService: FileService,
  ) { }

  @P()
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
  findAll() {
    return this.postService.findAll();
  }
}
