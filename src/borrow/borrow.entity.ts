import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Borrowing {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  itemId: number;

  @Column()
  quantity: number;

  @Column()
  borrowDate: string;

  @Column()
  dueDate: string;

  @Column({ nullable: true })
  returnDate: string;

  @Column({ default: 'borrowed' })
  status: string; // borrowed, returned, overdue
}