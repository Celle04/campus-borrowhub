import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Borrowing } from '../borrow/borrowing.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column()
  totalQuantity: number;

  @Column({ default: 0 })
  availableQuantity: number;

  @OneToMany(() => Borrowing, borrowing => borrowing.item)
  borrowings: Borrowing[];
}