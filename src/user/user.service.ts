import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsOrder, ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { buildPagination, buildSearch, buildSorting, QueryOptions } from 'src/common/utils/pagination.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) { }

  async create(data: CreateUserDto) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async findAll(options: QueryOptions) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      order = 'DESC',
      search = '',
      searchableFields = ['username'],
    } = options;
    const { skip, take } = buildPagination(page, limit);
    const orderObj = buildSorting(sortBy, order);
    const where = buildSearch(search, searchableFields);


    const [users, total] = await this.repo.findAndCount({
      where,
      skip,
      take,
      order: orderObj,
    });

    return {
      data: users,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }
}
