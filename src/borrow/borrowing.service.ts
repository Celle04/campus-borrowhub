import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrowing } from './borrowing.entity';
import { BorrowRequest } from './borrow-request.entity';
import { Item } from '../equipment/item.entity'; // ✅ FIXED

@Injectable()
export class BorrowingService {
  constructor(
    @InjectRepository(Borrowing)
    private readonly borrowingRepo: Repository<Borrowing>,

    @InjectRepository(BorrowRequest)
    private readonly requestRepo: Repository<BorrowRequest>,

    @InjectRepository(Item) // ✅ FIXED
    private readonly itemRepo: Repository<Item>,
  ) {}

  // =========================
  // BORROW REQUESTS
  // =========================

  createRequest(data: Partial<BorrowRequest>) {
    const request = this.requestRepo.create(data);
    return this.requestRepo.save(request);
  }

  findAllRequests() {
    return this.requestRepo.find({ relations: ['item'] });
  }

  findRequestById(id: number) {
    return this.requestRepo.findOneBy({ id });
  }

  async approveRequest(id: number) {
    const request = await this.requestRepo.findOne({
      where: { id },
      relations: ['item'],
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('Request already processed');
    }

    const item = request.item;

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (item.availableQuantity < request.quantity) {
      throw new Error('Not enough items available');
    }

    // Deduct quantity
    await this.itemRepo.update(item.id, {
      availableQuantity: item.availableQuantity - request.quantity,
    });

    // Update request status
    await this.requestRepo.update(id, { status: 'approved' });

    // Create borrowing record
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const borrowing = this.borrowingRepo.create({
      userId: request.userId,
      itemId: request.itemId,
      quantity: request.quantity,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'borrowed',
    });

    return this.borrowingRepo.save(borrowing);
  }

  async rejectRequest(id: number) {
    await this.requestRepo.update(id, { status: 'rejected' });
    return this.findRequestById(id);
  }

  // =========================
  // BORROWINGS
  // =========================

  create(data: Partial<Borrowing>) {
    const borrowing = this.borrowingRepo.create(data);
    return this.borrowingRepo.save(borrowing);
  }

  findAll() {
    return this.borrowingRepo.find({ relations: ['item'] });
  }

  findOne(id: number) {
    return this.borrowingRepo.findOneBy({ id });
  }

  findByUser(userId: number) {
    return this.borrowingRepo.find({
      where: { userId },
      relations: ['item'],
    });
  }

  // ✅ FIXED RETURN ITEM
  async returnItem(id: number) {
    const borrowing = await this.borrowingRepo.findOne({
      where: { id },
      relations: ['item'],
    });

    if (!borrowing) {
      throw new NotFoundException('Borrowing not found');
    }

    if (borrowing.status !== 'borrowed') {
      throw new Error('Item already returned or invalid status');
    }

    const item = borrowing.item;

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    // Add back quantity
    await this.itemRepo.update(item.id, {
      availableQuantity: item.availableQuantity + borrowing.quantity,
    });

    // Update borrowing record
    const returnDate = new Date().toISOString().split('T')[0];

    await this.borrowingRepo.update(id, {
      returnDate,
      status: 'returned',
    });

    return this.findOne(id);
  }

  remove(id: number) {
    return this.borrowingRepo.delete(id);
  }
}