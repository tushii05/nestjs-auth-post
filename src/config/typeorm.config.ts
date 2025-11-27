import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { env } from './constants';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123456',
  database: 'auth-rbac-post',
  autoLoadEntities: true,
  synchronize: true,
};
