import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private repo: Repository<Post>,
  ) {}

  create(data: any) {
    const post = this.repo.create(data);
    return this.repo.save(post);
  }

  findAll() {
    return this.repo.find({ relations: ['user'] });
  }
}
