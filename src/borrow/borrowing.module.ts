import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrowing } from './borrowing.entity';
import { BorrowRequest } from './borrow-request.entity';
import { BorrowingService } from './borrowing.service';
import { Item } from '../equipment/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Borrowing, BorrowRequest, Item])],
  providers: [BorrowingService],
  exports: [BorrowingService],
})
export class BorrowingModule {}