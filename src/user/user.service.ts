import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsOrder, ILike, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) { }

  async create(data: any) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async findAll(
    page = 1,
    limit = 10,
    sortBy: keyof User = 'id',
    order: 'ASC' | 'DESC' = 'DESC',
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const where = search
      ? [
        { username: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) },
      ]
      : {};


    const orderObj: FindOptionsOrder<User> = {};
    orderObj[sortBy] = order;

    const [users, total] = await this.repo.findAndCount({
      where,
      order: orderObj,
      skip,
      take: limit,
    });

    return {
      data: users,
      total,
      page,
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
