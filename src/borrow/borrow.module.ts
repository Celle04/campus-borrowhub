import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowingService } from './borrowing.service';
import { Borrowing } from './borrowing.entity';
import { BorrowRequest } from './borrow-request.entity';
import { Item } from '../equipment/item.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Borrowing,
      BorrowRequest,
      Item,
      User,
    ]),
  ],
  providers: [BorrowingService],
  exports: [BorrowingService],
})
export class BorrowModule {}