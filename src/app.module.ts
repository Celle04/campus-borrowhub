import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ItemsModule } from './equipment/items.module';
import { UsersModule } from './users/users.module';
import { BorrowingModule } from './borrow/borrowing.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),  // <-- path to your public folder
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'borrowhub',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ItemsModule,
    UsersModule,
    BorrowingModule,
  ],
})
export class AppModule {}