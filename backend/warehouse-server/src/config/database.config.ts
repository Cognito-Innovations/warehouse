import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Country } from '../countries/country.entity';
import { Rack } from '../racks/rack.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { User } from '../users/user.entity';
import { Package } from '../packages/package.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'warehouse',
  entities: [Country, Rack, Supplier, User, Package],
  synchronize: process.env.NODE_ENV !== 'production', // Only in development
  logging: process.env.NODE_ENV === 'development',
};
