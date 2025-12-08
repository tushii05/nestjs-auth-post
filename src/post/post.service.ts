import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { buildPagination, buildSearch, buildSorting, QueryOptions, } from '../common/utils/pagination.utils';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private repo: Repository<Post>,
  ) { }

  async create(data: any) {
    const post = this.repo.create(data);
    return this.repo.save(post);
  }

  async findAll(options: QueryOptions) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      order = 'DESC',
      search = '',
      searchableFields = ['name', 'description'],
    } = options;

    const { skip, take } = buildPagination(page, limit);
    const orderObj = buildSorting(sortBy, order);
    const where = buildSearch(search, searchableFields);

    const [results, total] = await this.repo.findAndCount({
      where,
      relations: ['user'],
      skip,
      take,
      order: orderObj,
    });

    return {
      data: results,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }
}
