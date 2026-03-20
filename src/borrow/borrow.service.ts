import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BorrowRequest } from './borrow-request.entity';
import { Borrowing } from './borrowing.entity';
import { Item } from '../equipment/item.entity';
import { User } from '../users/user.entity';

@Injectable()
export class BorrowingService {
  constructor(
    @InjectRepository(BorrowRequest)
    private borrowRequestRepo: Repository<BorrowRequest>,

    @InjectRepository(Borrowing)
    private borrowingRepo: Repository<Borrowing>,

    @InjectRepository(Item)
    private itemRepo: Repository<Item>,
  ) {}

  // Approve a borrow request
  async approveBorrowRequest(requestId: number): Promise<Borrowing> {
    // Fetch the request and its related item and user
    const request = await this.borrowRequestRepo.findOne({
      where: { id: requestId },
      relations: ['item', 'user'],
    });

    if (!request) {
      throw new NotFoundException('Borrow request not found');
    }

    const item = request.item;
    if (!item) {
      throw new NotFoundException('Item not found for this borrow request');
    }

    if (item.availableQuantity < request.quantity) {
      throw new Error('Not enough quantity available');
    }

    // Deduct item quantity
    item.availableQuantity -= request.quantity;
    await this.itemRepo.save(item);

    // Create a new Borrowing record
    const borrowing = this.borrowingRepo.create({
      userId: request.userId,
      itemId: request.itemId,
      quantity: request.quantity,
      borrowDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      status: 'borrowed',
    });

    return this.borrowingRepo.save(borrowing);
  }

  // Return an item
  async returnItem(borrowingId: number): Promise<Borrowing> {
    const borrowing = await this.borrowingRepo.findOne({
      where: { id: borrowingId },
      relations: ['item'],
    });

    if (!borrowing) {
      throw new NotFoundException('Borrowing record not found');
    }

    const item = borrowing.item;
    if (!item) {
      throw new NotFoundException('Item not found for this borrowing');
    }

    // Update item quantity
    item.availableQuantity += borrowing.quantity;
    await this.itemRepo.save(item);

    // Update borrowing record
    borrowing.returnDate = new Date().toISOString();
    borrowing.status = 'returned';

    return this.borrowingRepo.save(borrowing);
  }

  // Optional: list all borrowings
  async listBorrowings(): Promise<Borrowing[]> {
    return this.borrowingRepo.find({ relations: ['item', 'user'] });
  }
}   